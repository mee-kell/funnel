import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom'

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });

    }

    return (
        <Box className="authCard">
            <h1> Log in </h1>
                <TextField
                    className="authRow"
                    required
                    id="outlined-required"
                    label="Email"
                    type="email"
                    fullWidth
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    className="authRow"
                    required
                    id="outlined-required"
                    label="Password"
                    type="password"
                    fullWidth
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button 
                    className="authRow" 
                    variant="contained" 
                    type="submit" 
                    onClick={onLogin}>
                    Login
                </Button>
                <br />
                <p className="authRow" muted>
                    No account yet? {' '}
                    <NavLink to="/signup">
                        Sign up
                    </NavLink>
                </p>
        </Box>
    )
}

export default Login