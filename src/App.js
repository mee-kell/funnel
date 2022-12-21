import React from 'react';
import Home from './routes/Home.js';
import Signup from './routes/Signup';
import Login from './routes/Login';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from './firebase';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Upload from './routes/Upload.js';

const App = () => {
  // let user = null;
  // onAuthStateChanged(auth, (currUser) => {
  //   if (currUser) {
  //     user = currUser;
  //   }
  // });

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/");
      console.log("Signed out successfully")
    }).catch((error) => {
      // An error happened.
    });
  }

  let navBar;
  if (auth.currentUser) {
    navBar = (
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/">funnel</Navbar.Brand>
          <Nav className="justify-content-end">
            <Nav.Link onClick={handleLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    )
  } else {
    navBar = (
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/">funnel</Navbar.Brand>
          <Nav className="justify-content-end">
            <Nav.Link href="/signup">Sign up</Nav.Link>
            <Nav.Link href="/login">Log in</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    )
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
