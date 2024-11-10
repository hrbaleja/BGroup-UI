import React, { useState } from 'react';

import { Box, Grid, Button, Container, TextField,  } from '@mui/material';

export default function SmsSettingsView() {

    const [smsSettings, setSmsSettings] = useState({
        provider: '',
        apiKey: '',
        number: '',
    });

    const handleSmsChange = (e) => setSmsSettings({ ...smsSettings, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log('SMS Settings:', smsSettings);
    };

    return (
        <Container maxWidth="xl">
            <Box            >
                <Grid container spacing={4}>
                    {/* SMS Settings */}
                    <Grid item xs={12} sm={6}>
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
                </Grid>

                <Button variant="contained" color="inherit" onClick={handleSubmit} sx={{ mt: 4 }}>
                    Save Settings
                </Button>
            </Box>
        </Container>
    );
}