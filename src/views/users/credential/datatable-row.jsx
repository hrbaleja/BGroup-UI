import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Button, Dialog, TextField, DialogTitle, DialogContent, DialogActions, } from '@mui/material';

import InformationService from 'src/services/users/credentialService';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function DataTableRow({ name, site, username, password, description, id, fetchEntries,
}) {
  const [open, setOpen] = useState(null);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openinfoDialog, setOpeninfoDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editEntry, setEditEntry] = useState({});

  // Menu open and Close

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleDeleteEntry = (_id) => {
    setEntryToDelete({ _id });
    setOpenDeleteDialog(true);
  };

  const handleinfoEntry = (_id) => {
    setOpeninfoDialog(true);
    // setOpen(null);
  };

  const handleEditEntry = (entry) => {
    setEditEntry(entry);
    setOpenEditDialog(true);
    setOpen(null);
  };

  const handleSubmitEdit = async () => {
    try {
      await InformationService.updateEntry(id, editEntry);
      setOpenEditDialog(false);
      fetchEntries();
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await InformationService.deleteEntry(entryToDelete._id);
      setOpenDeleteDialog(false);
      setOpen(null);
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} >

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" marginLeft={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{site}</TableCell>
        <TableCell>{username}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={() => setOpen(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 140 }, }}>
        <MenuItem onClick={() => handleinfoEntry(id)} sx={{ color: 'info.main' }}>
          <Iconify icon="eva:info-fill" sx={{ mr: 2 }} />
          Details
        </MenuItem>
        <MenuItem onClick={() => handleEditEntry({ id, site, username, password, description })} >
          <Iconify icon="fluent:edit-16-filled" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteEntry(id)} sx={{ color: 'error.main' }}>
          <Iconify icon="fluent:delete-16-filled" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>


      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Credentials</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this Credentials Information ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openinfoDialog} onClose={() => setOpeninfoDialog(false)}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
          Credentials Information of {site}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1"><b>Username :</b> {username}</Typography>
          <Typography variant="body1"><b>Password : </b> {password}</Typography>
          <Typography variant="body1"><b>Description :</b>{description}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpeninfoDialog(false)} variant='outlined'>Close</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
          Edit  Credentials Information </DialogTitle>
        <DialogContent>
          <TextField
            label="Site"
            name="site"
            value={editEntry.site}
            onChange={(e) => setEditEntry({ ...editEntry, site: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Username"
            name="username"
            value={editEntry.username}
            onChange={(e) => setEditEntry({ ...editEntry, username: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            value={editEntry.password}
            onChange={(e) => setEditEntry({ ...editEntry, password: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={editEntry.description}
            onChange={(e) => setEditEntry({ ...editEntry, description: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitEdit} variant="outlined">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

DataTableRow.propTypes = {
  name: PropTypes.any,
  username: PropTypes.any,
  site: PropTypes.any,
  password: PropTypes.any,
  description: PropTypes.string,
  id: PropTypes.string,
  fetchEntries: PropTypes.func.isRequired,
};
