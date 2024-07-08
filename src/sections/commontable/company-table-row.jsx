import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';

import CompanyService from 'src/services/company/companyService';

import Iconify from 'src/components/iconify';

import EditCompanyDialog from './EditCompanyDialog';

// ----------------------------------------------------------------------

export default function DataTableRow({ row, fetchCompanies }) {
  const { name, industry, startDate, endDate, amount, lotSize, isMain } = row;

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
    setEditCompany(row);
    setOpenEditDialog(true);
    setOpen(null);
  };

  const handleSubmitEdit = async () => {
    try {
      await CompanyService.updateCompany(row._id, editCompany);
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
      <TableRow hover tabIndex={-1} >
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell> */}
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" marginLeft={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{industry}</TableCell>

        <TableCell>{new Date(startDate).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(endDate).toLocaleDateString()}</TableCell>
        <TableCell>{amount}</TableCell>
        <TableCell>{lotSize}</TableCell>
        <TableCell>{isMain ? 'Main' : 'SME'}</TableCell>

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
        <MenuItem onClick={() => handleDetailsCompany(row._id)} sx={{ color: 'info.main' }}>
          <Iconify icon="eva:info-fill" sx={{ mr: 2 }} />
          Details
        </MenuItem>
        <MenuItem onClick={handleEditCompany}>
          <Iconify icon="fluent:edit-16-filled" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteCompany(row._id)} sx={{ color: 'error.main' }}>
          <Iconify icon="fluent:delete-16-filled" sx={{ mr: 2 }} />
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
      <EditCompanyDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        company={editCompany}
        onSubmit={handleSubmitEdit}
        formatDate={formatDate}
      />
      {/* <EditCompanyDialog
        company={editCompany}
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        fetchCompanies={fetchCompanies}
      /> */}
      {/* <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
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
            value={formatDate(editCompany.startDate) || ''}
            onChange={(e) => setEditCompany({ ...editCompany, startDate: new Date(e.target.value).toISOString() })}
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
            value={formatDate(editCompany.endDate) || ''}
            onChange={(e) => setEditCompany({ ...editCompany, endDate: new Date(e.target.value).toISOString() })}
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
            value={editCompany.amount}
            onChange={(e) => setEditCompany({ ...editCompany, amount: parseFloat(e.target.value) })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Lot Size"
            name="lotSize"
            type="number"
            value={editCompany.lotSize}
            onChange={(e) => setEditCompany({ ...editCompany, lotSize: parseFloat(e.target.value) })}
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
      </Dialog> */}
    </>
  );
}
DataTableRow.propTypes = {
  row: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    industry: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    amount: PropTypes.number,
    lotSize: PropTypes.number,
    isMain: PropTypes.bool,
  }).isRequired,
  fetchCompanies: PropTypes.func.isRequired,
};