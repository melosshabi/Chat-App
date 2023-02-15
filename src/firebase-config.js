// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBaAuQrTgTN-rt6oZiMGlmelxtdS3eMcU",
  authDomain: "real-time-chat-app-fcfeb.firebaseapp.com",
  projectId: "real-time-chat-app-fcfeb",
  storageBucket: "real-time-chat-app-fcfeb.appspot.com",
  messagingSenderId: "485390281691",
  appId: "1:485390281691:web:f3f5de41203228139d15fe"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage();
