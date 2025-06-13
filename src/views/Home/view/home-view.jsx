import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { PATHS } from 'src/routes/routes';

const APPNAME = import.meta.env.VITE_APP_NAME;

const HomeView = () => {
    const theme = useTheme();

    return (
        <>
            <Helmet>
                <title>{APPNAME} - Home</title>
            </Helmet>

            {/* Main wrapper */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                {/* Blurred background image layer */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'url(/assets/background/overlay_3.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(6px)',
                        zIndex: -1,
                    }}
                />

                {/* Foreground content */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        textAlign: 'center',
                        padding: theme.spacing(4),
                    }}
                >
                    <Box
                        sx={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(25px)',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '48px 64px',
                            marginBottom: '32px',
                            animation: 'fadeInUp 1s ease-out',
                            boxShadow: `
                            0 20px 40px rgba(0, 0, 0, 0.15),
                            0 8px 32px rgba(0, 0, 0, 0.1),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3)
                        `,
                        }}
                    >
                        <Typography variant="h2" gutterBottom>
                            Welcome to {APPNAME}
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 3 }}>
                            Your solution for managing tasks efficiently
                        </Typography>
                        <Button
                            component={Link}
                            to={PATHS.LOGIN}
                            variant="contained"
                            color="inherit"
                            sx={{ mb: 2 }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
};

export default HomeView;
