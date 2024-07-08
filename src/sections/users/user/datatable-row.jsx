import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import {  Stack,Button,
  Avatar,Dialog,  Select,Popover,  TableRow,MenuItem,TextField,  TableCell, Typography,
  IconButton,  InputLabel, FormControl,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';

import userRoles from 'src/constants/userRoles';
import UserService from 'src/services/users/userService';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function DataTableRow({ name, avatarUrl, email, role, isVerified, isActive, id, fetchUsers }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editUser, setEditUser] = useState({ name, email, role });
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleActivateUser = useCallback(async () => {
    try {
      await UserService.updateStatus(id, { isActive: !isActive });
      fetchUsers();
      handleCloseMenu();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }, [id, isActive, fetchUsers]);

  const handleEditUser = useCallback(() => {
    setOpenEditDialog(true);
    handleCloseMenu();
  }, []);

  const handleSubmitEdit = useCallback(async () => {
    try {
      await UserService.updateUser(id, editUser);
      setOpenEditDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }, [id, editUser, fetchUsers]);

  const handlePasswordChange = useCallback(async () => {
    try {
      await UserService.updatePassword(id, { password: newPassword });
      setOpenPasswordDialog(false);
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
    }
  }, [id, newPassword]);

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" marginLeft={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap marginLeft={1}>{name}</Typography>
          </Stack>
        </TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{userRoles[role]}</TableCell>
        <TableCell align='center'>
          <Label color={isVerified ? 'success' : 'error'}>{isVerified ? 'Yes' : 'No'}</Label>
        </TableCell>
        <TableCell align='center'>
          <Label color={isActive ? 'success' : 'error'}>{isActive ? 'Active' : 'Inactive'}</Label>
        </TableCell>
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 140 } }}
      >
        <MenuItem onClick={handleEditUser}>
          <Iconify icon="fluent:edit-16-filled" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleActivateUser} sx={{ color: isActive ? 'error.main' : 'success.main' }}>
          <Iconify icon={isActive ? 'eva:unlock-outline' : 'eva:lock-outline'} sx={{ mr: 2 }} />
          {isActive ? 'Deactivate' : 'Activate'}
        </MenuItem>
        <MenuItem onClick={() => setOpenPasswordDialog(true)}>
          <Iconify icon="ic:round-password" sx={{ mr: 2 }} />
          Password
        </MenuItem>
      </Popover>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
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
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitEdit} variant="outlined">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
         Change Password of {name}
        </DialogTitle>
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
          <Button onClick={handlePasswordChange} variant="outlined">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

DataTableRow.propTypes = {
  avatarUrl: PropTypes.string,
  email: PropTypes.string,
  isVerified: PropTypes.bool,
  name: PropTypes.string,
  role: PropTypes.number,
  isActive: PropTypes.bool,
  id: PropTypes.string,
  fetchUsers: PropTypes.func,
};