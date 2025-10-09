// frontend/App.js
import './App.css';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './component/Home';
import Profile from './component/Profile';
import Suggestion from './component/Suggestion'; 
import Chat from './component/Chat';
import Aboutus from "./component/Aboutus";
import ContactUs from './component/ContactUs';


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about-us" element={<Aboutus />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Profile page handles both viewing and editing */}
        <Route path="/profile" element={<Profile />} /> 
        <Route path="/profile/suggestion" element={<Suggestion />} /> 
      </Routes>
    </div>
  );
}

export default App;