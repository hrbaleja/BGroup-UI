import { useState } from 'react';
import {
  Box, List, Alert, Paper, Avatar, Button, Divider, Popover, Collapse,
  IconButton, Typography, ListItemText, ListItemAvatar, ListItemButton, CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from 'src/components/iconify';

import { useContacts } from 'src/hooks/use-Contacts';
import ContactFormDialog from './ContactFormDialog';
import ContactActions from './ContactActions';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const HeaderBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 2.5),
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  py: 1,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
  '&.expanded': {
    backgroundColor: theme.palette.action.selected,
  }
}));

const ContactCard = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(0, 1, 1, 1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[200]}`,
}));

export default function ContactBookPopover() {
  const [open, setOpen] = useState(null);
  const [expandedContact, setExpandedContact] = useState(null);
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'add', contact: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, contactId: null });

  const {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    clearError
  } = useContacts();

  // Handlers
  const handleOpen = (event) =>
    setOpen(event.currentTarget);

  const handleClose = () => {
    setOpen(null);
    setExpandedContact(null);
  };

  const toggleContact = (contactId) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  const handleAddContact = () => {
    setFormDialog({ open: true, mode: 'add', contact: null });
  };

  const handleEditContact = (contact) => {
    setFormDialog({ open: true, mode: 'edit', contact });
  };

  const handleDeleteContact = (contactId) => {
    setDeleteDialog({ open: true, contactId });
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (formDialog.mode === 'edit') {
        await updateContact(formDialog.contact.id, formData);
      } else {
        await createContact(formData);
      }
      setFormDialog({ open: false, mode: 'add', contact: null });
    } catch (error) {
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteContact(deleteDialog.contactId);
      setDeleteDialog({ open: false, contactId: null });
      setExpandedContact(null);
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleCloseFormDialog = () => {
    setFormDialog({ open: false, mode: 'add', contact: null });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, contactId: null });
  };

  const handleToggleFavorite = async (contactId, currentFavoriteStatus) => {
    try {
      const contact = contacts.find(c => c.id === contactId);
      if (contact) {
        await updateContact(contactId, { ...contact, favorite: !currentFavoriteStatus });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  const handleCallContact = (phone) => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleEmailContact = (email) => {
    if (email) {
      window.open(`mailto:${email}`, '_self');
    }
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
            maxHeight: '80vh',
          },
        }}
      >
        {/* Header */}
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
              onClick={handleAddContact}
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
          <Alert
            severity="error"
            sx={{ m: 2 }}
            action={
              <IconButton size="small" onClick={clearError}>
                <Iconify icon="eva:close-fill" width={16} height={16} />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Empty State */}
        {/* {!loading && contacts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
            <Iconify icon="mingcute:contacts-2-line" width={48} height={48} sx={{ color: 'text.disabled', mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              No contacts yet
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
              Add your first contact to get started
            </Typography>
            <Button variant="contained" size="small" color="inherit" onClick={handleAddContact}>
              Add Contact
            </Button>
          </Box>
        )} */}

        {/* Contact List */}
        <Box sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <List disablePadding>
            {contacts.map((contact, index) => (
              <Box key={contact.id}>
                {/* Main Contact Item */}
                <StyledListItemButton
                  onClick={() => toggleContact(contact.id)}
                  className={expandedContact === contact.id ? 'expanded' : ''}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={contact.avatar}
                      alt={contact.name}
                      sx={{
                        width: 40, height: 40, border: '1px solid', borderColor: 'grey.200', bgcolor: contact.avatar ? 'transparent' : 'primary.main',
                        color: 'white', fontSize: '0.875rem', fontWeight: 'bold'
                      }}
                    >
                      {!contact.avatar && contact.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    disableTypography
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
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
                        {/* {contact.company && (
                          <Typography variant="caption" color="text.secondary">
                            {contact.position
                              ? `${contact.position} at ${contact.company}`
                              : contact.company}
                          </Typography>
                        )} */}
                      </Box>
                    }
                  />
                  <IconButton
                    size="small"
                    sx={{
                      transform: expandedContact === contact.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <Iconify icon="eva:chevron-down-fill" width={20} height={20} />
                  </IconButton>
                </StyledListItemButton>

                {/* Expanded Contact Details */}
                <Collapse in={expandedContact === contact.id} timeout="auto" unmountOnExit>
                  <ContactCard elevation={0}>
                    {/* Contact Actions */}
                    <ContactActions
                      contact={contact} // <-- Add this line
                      onEdit={() => handleEditContact(contact)}
                      onDelete={() => handleDeleteContact(contact.id)}
                      sx={{ mt: 2 }}
                    />
                  </ContactCard>
                </Collapse>

                {index < contacts.length - 1 && <Divider variant="inset" component="li" />}
              </Box>
            ))}
          </List>
        </Box>

        {/* Footer with Quick Add */}
        {contacts.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="text"
                color="inherit"
                startIcon={<Iconify icon="eva:plus-fill" width={20} height={20} />}
                onClick={handleAddContact}
                disabled={loading}
              >
                Add New Contact
              </Button>
            </Box>
          </>
        )}
      </Popover>

      {/* Form Dialog */}
      <ContactFormDialog
        open={formDialog.open}
        mode={formDialog.mode}
        contact={formDialog.contact}
        onClose={handleCloseFormDialog}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        contactName={contacts.find(c => c.id === deleteDialog.contactId)?.name}
      />
    </>
  );
}