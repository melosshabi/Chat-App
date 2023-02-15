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
      <Route path="/chat-app" exact element={<Home/>}/>
      <Route path="/chat-app/signIn" exact element={<SignIn/>}/>
      <Route path="/chat-app/signUp" exact element={<SignUp/>}/>
      <Route path="/chat-app/userProfile" exact element={<UserProfile/>}/>
    </Routes>
    </Router>
  );
}

export default App;
