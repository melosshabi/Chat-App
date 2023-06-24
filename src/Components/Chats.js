import React, {useState, useEffect, useRef} from 'react'
// Firebase
import {auth, storage, db} from '../firebase-config'
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import {deleteObject, getDownloadURL, ref, uploadBytes} from 'firebase/storage'
// Functions
import { toggleMobileSidebar } from './Sidebar'
// Images
import sendButton from '../SVGs/send-button.png'
import plusIcon from '../SVGs/plus.png'
import sidebarIcon from '../SVGs/sidebar-icon.png'
import xIcon from '../SVGs/close.png'
// ID generator
import { nanoid } from 'nanoid'
// CSS
import '../Styles/chats.css'

export default function Chats({profilePicture, selectedRoom}) {

    
    const [roomMessages, setRoomMessages] = useState([]);
    const [newMessage, setNewMessage] = useState()
    const [messageToDelete, setMessageToDelete] = useState()
    const [deletetionInProgress, setDeletionInProgress] = useState(false)
    const messageToEdit = useRef('')
    const lastMessageRef = useRef(null);

    useEffect(() =>{
        async function fetchMessages(){
        const messagesRef = collection(db, "messages");
        const queryMessages = query(messagesRef, where("roomSentTo", "==", selectedRoom), orderBy("timeSent"))
        onSnapshot(queryMessages, snapshot =>{
          let messages = [];
          snapshot.forEach(doc => {
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
            
            if(hours === 24){
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
              default:
                month = "";
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

      const [selectedImage, setSelectedImage] = useState(null)
      const [selectedImageSrc, setSelectedImageSrc] = useState(null)
      const [selectedVideo, setSelectedVideo] = useState(null)
      const [selectedVideoSrc, setSelectedVideoSrc] = useState(null)
      const [imageToViewInFullscreen, setImageToViewInFullscreen] = useState(null)

      function selectFile(){
        document.querySelector('.files-input').click()
      }

      // This function returns the extension of a file
      function getExtension(filename){
        const parts = filename.split('.')
        return parts[parts.length - 1]
      }

      function handleFileChange(file){
        const extension = getExtension(file.name)
        switch(extension.toLowerCase()){
          case 'jpg':
            setSelectedImage(file)
            const jpgReader = new FileReader()
            jpgReader.onload = e => setSelectedImageSrc(e.target.result)
            jpgReader.readAsDataURL(file)
            break;
          case 'jpeg':
            setSelectedImage(file)
            const jpegReader = new FileReader()
            jpegReader.onload = e => setSelectedImageSrc(e.target.result)
            jpegReader.readAsDataURL(file)
            break;
          case 'gif':
            setSelectedImage(file)
            const gifReader = new FileReader()
            gifReader.onload = e => setSelectedImageSrc(e.target.result)
            gifReader.readAsDataURL(file)
            break;
          case 'png':
            setSelectedImage(file);
            const pngReader = new FileReader()
            pngReader.onload = e => setSelectedImageSrc(e.target.result)
            pngReader.readAsDataURL(file)
            break;
          case 'mp4':
            setSelectedVideo(file)
            const blobUrl = URL.createObjectURL(file)
            setSelectedVideoSrc(blobUrl)
            break;

          default:
            return ''
        }
        document.querySelector('.files-preview').classList.add('active-file-preview')
      }

      function toggleImageFullscreen(url){
        setImageToViewInFullscreen(url)
        document.querySelector('.fullscreen-image-wrapper').classList.toggle('active-fullscreen-image-wrapper')
      }

      // The function that toggles the small div which has the edit and delete buttons
      function toggleMoreOptions(e, index) {
        e.preventDefault()
        document.querySelectorAll('.message-wrapper')[index].querySelector('.logged-user-message-options').classList.toggle('active-more-options')
        return false
      }

      // Makes the p tag editable and shows the save button
      function editMessage(index, message){
        // This line makes the edit and delete buttons disappear
        document.querySelectorAll('.message-wrapper')[index].querySelector('.logged-user-message-options').classList.remove('active-more-options')
        document.querySelectorAll('.message-wrapper')[index].querySelector('.message').contentEditable = true
        document.querySelectorAll('.message-wrapper')[index].querySelector('.save-edit-message').classList.add('active-edit-message')
        messageToEdit.current = message
      }

      // Saves the edited message to the database
      async function saveEdit(index){
        // Make the p tag uneditable
        const messageWrapper = document.querySelectorAll('.message-wrapper')[index];
        const p = messageWrapper.querySelector('.message')
        p.contentEditable = false
        messageWrapper.querySelector('.save-edit-message').classList.remove('active-edit-message')
        const messageRef = doc(db, 'messages', messageToEdit.current.id)
        await updateDoc(messageRef, {message:p.innerText})
      }

      function toggleDeleteModal(message){
        document.querySelector('.confirm-delete-modal').classList.toggle('active-delete-modal')
        setMessageToDelete(message)
      }

      async function deleteMessage(){
        setDeletionInProgress(true)
        if(messageToDelete.imageName){
          const imageRef = ref(storage, `MessagesImages/${messageToDelete.imageName}`)
          await deleteObject(imageRef)
        }
        if(messageToDelete.videoName){
          const videoRef = ref(storage, `MessagesVideos/${messageToDelete.videoName}`)
          await deleteObject(videoRef)
        }
        const messageRef = doc(db, 'messages', messageToDelete.id)
        await deleteDoc(messageRef)
        .then(() => {
          toggleDeleteModal({})
          setDeletionInProgress(false)
        })
      }

       // The function which sends the message to the db
       async function sendMessage(e){
        e.preventDefault()
        if(!newMessage) return
        setNewMessage('')
        document.querySelector('.files-preview').classList.remove('active-file-preview')
        let imageName = null
        let imageUrl = null
        let videoName = null
        let videoUrl = null

        if(selectedImage){
          const metadata = {
            customMetadata:{
              "uploaderName":auth.currentUser.displayName,
              "uploaderId":auth.currentUser.uid
            }
          }
          imageName = nanoid()
          const imageRef = ref(storage, `MessagesImages/${imageName}`)
          await uploadBytes(imageRef, selectedImage, metadata)
          await getDownloadURL(imageRef).then(res => imageUrl = res)
        }

        if(selectedVideo){
          const metadata = {
            customMetadata:{
              "uploaderName":auth.currentUser.displayName,
              "uploaderId":auth.currentUser.uid
            }
          }
          videoName = nanoid()
          const videoRef = ref(storage, `MessagesVideos/${videoName}`)
          await uploadBytes(videoRef, selectedVideo, metadata)
          await getDownloadURL(videoRef).then(res => videoUrl = res)
        }
        
        setSelectedImage(null)
        setSelectedImageSrc(null)
        setSelectedVideo(null)
        setSelectedVideoSrc(null)

        const messagesCollection = collection(db, "messages")
        await addDoc(messagesCollection, {
          message:newMessage, senderID:auth.currentUser.uid, senderName:auth.currentUser.displayName, 
          senderProfilePicture:auth.currentUser.photoURL, roomSentTo:selectedRoom,
          imageName, imageUrl, videoName, videoUrl,
          timeSent:serverTimestamp()
        })
      }  

  return (
    <div className="chats-wrapper">
               <div className="messages-wrapper">
                <div className="room-title-wrapper">
                <button className="mobile-sidebar-btn mobile-sidebar-btn-chats" onClick={() => toggleMobileSidebar()}><img src={sidebarIcon} alt="Hamburger Menu"/></button>
                  <h2>Room {selectedRoom}</h2></div>
                
                <div className="messages">
                  {roomMessages.map((messageFile, index) =>{
                      if(messageFile.senderID === auth.currentUser.uid){
                        return (
                          <div key={nanoid()} className="logged-user-message-wrapper message-wrapper" onContextMenu={e => toggleMoreOptions(e, index)} onClick={() => document.querySelectorAll('.message-wrapper')[index].querySelector('.logged-user-message-options').classList.remove('active-more-options')}>
                            <div className='logged-user-message'><img className="logged-user-pfp" src={profilePicture} alt="pfp"/><p className='message'>{messageFile.message}</p></div>
                              {/* Image */}
                              {messageFile.imageUrl && <div className='message-picture-wrapper'><img src={messageFile.imageUrl} className='message-picture' style={{cursor:'pointer'}} onClick={() => toggleImageFullscreen(messageFile.imageUrl)}/></div>}
                              {/* Video */}
                              {messageFile.videoUrl && <div className='message-video-wrapper'>
                                <video className='message-video' controls>
                                  <source src={messageFile.videoUrl}/>
                                </video>
                                </div>}
                            <span className='logged-usr-time-msg-sent'>{messageFile.dateSent} {messageFile.timeSent}</span>
                            <div className="logged-user-message-options">
                              <button className="logged-user-options-btns" onClick={() => editMessage(index, messageFile)}><span>Edit</span></button>
                              <button className="logged-user-options-btns" onClick={() => toggleDeleteModal(messageFile)}><span>Delete</span></button>
                            </div>
                            <button className='save-edit-message' onClick={() => saveEdit(index)}>Save</button>
                          </div>
                        )
                      }else if(messageFile.senderID !== auth.currentUser.uid){
                       
                        return (
                          <div key={nanoid()} className="others-message-wrapper message-wrapper">
                            <div className="others-message">
                              <img className='sender-pfp' src={messageFile.senderProfilePicture} alt="pfp"/>
                              <span style={{fontWeight:"bold", marginTop:"20px"}}>{messageFile.senderName}:</span><p>{messageFile.message}</p>
                            </div>
                            {/* Image */}
                            {messageFile.imageUrl && <div className='message-picture-wrapper'><img src={messageFile.imageUrl} className='message-picture' style={{cursor:'pointer'}} onClick={() => toggleImageFullscreen(messageFile.imageUrl)}/></div>}
                              {/* Video */}
                              {messageFile.videoUrl && <div className='message-video-wrapper'>
                                <video className='message-video' controls>
                                  <source src={messageFile.videoUrl}/>
                                </video>
                                </div>}
                            <span className="others-time-msg-sent">{messageFile.dateSent} {messageFile.timeSent}</span>
                          </div>
                        )
                      }
                  })}
                  <div ref={lastMessageRef} className="scroller-div"></div>
                </div>

                <div className="message-form-wrapper">
                  <form className='message-form' onSubmit={e => sendMessage(e)}>
                    {/* This div will display above the text input so the user can see the selcted file */}
                    <div className="files-preview">
                      {selectedImage && <img src={selectedImageSrc}/>}
                      {selectedVideo &&<video controls>
                        <source src={selectedVideoSrc}/>
                      </video>}
                    </div>
                    <abbr title='Upload image or video' onClick={() => selectFile()}><img src={plusIcon} className='plus-icon'/></abbr>
                    {/* Seperator div between add file button and message input */}
                      <div className="message-input-separator"></div>
                    <input className="message-input" type="text" placeholder='Type a message' maxLength="500" value={newMessage} onChange={e => setNewMessage(e.target.value)}/>
                    <button className="send-button"><img src={sendButton} alt="send icon"/></button>
                    <input className='files-input' onChange={e => handleFileChange(e.target.files[0])} type="file" accept="image/png, image/jpeg, image/gif, video/mp4"/>
                  </form>
                </div>
                </div>

                {/* Confirm message deletion modal */}
                <div className="confirm-delete-modal">
                  <div className="title-message-wrapper">
                    <h2>Are you sure you want to delete this message?</h2>
                  
                  <div className="logged-user-message message-to-delete">
                    {messageToDelete && <p><img src={profilePicture} style={{width:'60px', borderRadius:'50%', display:'inline-block', verticalAlign:'middle'}}/>{messageToDelete.message}</p>}
                    {messageToDelete && <span className='logged-usr-time-msg-sent message-to-delete-date'>{messageToDelete.dateSent} {messageToDelete.timeSent}</span>}
                  </div>

                  <div className="modal-btns-wrapper">
                    <button className='modal-btns' onClick={() => document.querySelector('.confirm-delete-modal').classList.remove('active-delete-modal')}>No</button> <button className='modal-btns delete-btn' onClick={deleteMessage} disabled={deletetionInProgress}>{!deletetionInProgress ? "Yes" : "Deleting..."}</button>
                  </div>
                  </div>
                </div>
                {/* Div to view image in fullscreen */}
                <div className="fullscreen-image-wrapper">
                  <button className="close-fullscreen-image-btn" onClick={() => toggleImageFullscreen(" ")}><img src={xIcon}/></button>
                 <img src={imageToViewInFullscreen} className='fullscreen-image'/>
                </div>
            </div>
  )
}
