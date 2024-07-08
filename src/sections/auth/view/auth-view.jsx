import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';
import { FORGOTPWD } from 'src/constants/auth';
import { COMPANY_NAME } from 'src/constants/overview';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

const AuthView = ({ children, title, linkText, linkUrl }) => {
    const theme = useTheme();

    return (
        <>
            <Helmet>
                <title>{title} </title>
            </Helmet>
            <Box
                sx={{
                    ...bgGradient({
                        color: alpha(theme.palette.background.default, 0.9),
                        imgUrl: '/assets/background/overlay_4.jpg',
                    }),
                    height: 1,
                }}
            >
                <Logo
                    sx={{
                        position: 'fixed',
                        top: { xs: 16, md: 24 },
                        left: { xs: 16, md: 24 },
                    }}
                />

                <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                    <Card
                        sx={{
                            p: 5,
                            width: 1,
                            maxWidth: 420,
                        }}
                    >
                        {title === FORGOTPWD ? (
                            <Typography variant="h4" textAlign="center">
                                {COMPANY_NAME}
                            </Typography>
                        ) : (
                            <Typography variant="h4" textAlign="center">{title} to {COMPANY_NAME} </Typography>
                        )}
                      
                        <Typography variant="body2" sx={{ mt: 2, mb: 5 }} />
                        <Stack direction="row" spacing={2}>
                            <Button
                                fullWidth
                                size="large"
                                color="inherit"
                                variant="outlined"
                                sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
                            >
                                <Iconify icon="eva:google-fill" color="#DF3E30" />
                            </Button>

                            <Button
                                fullWidth
                                size="large"
                                color="inherit"
                                variant="outlined"
                                sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
                            >
                                <Iconify icon="eva:facebook-fill" color="#1877F2" />
                            </Button>

                            <Button
                                fullWidth
                                size="large"
                                color="inherit"
                                variant="outlined"
                                sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
                            >
                                <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
                            </Button>
                        </Stack>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                OR
                            </Typography>
                        </Divider>

                        {children}
                        {linkText && linkUrl && (
                            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                                {linkText}{' '}
                                <Link to={linkUrl} style={{ textDecoration: 'none', color: 'primary.dark' }}>
                                    Click here
                                </Link>
                            </Typography>
                        )}
                    </Card>
                </Stack>
            </Box>
        </>
    );
};
AuthView.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    linkText: PropTypes.string,
    linkUrl: PropTypes.string,
};

export default AuthView;