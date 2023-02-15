import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../Styles/user-profile.css'
import userIcon from '../SVGs/user-icon.svg'
import logoutIcon from '../SVGs/logout-icon.svg'
import sidebarIcon from '../SVGs/sidebar-icon.png'
import {getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import {auth, storage} from '../firebase-config'
import Cookies from 'universal-cookie';
import { sendPasswordResetEmail, signOut, updateEmail, updateProfile } from 'firebase/auth'

const cookies = new Cookies();
export default function UserProfile() {
  const navigate = useNavigate();
  if(!cookies.get("auth-token")){
    navigate('/chatapp/signIn')
  }
  const [name, setName] = useState(localStorage.getItem('name'))
  const [email, setEmail] = useState(localStorage.getItem('email'))
  const [profilePicture, setProfilePicture] = useState();

  const handleNameChange = e =>{
    let newName = e.target.value;
    setName(newName)
    console.log("name", name)
  }
  const handleEmailChange = e =>{
    let newEmail = e.target.value;
    setEmail(newEmail)
  }
  // This function fetches the profile picture
  auth.onAuthStateChanged(async () => {
      const profilePictureRef = ref(storage, `Profile Pictures/ProfilePictureOf${auth.currentUser.uid}`)
      await getDownloadURL(profilePictureRef)
      .then(res => setProfilePicture(res))
    })

  // This function expands the sidebar
  function expandSidebar(){
    let mobileSidebar = document.getElementsByClassName('profile-sidebar')[0]
    mobileSidebar.classList.toggle('expanded');
  }
  // This function enables the Update Profile Picture Button and adds an event listener to that button to upload the new image on click
  function enableUpdatePictureBtn(newPicture){
    let updatePictureBtn = document.getElementsByClassName('update-profile-picture-btn')[0];
    updatePictureBtn.disabled = false;
    updatePictureBtn.addEventListener('click', async () =>{
      const storageRef = ref(storage, `Profile Pictures/ProfilePictureOf${auth.currentUser.uid}`)
      await uploadBytes(storageRef, newPicture)
      .then(() => window.location.reload())
    })
  }
  //This function enables the input elements which hold the user data
  function editInfo(){
    let editInfoBtn = document.getElementsByClassName('edit-btn')[0];
    let saveInfoBtn = document.getElementsByClassName('save-btn')[0];
    let resetPasswordButton = document.getElementsByClassName('reset-password-btn')[0];
    let inputElements = document.getElementsByClassName('user-information-inputs')[0].getElementsByTagName('input');
    
    editInfoBtn.style.display = "none";
    saveInfoBtn.style.display = "flex";
    resetPasswordButton.disabled = false;
    // This for loop enables the Name and Email input fields
    for(let i = 0; i < inputElements.length - 1; i++){
      inputElements[i].disabled = false;
    }
  }
  // This function saves the changes
  async function saveChanges(){
    await updateProfile(auth.currentUser, {displayName:name})
    await updateEmail(auth.currentUser, email)
    .then(() => {
      localStorage.setItem('name', name)
      localStorage.setItem('email', email)
      console.log(name, email)
      alert("Your Profile Has Been Updated")
      window.location.reload();
    })
  }
  // Reset password function
  async function resetPassword(){
    await sendPasswordResetEmail(auth, email)
    alert("A password reset email has been sent to you")
    await signOut(auth)
    localStorage.clear()
    navigate('/chatapp/signIn')
  }
  // Log out function
  async function logOut(){
    localStorage.clear();
    cookies.remove('authToken')
    await signOut(auth)
    .then(() => navigate('/chatApp/SignIn'))
  }
  return (
    <div className='profile-page'>
      {/* Profile Page Sidebar */}
      <div className="profile-sidebar">
        <button className="mobile-sidebar-btn" onClick={expandSidebar}><img className="sidebar-icon" src={sidebarIcon}/></button>
        <Link to="/chatapp/home">Chat App</Link>
        <div className="profile-btn-wrapper">
          <img className="user-icon" src={userIcon} alt="user icon"/><p>Profile</p>
        </div>
        <div className="logout-div">
          {/* This div will be used for a little animation when the user hovers on the log out div */}
          <div className="animation-div">
          <button className="logout-btn" onClick={logOut}>
            <img className='logout-icon' src={logoutIcon} alt="logout-icon"/>Log Out
          </button>
          </div>
        </div>
      </div>
      
      {/* Profile Details */}
      <div className="profile-details">
        <div className="profile-picture-wrapper">
          <img className='profile-picture' src={profilePicture} alt="Profile Picture"/>
          <div className="update-profile-picture-div">
            <p>Upload a new picture</p>
          <input type="file" onChange={e => enableUpdatePictureBtn(e.target.files[0])}/>
          <button className="update-profile-picture-btn" disabled>Update</button>
          </div>
        </div>

        <div className="user-information-wrapper">
          <h2>User Information</h2>
          <div className="user-information-inputs">
            <input type="text" value={name} onChange={e => handleNameChange(e)} disabled/>
            <input type="text" value={email} onChange={e => handleEmailChange(e)} disabled/>
            <div className="reset-password-div">
            <input type="password" value="************" disabled/>
            <button className='reset-password-btn' onClick={resetPassword} disabled>Reset Password</button>
            </div>
            <button className="edit-btn" onClick={editInfo}>Edit Information</button>
            <button className="save-btn" style={{display:"none"}} onClick={saveChanges}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}
