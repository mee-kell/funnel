import { signOut } from 'firebase/auth';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const LoggedInNav = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        signOut(auth).then(() => {
            sessionStorage.removeItem('Auth Token');
            navigate("/");
        }).catch((error) => {
            // An error happened.
            console.log("Could not log out.");
        });
    }
    return (
        <Navbar bg="light" variant="light">
            <Container>
                <Navbar.Brand href="/">funnel</Navbar.Brand>
                <Nav className="justify-content-end">
                    <Nav.Link href="/" onClick={ handleLogout }>
                        Logout
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default LoggedInNav;
