import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {Box,alpha,Avatar,Divider,Popover,MenuItem,Typography,IconButton} from '@mui/material';

import { PATHS } from 'src/routes/routes';

import { Logout } from 'src/function/auth';
import { account } from 'src/_mock/account';

import Iconify from 'src/components/iconify';


const MENU_OPTIONS = [
  { label: 'Home', icon: 'eva:home-fill', path: '' },
  { label: 'Profile', icon: 'line-md:account-alert-loop', path: 'profile' },
  { label: 'My Credential', icon: 'line-md:person-search', path: 'credential' },
  // { label: 'Settings', icon: 'eva:settings-2-fill', path: 'profile' },
];

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (path) => {
    setOpen(null);
    navigate(path);
  };

  const handlenavigate = (event) => {
    navigate(event);
    setOpen(null);
  };

  const handleLogout = useCallback(() => {
    Logout()

    navigate(PATHS.LOGIN);
  }, [navigate]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={account.photoURL}
          alt={account.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >

          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed' }} />
          {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={() => handlenavigate(option.path)} >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant="body2">{option.label}</Typography>
              <Iconify icon={option.icon} />
            </Box>
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />
        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 , display: 'flex', justifyContent: 'space-between', width: '100%'}}
        >
          Logout
          <Iconify icon="line-md:speed-loop"/>
        </MenuItem>
      </Popover>
    </>
  );
}