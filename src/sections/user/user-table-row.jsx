import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import {
  Button, Dialog, Select, TextField, InputLabel, FormControl, DialogTitle, DialogContent, DialogActions,

} from '@mui/material';

import userRoles from 'src/constants/userRoles';
import UserService from 'src/services/users/userService';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({ selected, name, avatarUrl, email, role, isVerified, isActive, handleClick, id, fetchUsers
}) {
  const [open, setOpen] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  // const handleDeleteEntry = (_id) => {
  //   setEntryToDelete({ _id });
  //   setOpenDeleteDialog(true);
  // };

  // const handleinfoEntry = (_id) => {
  //   setEntryToDelete({ _id });
  //   setOpeninfoDialog(true);
  //   setOpen(null);
  // };

  // const handleEditEntry = (entry) => {
  //   setEditEntry(entry);
  //   setOpenEditDialog(true);
  //   setOpen(null);
  // };
  const handleActivateUser = () => {
    ActivateUser(id, { isActive: !isActive });
  };

  const ActivateUser = async (userId, updatedUsers) => {
    try {
      await UserService.updateStatus(userId, updatedUsers);
      fetchUsers();
      setOpen(null);
    } catch (error) {
      console.error('Error updating user:', error);

    }
  };

  const handleEditUser = (userData) => {
    setEditUser(userData);
    setOpenEditDialog(true);
    setOpen(null);
  };

  const handleSubmitEdit = async () => {
    try {
      await UserService.updateUser(id, editUser);
      setOpenEditDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleOpenPasswordDialog = () => {
    setOpenPasswordDialog(true);
  };

  const PasswordChange = async (userId, updatedPassword) => {
    try {
      await UserService.updatePassword(userId, updatedPassword);
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} /><Typography variant="subtitle2" noWrap>{name}</Typography>
          </Stack>
        </TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{userRoles[role]}</TableCell>
        <TableCell align='center'>
          <Label color={isVerified ? 'success' : 'error'}>{isVerified ? 'Yes' : 'No'}</Label>
        </TableCell>
        <TableCell align='center'>
          <Label color={isActive ? 'success' : 'error'}>
            {isActive ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={() => handleEditUser({ id, name, email, role, })}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleActivateUser} sx={{ color: isActive ? 'error.main' : 'success.main' }}>
          <Iconify
            icon={isActive ? 'eva:unlock-outline' : 'eva:lock-outline'}
            sx={{ mr: 2 }}
          />
          {isActive ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem onClick={handleOpenPasswordDialog}>
          <Iconify icon="ic:round-password" sx={{ mr: 2 }} />
          Password
        </MenuItem>
      </Popover>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              label="Role"
            >
              {Object.entries(userRoles).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitEdit} variant="outlined">
            Save
          </Button>
        </DialogActions>
      </Dialog>


      {/* dialog box for passwored Change */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}><Typography variant="h4"  >Change Password of {name}</Typography></DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              PasswordChange(id, { password: newPassword });
              setOpenPasswordDialog(false);
              setNewPassword('');
            }}
            variant="outlined"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  isActive: PropTypes.bool,
  id: PropTypes.string,
  fetchUsers: PropTypes.func,
};
