import React from 'react';
import Home from './routes/Home.js';
import Signup from './routes/Signup';
import Login from './routes/Login';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './firebase';

import Upload from './routes/Upload.js';
import LoggedInNav from './components/LoggedInNav.js';
import LoggedOutNav from './components/LoggedOutNav.js';

const App = () => {

  let navBar;
  if (auth.currentUser) {
    navBar = <LoggedInNav />
  } else {
    navBar = <LoggedOutNav />
  }

  return (
    <div>
      {navBar}
      <Routes className="appBody">
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </div>
  );
}

export default App;
