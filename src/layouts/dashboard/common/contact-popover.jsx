import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import ContactService from 'src/services/users/contactService';
import {
  Box, Grid, List, Alert, Paper, Avatar, Button, Dialog, Divider, Popover, Collapse, TextField, IconButton, Typography,
  DialogTitle, ListItemText, DialogActions, DialogContent, ListItemAvatar, ListItemButton, CircularProgress
} from '@mui/material';

import Scrollbar from 'src/components/scrollbar';

const HeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
}));

const ActionButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(0.7),
  borderRadius: theme.spacing(1.5),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  }
}));

const ActionIcon = styled(Box)(({ theme, bgcolor }) => ({
  backgroundColor: bgcolor,
  color: 'white',
  borderRadius: '50%',
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(0.5),
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  }
}));

// Generate avatar URL based on name
const generateAvatarUrl = (name) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

export default function ContactBookPopover() {
  const [open, setOpen] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedContact, setExpandedContact] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    company: '',
    position: '',
    notes: '',
  });

  // Fetch contacts when component mounts
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ContactService.fetchContacts();
      // Transform API response to match component structure
      const transformedContacts = response.map(contact => ({
        id: contact._id,
        name: contact.name,
        phone: contact.phone,
        whatsapp: contact.whatsapp || contact.phone,
        email: contact.email,
        company: contact.company,
        position: contact.position,
        notes: contact.notes,
        favorite: contact.favorite,
        avatar: generateAvatarUrl(contact.name)
      }));

      setContacts(transformedContacts);
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleContact = (contactId) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  const handleOpen = (event) => setOpen(event.currentTarget);
  const handleClose = () => setOpen(null);

  const handleAddContact = async () => {
    if (!newContact.name.trim()) return;

    try {
      setLoading(true);
      const contactData = {
        ...newContact,
        whatsapp: newContact.whatsapp || newContact.phone // Use phone as whatsapp if not provided
      };

      const response = await ContactService.createContact(contactData);

      // Transform the response and add to local state
      const transformedContact = {
        id: response._id,
        name: response.name,
        phone: response.phone,
        whatsapp: response.whatsapp || response.phone,
        email: response.email,
        company: response.company,
        position: response.position,
        notes: response.notes,
        favorite: response.favorite,
        avatar: generateAvatarUrl(response.name)
      };

      setContacts([...contacts, transformedContact]);
      setNewContact({
        name: '',
        phone: '',
        whatsapp: '',
        email: '',
        company: '',
        position: '',
        notes: '',
        favorite: false
      });
      setOpenDialog(false);
    } catch (err) {
      setError('Failed to add contact');
      console.error('Error adding contact:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      setLoading(true);
      await ContactService.deleteContact(contactId);
      setContacts(contacts.filter(contact => contact.id !== contactId));
      setExpandedContact(null);
    } catch (err) {
      setError('Failed to delete contact');
      console.error('Error deleting contact:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setNewContact(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <IconButton
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <img src="https://img.icons8.com/3d-fluency/94/contacts.png" alt="Contacts" />
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
            mt: 0.75,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <HeaderBox>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Contacts
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                {contacts.length} contacts
              </Typography>
            </Box>
            <IconButton
              onClick={() => setOpenDialog(true)}
              disabled={loading}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              <Iconify icon="eva:plus-fill" width={24} height={24} />
            </IconButton>
          </Box>
        </HeaderBox>

        <Divider />

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Contact List */}
        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <List disablePadding>
            {contacts.map((contact, index) => (
              <Box key={contact.id}>
                {/* Main Contact Item */}
                <ListItemButton
                  onClick={() => toggleContact(contact.id)}
                  sx={{
                    py: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={contact.avatar}
                      alt={contact.name}
                      sx={{
                        width: 40,
                        height: 40,
                        border: '1px solid',
                        borderColor: 'grey.200'
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {contact.name}
                        </Typography>
                        {contact.favorite && (
                          <Iconify icon="eva:star-fill" width={16} height={16} sx={{ color: '#ffc107' }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {contact.phone}
                        </Typography>
                        {contact.company && (
                          <Typography variant="caption" color="text.secondary">
                            {contact.position ? `${contact.position} at ${contact.company}` : contact.company}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <IconButton size="small">
                    <Iconify
                      icon="eva:chevron-down-fill"
                      width={20}
                      height={20}
                      sx={{
                        transform: expandedContact === contact.id ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </IconButton>
                </ListItemButton>

                {/* Expanded Actions */}
                <Collapse in={expandedContact === contact.id} timeout="auto" unmountOnExit>
                  <Paper elevation={0} sx={{ backgroundColor: 'grey.50', mx: 2, mb: 1, borderRadius: 2 }}>
                    {/* Action Buttons */}
                    <Box sx={{ p: 1 }}>
                      <Grid container spacing={1} justifyContent="center">
                        <Grid item>
                          <ActionButton
                            onClick={() => window.open(`tel:${contact.phone}`, '_self')}
                            sx={{ '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' } }}
                          >
                            <ActionIcon bgcolor="#2196f3">
                              <Iconify icon="eva:phone-fill" width={18} height={18} />
                            </ActionIcon>
                            <Typography variant="caption" color="text.secondary">
                              Call
                            </Typography>
                          </ActionButton>
                        </Grid>

                        <Grid item>
                          <ActionButton
                            onClick={() => window.open(`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                            sx={{ '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' } }}
                          >
                            <ActionIcon bgcolor="#4caf50">
                              <Iconify icon="logos:whatsapp-icon" width={18} height={18} />
                            </ActionIcon>
                            <Typography variant="caption" color="text.secondary">
                              WhatsApp
                            </Typography>
                          </ActionButton>
                        </Grid>

                        <Grid item>
                          <ActionButton
                            onClick={() => window.open(`mailto:${contact.email}`, '_self')}
                            sx={{ '&:hover': { backgroundColor: 'rgba(156, 39, 176, 0.1)' } }}
                          >
                            <ActionIcon bgcolor="#9c27b0">
                              <Iconify icon="eva:email-fill" width={18} height={18} />
                            </ActionIcon>
                            <Typography variant="caption" color="text.secondary">
                              Email
                            </Typography>
                          </ActionButton>
                        </Grid>

                        <Grid item>
                          <ActionButton
                            onClick={() => alert('Edit functionality would be implemented here')}
                            sx={{ '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.1)' } }}
                          >
                            <ActionIcon bgcolor="#ff9800">
                              <Iconify icon="eva:edit-fill" width={18} height={18} />
                            </ActionIcon>
                            <Typography variant="caption" color="text.secondary">
                              Edit
                            </Typography>
                          </ActionButton>
                        </Grid>

                        <Grid item>
                          <ActionButton
                            onClick={() => handleDeleteContact(contact.id)}
                            sx={{ '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' } }}
                          >
                            <ActionIcon bgcolor="#f44336">
                              <Iconify icon="eva:trash-2-fill" width={18} height={18} />
                            </ActionIcon>
                            <Typography variant="caption" color="text.secondary">
                              Delete
                            </Typography>
                          </ActionButton>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Contact Details */}
                    <Paper elevation={1} sx={{ m: 2, p: 2, borderRadius: 1.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Iconify icon="eva:phone-fill" width={16} height={16} sx={{ color: '#2196f3' }} />
                          <Typography variant="body2" color="text.secondary">
                            Phone: {contact.phone}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Iconify icon="logos:whatsapp-icon" width={16} height={16} />
                          <Typography variant="body2" color="text.secondary">
                            WhatsApp: {contact.whatsapp}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Iconify icon="eva:email-fill" width={16} height={16} sx={{ color: '#9c27b0' }} />
                          <Typography variant="body2" color="text.secondary">
                            Email: {contact.email}
                          </Typography>
                        </Box>
                        {contact.company && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Iconify icon="eva:briefcase-fill" width={16} height={16} sx={{ color: '#ff9800' }} />
                            <Typography variant="body2" color="text.secondary">
                              Company: {contact.company}
                            </Typography>
                          </Box>
                        )}
                        {contact.position && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Iconify icon="eva:person-fill" width={16} height={16} sx={{ color: '#9c27b0' }} />
                            <Typography variant="body2" color="text.secondary">
                              Position: {contact.position}
                            </Typography>
                          </Box>
                        )}
                        {contact.notes && (
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <Iconify icon="eva:file-text-fill" width={16} height={16} sx={{ color: '#4caf50', mt: 0.2 }} />
                            <Typography variant="body2" color="text.secondary">
                              Notes: {contact.notes}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  </Paper>
                </Collapse>

                {index < contacts.length - 1 && <Divider />}
              </Box>
            ))}
          </List>

          {/* Add Contact Dialog */}
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: { borderRadius: 2 }
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6" fontWeight={600}>
                  Add New Contact
                </Typography>
                <IconButton onClick={() => setOpenDialog(false)} size="small">
                  <Iconify icon="eva:close-fill" width={20} height={20} />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={newContact.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  variant="outlined"
                  helperText="Required field"
                />

                <TextField
                  fullWidth
                  label="Phone"
                  value={newContact.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  variant="outlined"
                  placeholder="+91 9664759611"
                  InputProps={{
                    startAdornment: <Iconify icon="eva:phone-fill" width={20} height={20} sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="WhatsApp"
                  value={newContact.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  variant="outlined"
                  placeholder="+91 9664759611"
                  InputProps={{
                    startAdornment: <Iconify icon="logos:whatsapp-icon" width={20} height={20} sx={{ mr: 1 }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  variant="outlined"
                  placeholder="example@email.com"
                  InputProps={{
                    startAdornment: <Iconify icon="eva:email-fill" width={20} height={20} sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Company"
                  value={newContact.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  variant="outlined"
                  placeholder="Company Name"
                  InputProps={{
                    startAdornment: <Iconify icon="eva:briefcase-fill" width={20} height={20} sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Position"
                  value={newContact.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  variant="outlined"
                  placeholder="Job Title"
                  InputProps={{
                    startAdornment: <Iconify icon="eva:person-fill" width={20} height={20} sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />

                <TextField
                  fullWidth
                  label="Notes"
                  value={newContact.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  variant="outlined"
                  multiline
                  rows={3}
                  placeholder="Additional notes..."
                  InputProps={{
                    startAdornment: <Iconify icon="eva:file-text-fill" width={20} height={20} sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} />
                  }}
                />
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => setOpenDialog(false)}
                variant="outlined"
                color="inherit"
                sx={{ borderRadius: 2 }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddContact}
                variant="contained"
                disabled={!newContact.name.trim() || loading}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
                  }
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Add Contact'}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
        <Divider />
        <Box sx={{ p: 1 }}>
          <Button fullWidth onClick={fetchContacts} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Contacts'}
          </Button>
        </Box>
      </Popover>
    </>
  );
}