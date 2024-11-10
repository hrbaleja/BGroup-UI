import React, { useState } from 'react';

import { Box, Grid, Button, Container, TextField,  } from '@mui/material';

export default function EmailSettingsView() {

    const [emailSettings, setEmailSettings] = useState({
        smtpServer: '',
        port: '',
        username: '',
        password: '',
    });


    const handleEmailChange = (e) => setEmailSettings({ ...emailSettings, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log('Email Settings:', emailSettings);
    };

    return (
        <Container maxWidth="xl">
            <Box            >
                <Grid container spacing={4}>
                    {/* Email Settings */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="SMTP Server"
                            name="smtpServer"
                            value={emailSettings.smtpServer}
                            onChange={handleEmailChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Port"
                            name="port"
                            type="number"
                            value={emailSettings.port}
                            onChange={handleEmailChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={emailSettings.username}
                            onChange={handleEmailChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={emailSettings.password}
                            onChange={handleEmailChange}
                            sx={{ mb: 2 }}
                        />
                    </Grid>

                   
                </Grid>

                <Button variant="contained" color="inherit" onClick={handleSubmit} sx={{ mt: 4 }}>
                    Save Settings
                </Button>
            </Box>
        </Container>
    );
}