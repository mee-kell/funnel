import React from 'react';
import { auth } from '../firebase';
import Upload from './Upload';

const Home = () => {
    const user = auth.currentUser;

    if (user) {
        return <Upload />
    }

    return (
        <div className="main">
            <h1>Revise by summarising notes.</h1>
            <p>Please sign up or log in.</p>
        </div>
    )
}

export default Home;