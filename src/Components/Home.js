import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// Components
import Chats from './Chats'
import Sidebar from './Sidebar'
import {auth} from '../firebase-config'
import { nanoid } from 'nanoid'
// CSS
import '../Styles/home.css'

export default function Home() {

  const navigate = useNavigate()

  const [selectedRoom, setSelectedRoom] = useState(1)
  const [isRoomSelected, setIsRoomSelected] = useState(false)
  const [profilePicture, setProfilePicture] = useState('')

  useEffect(()=>{

    auth.onAuthStateChanged(()=>{
      if(!auth.currentUser) navigate('/signIn')
      else setProfilePicture(auth.currentUser.photoURL)
    })

    const sessionSelectedRoom = sessionStorage.getItem('selectedRoom')
    const sessionIsRoomSelected = sessionStorage.getItem('isRoomSelected')
    if(sessionSelectedRoom && sessionIsRoomSelected){
      setIsRoomSelected(sessionIsRoomSelected)
      setSelectedRoom(sessionSelectedRoom)
    }

   
  }, [])
  
   function enterRoom(e){
    e.preventDefault(); 
    setIsRoomSelected(true);
    sessionStorage.setItem('selectedRoom', selectedRoom)
    sessionStorage.setItem('isRoomSelected', selectedRoom)
  }
  return (
    <div className='home-container'>
     
      <Sidebar isRoomSelected={isRoomSelected} setIsRoomSelected={setIsRoomSelected} setSelectedRoom={setSelectedRoom} profilePicture={profilePicture}/>
      {/* Room Selection form */}
      {!isRoomSelected && <div className="room-selection-wrapper">
        <div className="room-selection-form-wrapper">
          <h1>Select a Room</h1>
          <p>1-100</p>
          <form className="room-input-form" onSubmit={e =>{enterRoom(e)}}>
            <input type="number" className="room-input" min="1" max="100" placeholder='Room' value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)}/>
            <button className="enter-room-btn">Enter Room</button>
          </form>
          </div>        
          </div>}
          
          {isRoomSelected && <Chats key={nanoid()} profilePicture={profilePicture} selectedRoom={selectedRoom}/>}
      </div>
  )
}