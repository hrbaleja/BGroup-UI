import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Button, Dialog, TextField, DialogTitle, DialogContent, DialogActions, } from '@mui/material';

import CompanyService from 'src/services/ipo/companyService';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CompanyTableRow({ company, selected, handleClick, fetchCompanies }) {
  const [open, setOpen] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editCompany, setEditCompany] = useState({});
  const [companydata, setCompanydata] = useState({});


  // Menu open and Close

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteCompany = (_id) => {
    setCompanyToDelete({ _id });
    setOpenDeleteDialog(true);
  };

  const handleDetailsCompany = async (id) => {
    try {
      const data = await CompanyService.getCompanyById(id);
      setCompanydata(data);
      setOpenDetailsDialog(true);
      setOpen(null);
    } catch (error) {
      console.error('Error finding company:', error);
    }
    setOpenDetailsDialog(true);
    setOpen(null);
  };

  const handleEditCompany = () => {
    setEditCompany(company);
    setOpenEditDialog(true);
    setOpen(null);
  };

  const handleSubmitEdit = async () => {
    try {
      await CompanyService.updateCompany(company._id, editCompany);
      setOpenEditDialog(false);
      fetchCompanies();
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await CompanyService.deleteCompany(companyToDelete._id);
      setOpenDeleteDialog(false);
      setOpen(null);
      fetchCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };


  const formatDate = (dateValue) => {
    if (typeof dateValue === 'string') {
      const parsedDate = new Date(dateValue);
      return parsedDate.toString() === 'Invalid Date' ? null : parsedDate.toISOString().substr(0, 10);
    }

    if (typeof dateValue === 'number') {
      const parsedDate = new Date(dateValue);
      return parsedDate.toISOString().substr(0, 10);
    }

    return null;
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {company.name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{company.industry}</TableCell>

        <TableCell>{new Date(company.start_date).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(company.end_date).toLocaleDateString()}</TableCell>
        <TableCell>{company.amount}</TableCell>
        <TableCell>{company.lot_size}</TableCell>
        <TableCell>{company.is_main ? 'Main' : 'Not Main'}</TableCell>

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
      >
        <MenuItem onClick={() => handleDetailsCompany(company._id)} sx={{ color: 'info.main' }}>
          <Iconify icon="eva:info-fill" sx={{ mr: 2 }} />
          Details
        </MenuItem>
        <MenuItem onClick={handleEditCompany}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteCompany(company._id)} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete Company</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this company?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
          <Typography variant="h4">Company Details</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">Name: {companydata.name}</Typography>
          <Typography variant="body1">Start Date: {new Date(companydata.start_date).toLocaleDateString()}</Typography>
          <Typography variant="body1">End Date: {new Date(companydata.end_date).toLocaleDateString()}</Typography>
          <Typography variant="body1">Amount: {companydata.amount}</Typography>
          <Typography variant="body1">Lot Size: {companydata.lot_size}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)} variant='outlined'>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
          <Typography >Edit Company</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={editCompany.name}
            onChange={(e) => setEditCompany({ ...editCompany, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Industry"
            name="industry"
            value={editCompany.industry}
            onChange={(e) => setEditCompany({ ...editCompany, industry: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={formatDate(editCompany.start_date) || ''}
            onChange={(e) => setEditCompany({ ...editCompany, start_date: new Date(e.target.value).toISOString() })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            name="endDate"
            type="date"
            value={formatDate(editCompany.end_date) || ''}
            onChange={(e) => setEditCompany({ ...editCompany, end_date: new Date(e.target.value).toISOString() })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={editCompany.amount/ editCompany.lot_size }
            onChange={(e) => setEditCompany({ ...editCompany, amount: parseFloat(e.target.value) })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Lot Size"
            name="lotSize"
            type="number"
            value={editCompany.lot_size}
            onChange={(e) => setEditCompany({ ...editCompany, lot_size: parseFloat(e.target.value) })}
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
CompanyTableRow.propTypes = {
  company: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  fetchCompanies: PropTypes.func.isRequired,
};