import React, { useState } from 'react';

import { useTheme } from '@mui/material/styles';
import { Box, Grid, Stack, Button, Container, TextField, Typography } from '@mui/material';

import { PAGE_TITLES } from 'src/constants/page';

const ConfigurationView = () => {
    const theme = useTheme();

    const [smsSettings, setSmsSettings] = useState({
        provider: '',
        apiKey: '',
        number: '',
    });

    const [emailSettings, setEmailSettings] = useState({
        smtpServer: '',
        port: '',
        username: '',
        password: '',
    });

    const [whatsappSettings, setWhatsappSettings] = useState({
        apiKey: '',
        phoneNumber: '',
    });

    const handleSmsChange = (e) => setSmsSettings({ ...smsSettings, [e.target.name]: e.target.value });
    const handleEmailChange = (e) => setEmailSettings({ ...emailSettings, [e.target.name]: e.target.value });
    const handleWhatsappChange = (e) => setWhatsappSettings({ ...whatsappSettings, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log('SMS Settings:', smsSettings);
        console.log('Email Settings:', emailSettings);
        console.log('WhatsApp Settings:', whatsappSettings);
    };

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    {PAGE_TITLES.CONFIGURATION}
                </Typography>
            </Stack>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: theme.spacing(2),
                }}
            >
                <Grid container spacing={4}>
                    {/* SMS Settings */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                            SMS Settings
                        </Typography>
                        <TextField
                            fullWidth
                            label="Provider"
                            name="provider"
                            value={smsSettings.provider}
                            onChange={handleSmsChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="API Key"
                            name="apiKey"
                            type="password"
                            value={smsSettings.apiKey}
                            onChange={handleSmsChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="number"
                            value={smsSettings.number}
                            onChange={handleSmsChange}
                            sx={{ mb: 2 }}
                        />
                    </Grid>

                    {/* Email Settings */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                            Email Settings
                        </Typography>
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

                    {/* WhatsApp Settings */}
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                            WhatsApp Settings
                        </Typography>
                        <TextField
                            fullWidth
                            label="API Key"
                            name="apiKey"
                            value={whatsappSettings.apiKey}
                            onChange={handleWhatsappChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            value={whatsappSettings.phoneNumber}
                            onChange={handleWhatsappChange}
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
};

export default ConfigurationView;
