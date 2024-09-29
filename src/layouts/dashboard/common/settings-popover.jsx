import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { PATHS } from 'src/routes/routes';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();


  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handlenavigate = (event) => {
    navigate(event);
    setOpen(null);
  };
  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>

        {/* <iconify-icon icon="line-md:cog-filled-loop"></iconify-icon> */}
        <Iconify width={24} icon="line-md:cog-filled-loop" />
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
            width: 180,
          },
        }}
      >
        <MenuItem onClick={() => handlenavigate(PATHS.ERRORLOG)} >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="body2">Error Log</Typography>
            <Iconify width={24} icon="line-md:cog-filled-loop" />
          </Box>
        </MenuItem>
        <MenuItem onClick={() => handlenavigate(PATHS.CONFIGURATION)} >
        {/* <MenuItem  onClick={() =>  setOpen(null)}> */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="body2">SMS Service</Typography>
            <Iconify width={24} icon="line-md:cloud-upload-loop" />
          </Box>
        </MenuItem>
      </Popover>
    </>
  );
}
