import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, Box } from '@mui/material';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault()

        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                navigate("/login")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                setError(true);
            });


    }

    return (
        <Box className="authCard">
            <h1> Sign up </h1>
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
                    onClick={onSubmit}>
                    Sign up
                </Button>
                <br />

                {error &&
                    <Alert severity="error">Invalid email and/or password.</Alert>
                }
                
                <p className="authRow" muted>
                    Already have an account?{' '}
                    <NavLink to="/login" >
                        Log in
                    </NavLink>
                </p>
        </Box>
        // <Card className="authCard" body>
        //     <h1> Sign up </h1>

        //     <Form>
        //         <Form.Group className="mb-3 authRow" controlId="formEmail">
        //             <Form.Label>Email address</Form.Label>
        //             <Form.Control
        //                 type="email"
        //                 label="Email address"
        //                 value={email}
        //                 onChange={(e) => setEmail(e.target.value)}
        //                 required
        //                 placeholder="Email address"
        //             />
        //         </Form.Group>

        //         <Form.Group className="mb-3 authRow" controlId="formPassword">
        //             <Form.Label>Password</Form.Label>
        //             <Form.Control
        //                 type="password"
        //                 label="Create password"
        //                 value={password}
        //                 onChange={(e) => setPassword(e.target.value)}
        //                 required
        //                 placeholder="Password"
        //             />
        //         </Form.Group>
        //         <Button className="authRow" variant="primary" type="submit" onClick={onSubmit}>
        //             Sign up
        //         </Button>
        //         <br />

        //         <Form.Text className="authRow" muted>
        //             Already have an account?{' '}
        //             <NavLink to="/login" >
        //                 Log in
        //             </NavLink>
        //         </Form.Text>
        //     </Form>

        // </Card>
    )
}

export default Signup