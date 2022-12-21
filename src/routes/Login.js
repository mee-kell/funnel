import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom'

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

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
        <Card className="authCard" body>
            <h1> Log in </h1>

            <Form>
                <Form.Group className="mb-3 authRow" controlId="formEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        id="email-address"
                        name="email"
                        type="email"
                        required
                        placeholder="Email address"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3 authRow" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                        <Button className="authRow" variant="primary" type="submit" onClick={onLogin}>
                            Login
                        </Button>
                        <br/>

                <Form.Text className="authRow" muted>
                    No account yet? {' '}
                    <NavLink to="/signup">
                        Sign up
                    </NavLink>
                </Form.Text>
            </Form>

        </Card>
    )
}

export default Login