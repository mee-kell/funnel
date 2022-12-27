import React from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

import { Box, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';

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
        <Box sx={{width: '100%', padding: 2, display: 'flex', justifyContent: 'space-between'}}>
            <IconButton aria-label="home" href="/"><HomeIcon /></IconButton>
            <IconButton aria-label="logout" href="/" onClick={ handleLogout }>
                <LogoutIcon />
            </IconButton>
        </Box>
    )
}

export default LoggedInNav;
