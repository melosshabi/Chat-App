import './App.css';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Home from './Components/Home';
import UserProfile from './Components/UserProfile';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/chatapp/signIn" element={<SignIn/>}/>
      <Route path="/chatapp/signUp" element={<SignUp/>}/>
      <Route path="/chatapp/home" element={<Home/>}/>
      <Route path="/chatapp/userProfile" element={<UserProfile/>}/>
    </Routes>
    </Router>
  );
}

export default App;
