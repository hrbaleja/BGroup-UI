import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
// import Card from '@mui/material/Card';
// import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { COMPANY_NAME } from 'src/constants/overview';

const HomeView = () => {
    const theme = useTheme();

    return (
        <>
            <Helmet>
                <title>{COMPANY_NAME} - Home</title>
            </Helmet>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                    backgroundImage: 'url(/assets/background/overlay_3.jpg)', // Background image
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    textAlign: 'center',
                    padding: theme.spacing(4),
                }}
            >

                <Typography variant="h2" gutterBottom>
                    Welcome to {COMPANY_NAME}
                </Typography>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    Your solution for managing tasks efficiently
                </Typography>
                <Button
                    component={Link}
                    to="/login"
                    variant="contained"
                    color="inherit"
                    sx={{ mb: 2 }}
                >
                    Get Started
                </Button>
            </Box>
        </>
    );
};

export default HomeView;
