import React from 'react';
import { Box, Button } from '@mui/material';

const LoggedOutNav = () => {

    return (
        <Box sx={{width: '100%', padding: 2, display: 'flex', justifyContent: 'space-between'}}>
            <Button aria-label="signup" href="/signup">Sign up</Button>
            <Button aria-label="login" href="/login">Log in</Button>
        </Box>
    );
}

export default LoggedOutNav;
