import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom'

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    // Sign in using email and password
    const navigate = useNavigate();
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                setError(true);
            });
    }

    // Sign in using Google account
    const onGoogleLogin = (e) => {
        e.preventDefault();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then(() => {
                navigate("/");
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                setError(true);
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

            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <Button
                    className="authRow"
                    variant="contained"
                    type="submit"
                    onClick={onLogin}>
                    Login
                </Button>
                <Button
                    className="authRow end-align"
                    variant="outlined"
                    type="submit"
                    endIcon={<GoogleIcon />}
                    onClick={onGoogleLogin}>
                    Log in with Google
                </Button>
            </Box>

            {error &&
                <Alert severity="error">Invalid email and/or password.</Alert>
            }

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