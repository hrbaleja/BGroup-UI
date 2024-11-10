import React, { useState } from 'react';

import { Box, Grid, Switch, Button, Divider, Container, Typography, FormControlLabel, } from '@mui/material';

import SettingService from 'src/services/setting/setting';
import { useNotification } from 'src/context/NotificationContext';

const MenuConfigurationView = () => {
    const { showNotification } = useNotification();
    const [menuVisibility, setMenuVisibility] = useState({
        account: true,
        company: false,
        otherOptions: false,
        settingOptions: false,
    });

    const menuItems = [
        { name: 'account', label: 'Account Menu' },
        { name: 'company', label: 'Company Menu' },
        { name: 'otherOptions', label: 'Other Menu' },
        { name: 'settingOptions', label: 'Setting Menu' },
    ];

    const handleMenuVisibilityChange = (e) =>
        setMenuVisibility({ ...menuVisibility, [e.target.name]: e.target.checked });

    const handleSave = async () => {
        try {
            await SettingService.saveOrUpdateMenuSettings({
                menuItems: {
                    Account: menuVisibility.account,
                    Company: menuVisibility.company,
                    'Other Options': menuVisibility.otherOptions,
                    Settings: menuVisibility.settingOptions,
                },
            });
            showNotification('Settings saved', { severity: 'success', });
            setTimeout(() => { window.location.reload(); }, 300);
        } catch (error) {
            showNotification(`Error saving settings: ${error.message}`, { severity: 'error' });
        }
    };

    return (
        <Container maxWidth="xl">
            <Box >
                <Grid container spacing={2}>
                    {menuItems.map((item) => (
                        <Grid item xs={12} key={item.name}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name={item.name}
                                        checked={menuVisibility[item.name]}
                                        onChange={handleMenuVisibilityChange}
                                        color="primary"
                                    />
                                }
                                label={
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {item.label}
                                    </Typography>
                                }
                            />
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'left' }}>
                    <Button variant="contained" color="inherit" onClick={handleSave}>
                        Save Menu Settings

                    </Button>

                </Box>
                {/* </Paper> */}
            </Box>
        </Container>
    );
};

export default MenuConfigurationView;
