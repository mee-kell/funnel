import { auth } from '../firebase';
import React, { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const [user, setUser] = useState();
    const navigate = useNavigate();

    onAuthStateChanged(auth, user => {
        if (user) {
            setUser(user);
        } else {
            navigate("/login");
        }
    });
    
    if (user) {
        return (
            <div className="main">
                <h1>Revise by summarising notes.</h1>
                <p>Please sign up or log in.</p>
            </div>
        )
    }
}

export default Home;