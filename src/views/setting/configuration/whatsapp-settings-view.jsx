import React, { useState } from 'react';

import { Box, Grid, Button, Container, TextField, } from '@mui/material';

export default function WhatsappSettingsView() {

    const [whatsappSettings, setWhatsappSettings] = useState({
        apiKey: '',
        phoneNumber: '',
    });

    const handleWhatsappChange = (e) => setWhatsappSettings({ ...whatsappSettings, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        // Handle form submission logic here
        console.log('WhatsApp Settings:', whatsappSettings);
    };

    return (
        <Container maxWidth="xl">
            <Box            >
                <Grid container spacing={4}>
                    {/* WhatsApp Settings */}
                    <Grid item xs={12} sm={6}>
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
}