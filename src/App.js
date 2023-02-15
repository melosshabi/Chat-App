import './App.css';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Home from './Components/Home';
import UserProfile from './Components/UserProfile';
import {HashRouter as Router, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/chatApp/signIn" element={<SignIn/>}/>
      <Route path="/chatApp/signUp" element={<SignUp/>}/>
      <Route path="/chatApp" element={<Home/>}/>
      <Route path="/chatApp/userProfile" element={<UserProfile/>}/>
    </Routes>
    </Router>
  );
}

export default App;
