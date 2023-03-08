import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Chats from './Chats'
import '../Styles/home.css'
import logoutIcon from '../SVGs/logout-icon.svg'
import sidebarIcon from '../SVGs/sidebar-icon.png'
import {auth, storage} from '../firebase-config'
import {signOut} from 'firebase/auth'
import {getDownloadURL, ref} from 'firebase/storage'
import Cookies from 'universal-cookie'
import { nanoid } from 'nanoid'
const cookies = new Cookies();

export default function Home() {
  const navigate = useNavigate();

  const [selectedRoom, setSelectedRoom] = useState(Number);
  const [isRoomSelected, setIsRoomSelected] = useState(false);
  const [loggedUserProfilePicture, setLoggedUserProfilePicture] = useState('');

  useEffect(()=>{
    if(!cookies.get("auth-token")){
      navigate("/signIn")
    }
    auth.onAuthStateChanged(()=>{
      (async function fetchLoggedUserProfilePicture(){
        const profilePictureRef = ref(storage, `Profile Pictures/ProfilePictureOf${auth.currentUser.uid}`)
        await getDownloadURL(profilePictureRef)
        .then(url =>{
          setLoggedUserProfilePicture(url)
        })
      })();
    })
  }, [])
  
  async function logOut(){
    await signOut(auth).then(()=>{
      localStorage.clear();
      cookies.remove('auth-token')
      navigate("/signIn")
    })
  }
   function enterRoom(e){
    e.preventDefault(); 
    setIsRoomSelected(true);
  }
  function leaveRoom(){
    setSelectedRoom(0)
    setIsRoomSelected(prevValue => !prevValue)
  }
  // This function toggles the div with the view profile button which is found at the bottom and the sidebar
  function showMoreOptions(){
    let optionListDiv = document.getElementsByClassName('option-list-div')[0];
    if(optionListDiv.style.display === "none"){
      optionListDiv.style.display = "flex";
    }else{
      optionListDiv.style.display = "none";
    }
  }
  // This function toggles the mobile sidebar
  function toggleMobileSidebar(){
    let mobileSidebar = document.getElementsByClassName('sidebar-mobile')[0];
    mobileSidebar.classList.toggle("sidebar-mobile-expanded")

    if(!mobileSidebar.classList.contains('sidebar-mobile-expanded')){
      let userInfoMobile = document.getElementsByClassName('user-info-mobile')[0];
      let leaveRoomButton = document.getElementsByClassName('leave-room-btn-mobile')[0];

      userInfoMobile.style.display = "none";
      leaveRoomButton.style.display = "none";
    }else{
      let userInfoMobile = document.getElementsByClassName('user-info-mobile')[0];
      let leaveRoomButton = document.getElementsByClassName('leave-room-btn-mobile')[0];

      userInfoMobile.style.display = "flex";
      leaveRoomButton.style.display = "flex";
    }
  }
  // This function toggles the div with the view profile button for mobile
  function showMoreOptionsMobile(){
    let optionListDivMobile = document.getElementsByClassName('option-list-div-mobile')[0]
    if(optionListDivMobile.style.display === "none"){
      optionListDivMobile.style.display = "flex";
    }else{
      optionListDivMobile.style.display = "none";
    }
  }
  return (
    <div className='home-container'>
      {/* Sidebar */}
      <div className="sidebar">
      {isRoomSelected && <button className='leave-room-btn' onClick={() => leaveRoom()}><img src={logoutIcon} alt="Log Out"/>Leave Room</button>}
        <div className="user-info">
          <div className="user-name-pfp"> 
          <Link to="/userProfile"><img className="user-icon" src={loggedUserProfilePicture} alt="User Icon"/></Link>
          <p>{localStorage.getItem('name')}</p>
          <div className="sign-out-div">
          <button className='logout-btn' onClick={logOut}><img className="logout-img" src={logoutIcon} alt="log out icon"/></button>
          </div>
          </div>
          <div className="more-options-div">
            <button className='more-options-btn' onClick={() => showMoreOptions()}>···</button>
            <div className="option-list-div">
              <ul>
                <li><Link className='view-profile-btn' to="/userProfile">View Profile</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for mobile Devices */}

      <div className="sidebar-mobile">
        
          {isRoomSelected && <button className='leave-room-btn-mobile' onClick={() => leaveRoom()}><img src={logoutIcon} alt="Log out"/>Leave Room</button>}
          <button className="mobile-sidebar-btn" onClick={() => toggleMobileSidebar()}><img src={sidebarIcon} alt="Hamburger Menu"/></button>

          <div className="user-info-mobile">
          <Link to="/userProfile"><img className="user-icon-mobile" src={loggedUserProfilePicture} alt="User Icon"/></Link>
          <p>{localStorage.getItem('name')}</p>
          <div className="sign-out-div-mobile">
          <button className='logout-btn-mobile' onClick={logOut}><img className="logout-img-mobile" src={logoutIcon} alt="log out icon"/></button>
          </div>
          <div className="more-options-div-mobile">
            <button className='more-options-btn-mobile' onClick={() => showMoreOptionsMobile()}>···</button>
            <div className="option-list-div-mobile">
              <ul>
                <li><Link className='view-profile-btn-mobile' to="/userProfile">View Profile</Link></li>
              </ul>
            </div>
          </div>
          </div>

      </div>

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
          
          {isRoomSelected && <Chats key={nanoid()} loggedUserProfilePicture={loggedUserProfilePicture} selectedRoom={selectedRoom}/>}
      </div>
  )
}