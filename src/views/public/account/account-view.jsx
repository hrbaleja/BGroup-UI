import { useParams } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

import { Box, Card, Grid, Stack, Button, Container, Typography, CardContent, CircularProgress } from '@mui/material';

import PublicService from 'src/services/public/publicService';
import { useNotification } from 'src/context/NotificationContext';

import Iconify from 'src/components/iconify';

import TransactionList from '../../account/account/transaction-list';

export default function AccountView() {
    const [transactions, setTransactions] = useState([]);
    const [userData, setUserData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { showNotification } = useNotification();

    const handleGetTransactions = useCallback(async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await PublicService.getTransactionsByCustomerId(id);
            setUserData(data.data.userdata);
            setTransactions(data.data.transactionsData);
            setLoading(false);
            const Name = `Hello, ${data.data.userdata.name}!`;
            showNotification(Name, {
                severity: 'success',
            });
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError(true);
            setLoading(false);
        }
    }, [id, showNotification]);

    useEffect(() => {
        handleGetTransactions();
    }, [handleGetTransactions]);

    const whatsappNumber = '+919664759611';
    const message = 'Need Help with my account';

    // WhatsApp URL
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Error Card
    const renderError = () => (
        <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', p: 4, mt: 4 }}>
            <Stack direction="column" spacing={2} alignItems="center">
                <Iconify icon="fluent-color:cloud-dismiss-48" width={80} height={80} color="error" />
                <Typography variant="h3" color="error" mb={2}>
                    Unauthorized access!
                </Typography>
                <Typography variant="h6" color="warning" mb={2}>
                    Either try again or wait for moment. Or just WhatsApp us,
                </Typography>
                <Button
                    variant="outlined"
                    color="success"
                    startIcon={<Iconify icon="mdi:whatsapp" />}
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Help via WhatsApp
                </Button>
            </Stack>
        </Card>
    );

    // Loading Spinner
    const renderLoading = () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
        </Box>
    );

    // No Data Available
    const renderNoData = () => (
        <Typography variant="body1" color="text.secondary">
            No transactions available.
        </Typography>
    );

    return (
        <Container maxWidth="xl">
            {/* Error handling */}
            {error ? renderError() : null}

            {/* Header Section */}
            {!error && !loading && (
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mt={4} mb={4}>
                    <Typography variant="h4" component="h1">
                        Account Overview
                    </Typography>
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<Iconify icon="mdi:whatsapp" />}
                        href={whatsappLink}
                        target="_blank"
                    >
                        Help
                    </Button>
                </Stack>
            )}

            {/* User Information Section */}
            {!error && !loading && (
                <Card variant="outlined" sx={{ mb: 4 }}>
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="h5" component="h2">
                                {userData.name || 'Loading...'}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Email: {userData.email || 'Loading...'}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* Transactions Section */}
            {!error && !loading && (
                <Box>
                    <Typography variant="h6" component="h3" mb={2}>
                        Transactions
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            {transactions.length > 0 ? (
                                <TransactionList transactions={transactions} />
                            ) : (
                                renderNoData()
                            )}
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* Show loading spinner while fetching */}
            {loading && renderLoading()}
        </Container>
    );
}
