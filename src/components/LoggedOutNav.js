import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const LoggedOutNav = () => {

    return (
        <Navbar bg="light" variant="light">
            <Container>
                <Navbar.Brand href="/">funnel</Navbar.Brand>
                <Nav className="justify-content-end">
                    <Nav.Link href="/signup">Sign up</Nav.Link>
                    <Nav.Link href="/login">Log in</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default LoggedOutNav;
