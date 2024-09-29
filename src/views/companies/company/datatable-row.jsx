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

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import CompanyService from 'src/services/company/companyService';

import Iconify from 'src/components/iconify';

import EditCompanyDialog from './company-edit';

// ----------------------------------------------------------------------

export default function DataTableRow({ company, fetchCompanies }) {

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
    setOpenEditDialog(false);
    fetchCompanies();
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
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" marginLeft={2}>
            <Typography variant="subtitle2" noWrap>
              {company.name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell >{company.industry}</TableCell>
        <TableCell> {fDate(company.startDate)}</TableCell>
        <TableCell>{fDate(company.endDate)}</TableCell>
        <TableCell>{fCurrency(company.amount)}</TableCell>
        <TableCell>{company.lotSize}</TableCell>
        <TableCell>{company.isMain ? 'Main' : 'SME'}</TableCell>
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
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuItem onClick={() => handleDetailsCompany(company._id)} sx={{ color: 'info.main' }}>
          <Iconify icon="eva:info-fill" sx={{ mr: 2 }} />
          Details
        </MenuItem>
        <MenuItem onClick={handleEditCompany}>
          <Iconify icon="fluent:edit-16-filled" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDeleteCompany(company._id)} sx={{ color: 'error.main' }}>
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
       Company Details
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1"><strong>Name:</strong> {companydata.name}</Typography>
          <Typography variant="body1"><strong>Start Date:</strong>{new Date(companydata.startDate).toLocaleDateString()}</Typography>
          <Typography variant="body1"><strong>End Date:</strong>{new Date(companydata.endDate).toLocaleDateString()}</Typography>
          <Typography variant="body1"><strong>Amount:</strong>: {companydata.amount}</Typography>
          <Typography variant="body1"><strong>Lot Size:</strong> {companydata.lotSize}</Typography>
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
    </>
  );
}
DataTableRow.propTypes = {
  company: PropTypes.object.isRequired,
  fetchCompanies: PropTypes.func.isRequired,
};