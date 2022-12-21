import { auth } from '../firebase';
import React from 'react';
import Upload from './Upload';
// import { onAuthStateChanged } from 'firebase/auth';

const Home = () => {
    // let user = null;
    // onAuthStateChanged(auth, (currUser) => {
    //     if (currUser) {
    //         user = currUser;
    //     }
    // });

    if (!auth.currentUser) {
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