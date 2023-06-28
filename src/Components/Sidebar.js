import React, { useEffect, useState } from 'react'
import {useNavigate, Link} from 'react-router-dom'
// Firebase
import { signOut } from 'firebase/auth'
import { auth } from '../firebase-config'
// Icons
import logoutIcon from '../SVGs/logout-icon.svg'
import sidebarIcon from '../SVGs/sidebar-icon.png'
import Cookies from 'universal-cookie'
const cookies = new Cookies();

  // This function toggles the mobile sidebar
export function toggleMobileSidebar(){
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

export default function Sidebar({isRoomSelected, setIsRoomSelected, setSelectedRoom}) {

    const navigate = useNavigate()

    const [profilePicture, setProfilePicture] = useState()

    useEffect(() => {
      auth.onAuthStateChanged(() => {
        setProfilePicture(auth.currentUser.photoURL)
      })
    }, [])

    function leaveRoom(){
        setSelectedRoom(1)
        setIsRoomSelected(false)
        sessionStorage.clear()
      }
      // This function toggles the div with the view profile button which is found at the bottom and the sidebar
      function showMoreOptions(){
        document.querySelector('.option-list-div').classList.toggle('active-option-list')
      }
     
      // This function toggles the div with the view profile button for mobile
      function showMoreOptionsMobile(){
        document.querySelector('.option-list-div-mobile').classList.toggle('active-mobile-option-list')
      }

      async function logOut(){
        await signOut(auth).then(()=>{
          localStorage.clear();
          cookies.remove('auth-token')
          navigate("/signIn")
        })
      }

  return (
    <>
     {/* Sidebar */}
     <div className="sidebar">
     {isRoomSelected && <button className='leave-room-btn' onClick={() => leaveRoom()}><img src={logoutIcon} alt="Log Out"/>Leave Room</button>}
       <div className="user-info">
         <div className="user-name-pfp"> 
         <Link to="/userProfile"><img className="user-icon" src={profilePicture} alt="User Icon"/></Link>
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
         <Link to="/userProfile"><img className="user-icon-mobile" src={profilePicture} alt="User Icon"/></Link>
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
     </>
  )
}
