import React, {useState, useEffect, useRef} from 'react'
import {auth, storage, db} from '../firebase-config'
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore'
import {getDownloadURL, ref} from 'firebase/storage'
import sendButton from '../SVGs/send-button.png'
import { nanoid } from 'nanoid'
import '../Styles/chats.css'
export default function Chats({loggedUserProfilePicture, selectedRoom}) {
    
    const [roomMessages, setRoomMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const lastMessageRef = useRef(null);
    useEffect(() =>{
        async function fetchMessages(){
        const messagesRef = collection(db, "messages");
        const queryMessages = query(messagesRef, where("roomSentTo", "==", selectedRoom), orderBy("timeSent"))
        onSnapshot(queryMessages, snapshot =>{
          let messages = [];
          snapshot.forEach(async doc =>{
            //Date Variables
            let date = doc.data().timeSent.toDate();
            let day = date.getDate();
            let month;
            let year = date.getFullYear();

            //Time Variables
            let timeInMillis = date.getTime();
            //I have to increment the "hours" variable since the function returns an integer which is 1 number lower than it should be
            let hours = Math.floor((timeInMillis / 1000 / 60 / 60) % 24) + 1;
            let minutes = Math.floor((timeInMillis / 1000 / 60) % 60);
            
            if(hours == 24){
              hours = "00";
            }
            if(minutes.toString().length === 1) minutes = `0${minutes}`
            // Switch Statement to assign a month string to the "month" variable since the .getMonth() method returns an integer
            switch(date.getMonth()){
              case 0:
               month = "Jan";
                break;
              case 1:
                month = "Feb";
                  break;
              case 2:
                month = "Mar";
                  break;
              case 3:
                month = "Apr";
                  break;
              case 4:
                month = "May";
                  break;
              case 5:
                month = "June";
                  break;
              case 6:
                month = "July";
                  break;
              case 7:
                month = "Aug";
                  break;
              case 8:
                  month = "Sep";
                    break;
              case 9:
                month = "Oct";
                  break;
              case 10:
                month = "Nov";
                  break;
              case 11:
                month = "Dec";
                  break;
            }
        
            messages.push({...doc.data(), dateSent:`${day + " " + month + " " + year}` ,timeSent:`${hours + ":" + minutes}`, id:doc.id})
          })
            setRoomMessages(messages);
        })
      }
        fetchMessages()
        return () => fetchMessages()

    }, [])
      
      useEffect(() =>{
        lastMessageRef.current?.scrollIntoView();
      }, [roomMessages])

      async function sendMessage(e){
        e.preventDefault();
        if(!newMessage) return;
        setNewMessage("")
        const storageRef = ref(storage, `Profile Pictures/ProfilePictureOf${auth.currentUser.uid}`)
        let profilePicture;
        await getDownloadURL(storageRef)
        .then(res => profilePicture = res)
        const messagesCollection = collection(db, "messages");
        await addDoc(messagesCollection, {message:newMessage, senderID:auth.currentUser.uid, senderName:auth.currentUser.displayName, senderProfilePicture:profilePicture,roomSentTo:selectedRoom, timeSent:serverTimestamp()})
      }  
  return (
    <div className="chats-wrapper">
               <div className="messages-wrapper">
                <div className="room-title-wrapper"><h2>Room {selectedRoom}</h2></div>
                
                <div className="messages">
                  {roomMessages.map(messageFile =>{
                      if(messageFile.senderID === auth.currentUser.uid){
                        return (
                          <div key={nanoid()} className="logged-user-message">
                            <img className="logged-user-pfp" src={loggedUserProfilePicture} alt="pfp"/><p>{messageFile.message}</p>
                            <span className='logged-usr-time-msg-sent'>{messageFile.dateSent} {messageFile.timeSent}</span>
                          </div>
                        )
                      }else if(messageFile.senderID !== auth.currentUser.uid){
                       
                        return (
                          <div key={nanoid()} className="others-message">
                            <img className='sender-pfp' src={messageFile.senderProfilePicture} alt="pfp"/>
                            <span style={{fontWeight:"bold", marginTop:"20px"}}>{messageFile.senderName}:</span><p>{messageFile.message}</p>
                            <span className="others-time-msg-sent">{messageFile.dateSent} {messageFile.timeSent}</span>
                          </div>
                        )
                      }
                  })}
                  <div ref={lastMessageRef} className="scroller-div"></div>
                </div>

                <div className="message-form-wrapper">
                  <form className='message-form' onSubmit={e => sendMessage(e)}>
                    <input className="message-input" type="text" placeholder='Type a message' maxLength="500" value={newMessage} onChange={e => setNewMessage(e.target.value)}/>
                    <button className="send-button"><img src={sendButton} alt="send icon"/></button>
                  </form>
                </div>
                </div>
            </div>
  )
}
