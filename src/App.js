import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import Home from './Components/Home';
import UserProfile from './Components/UserProfile';
import {HashRouter, Routes, Route} from 'react-router-dom'

function App() {

  return (
    <HashRouter>
    <Routes>
      <Route path="/" exact element={<Home/>}/>
      <Route path="/signIn" exact element={<SignIn/>}/>
      <Route path="/signUp" exact element={<SignUp/>}/>
      <Route path="/userProfile" exact element={<UserProfile/>}/>
    </Routes>
    </HashRouter>
  );
}

export default App;
