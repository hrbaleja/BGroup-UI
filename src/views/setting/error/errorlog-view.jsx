import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { fToNow } from 'src/utils/format-time';

import SettingService from 'src/services/setting/setting';

import Iconify from 'src/components/iconify';

export default function AppErrorLogs() {
    const [errorLogs, setErrorLogs] = useState([]);

    useEffect(() => {
        const getErrorLogs = async () => {
            try {
                const logs = await SettingService.fetchError();
                setErrorLogs(logs);
            } catch (error) {
                console.error('Failed to fetch error logs:', error);
            }
        };

        getErrorLogs();
    }, []);

    return (
        <Container maxWidth="xl">
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Error Logs
                </Typography>
            </Stack>
            <Card sx={{ p: 2 }}>
                {errorLogs.length === 0 ? (
                    <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', fontWeight:'bold'}}>
                       No error logs available.
                    </Typography>
                ) : (
                    errorLogs.map((log, index) => (
                        <Stack key={index} direction="row" alignItems="center" spacing={2} borderBottom={1} padding={2}>
                            <Box
                                component="span"
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 1.5,
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'error.light',
                                    color: 'error.dark',
                                    mb: 1,
                                }}
                            >
                                <Iconify icon="line-md:bell-alert-loop" width={24} />
                            </Box>
                            <Box sx={{ minWidth: 200, flexGrow: 1 }}>
                                <Link color="inherit" variant="subtitle2" underline="hover" noWrap>
                                    {`${log.controller} - ${log.method}`}
                                </Link>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                                    {log.errorMessage}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {log.errorStack}
                                </Typography>
                                {log.user && (
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                        User: {log.user.name}
                                    </Typography>
                                )}
                            </Box>
                            <Typography variant="caption" sx={{ pr: 3, flexShrink: 0, color: 'text.secondary' }}>
                                {fToNow(new Date(log.timestamp))}
                            </Typography>
                        </Stack>
                    ))
                )}
            </Card>
        </Container>
    );
}
