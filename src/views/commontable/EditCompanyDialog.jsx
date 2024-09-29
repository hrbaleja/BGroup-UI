import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Stack, Dialog, Button, Switch, TextField, Typography,DialogTitle, DialogContent, DialogActions,

} from '@mui/material';


const EditCompanyDialog = ({ open, onClose, company, onSubmit, formatDate }) => {
  const [editCompany, setEditCompany] = useState(company);

  const handleSubmit = () => {
    onSubmit(editCompany);
  };
  const handleChange = (event) => {
    setEditCompany({
      ...editCompany,
      isMain: event.target.checked,
    });
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ borderBottom: '1px solid ', margin: ' 1rem', color: 'info.main' }}>
        <Typography>Edit Company</Typography>
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
          onChange={(e) =>
            setEditCompany({ ...editCompany, startDate: new Date(e.target.value).toISOString() })
          }
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
          onChange={(e) =>
            setEditCompany({ ...editCompany, endDate: new Date(e.target.value).toISOString() })
          }
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
         <Stack direction="row" alignItems="center" spacing={2}>
            Main
            <Switch
              value={editCompany.isMain}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="outlined">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditCompanyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  company: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
};

export default EditCompanyDialog;