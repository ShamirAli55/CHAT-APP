import {Routes as Router,Route} from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

const App = () => {
  return (
    <div className="bg-[url('./assets/bgImage.svg')]">
    <Router>
      <Route index path="/" element={<HomePage/>}/>
      <Route index path="/login" element={<LoginPage/>}/>
      <Route index path="/profile" element={<ProfilePage/>}/>
    </Router>
    </div>
  )
}

export default App