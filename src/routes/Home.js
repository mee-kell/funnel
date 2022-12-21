import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

const Home = () => {
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

    const user = auth.currentUser;

    if (user) {
        return (<div>
            <Button onClick={handleLogout}>
                Logout
            </Button>
        </div>)
    }

    return (
        <>
            <p>
                Please log in or sign up.
            </p>
        </>
    )
}

export default Home;