import { useEffect } from 'react';
import PropTypes from 'prop-types';

import {  Box, alpha, Stack,  Drawer,  Avatar,  Typography,  ListItemButton,  } from '@mui/material';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { account } from 'src/_mock/account';
import { COMPANY_NAME } from 'src/constants/overview';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import { navConfig } from './config-navigation';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();

  const upLg = useResponsive('up', 'lg');
  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={account.logoURL} alt="photoURL" />
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{COMPANY_NAME}</Typography>
        {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {account.role}
        </Typography> */}
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  // const renderUpgrade = (
  //   <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
  //     <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
  //       <Box
  //         component="img"
  //         src="/assets/images/avatars/avatar_26.png"
  //         sx={{ width: 100, position: 'absolute', top: -50 }}
  //       />
  //       <Box sx={{ textAlign: 'center' }}>
  //         <Typography variant="h6">Need help?</Typography>
  //       </Box>
  //       <Button
  //         href="/"
  //         target="_blank"
  //         variant="contained"
  //         color="inherit"
  //       >          {COMPANY_NAME}</Button>
  //     </Stack>
  //   </Box>
  // );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />
      {renderAccount}
      {renderMenu}
      <Box sx={{ flexGrow: 1 }} />
      {/* {renderUpgrade} */}
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();
  const isActive = pathname === item.path;
  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(isActive && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 28, height: 28, mr: 2 }}>
        {item.icon}
      </Box>
      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};