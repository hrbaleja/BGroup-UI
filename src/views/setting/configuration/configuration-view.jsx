import React, { useState } from 'react';

import { Box, Card, Stack, Divider, Collapse, Container, IconButton, Typography, CardContent, } from '@mui/material';

import { PAGE_TITLES } from 'src/constants/page';

import Iconify from 'src/components/iconify';

import SmsSettingsView from './sms-settings-view';
import EmailSettingsView from './email-settings-view';
import MenuConfigurationView from './menu-setting-view';
import WhatsappSettingsView from './whatsapp-settings-view';

export default function ConfigurationView() {
    const [expandedCard, setExpandedCard] = useState(null);

    const handleToggle = (cardId) => {
        setExpandedCard((prev) => (prev === cardId ? null : cardId));
    };

    const cards = [
        { id: 1, title: 'Menu Configuration', content: <MenuConfigurationView /> },
        { id: 2, title: 'SMS Settings', content: <SmsSettingsView /> },
        { id: 3, title: 'Email Settings', content: <EmailSettingsView /> },
        { id: 4, title: 'WhatsApp Settings', content: <WhatsappSettingsView /> },
    ];

    return (
        <Container maxWidth="xl">

            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    {PAGE_TITLES.CONFIGURATION}
                </Typography>
            </Stack>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {cards.map((card) => (
                    <Card key={card.id} variant="outlined">
                        <CardContent
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography variant="h6">{card.title}</Typography>
                            <IconButton
                                onClick={() => handleToggle(card.id)}
                                aria-expanded={expandedCard === card.id}
                                aria-label="show more"
                            >
                                {expandedCard === card.id ? <Iconify icon="mdi:arrow-up-drop-circle-outline" /> : <Iconify icon="mdi:arrow-down-drop-circle-outline" />}
                            </IconButton>
                        </CardContent>
                        <Collapse in={expandedCard === card.id} timeout="auto" unmountOnExit>
                            <Divider sx={{ mb: 3 }} />
                            <CardContent>
                                <Typography>{card.content}</Typography>
                            </CardContent>
                        </Collapse>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

