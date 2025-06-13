import { useState } from 'react';
import {
  Box, Card, Grid, List, Alert, Avatar, Button, Divider, Collapse,
  IconButton, Typography, ListItemText, ListItemAvatar, ListItemButton,
  CircularProgress, TextField, InputAdornment, Chip, Menu, MenuItem
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { useContacts } from 'src/hooks/use-Contacts';
import ContactFormDialog from '../ContactFormDialog';
import ContactActions from '../ContactActions';
import ContactDetails from '../ContactDetails';
import DeleteConfirmationDialog from '../DeleteConfirmationDialog';

export default function ContactListPage() {
  const [expandedContact, setExpandedContact] = useState(null);
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'add', contact: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, contactId: null });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterMenu, setFilterMenu] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

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

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'company':
          return (a.company || '').localeCompare(b.company || '');
        case 'recent':
          return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
        default:
          return 0;
      }
    });

  // Handlers
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

  const renderListView = () => (
    <Card sx={{ mt: 2 }}>
      <List disablePadding>
        {filteredContacts.map((contact, index) => (
          <Box key={contact.id}>
            {/* Main Contact Item */}
            <ListItemButton
              onClick={() => toggleContact(contact.id)}
              sx={{
                py: 1.5,
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
                    width: 48,
                    height: 48,
                    border: '1px solid',
                    borderColor: 'grey.200'
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                disableTypography
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ContactActions
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  loading={loading}
                  compact
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
              </Box>
            </ListItemButton>

            {/* Expanded Details */}
            <Collapse in={expandedContact === contact.id} timeout="auto" unmountOnExit>
              <Box sx={{ backgroundColor: 'grey.50', mx: 2, mb: 1, borderRadius: 2 }}>
                <ContactDetails contact={contact} />
              </Box>
            </Collapse>

            {index < filteredContacts.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Card>
  );

  const renderGridView = () => (
    <Grid container spacing={2} sx={{ mt: 1 }}>
      {filteredContacts.map((contact) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={contact.id}>
          <Card
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={contact.avatar}
                alt={contact.name}
                sx={{ width: 48, height: 48, mr: 2 }}
              />
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600} noWrap>
                    {contact.name}
                  </Typography>
                  {contact.favorite && (
                    <Iconify icon="eva:star-fill" width={16} height={16} sx={{ color: '#ffc107' }} />
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {contact.phone}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1, mb: 2 }}>
              <ContactDetails contact={contact} variant="compact" />
            </Box>

            <ContactActions
              contact={contact}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
              loading={loading}
              compact
            />
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Contacts
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your contact list
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleAddContact}
          startIcon={<Iconify icon="eva:plus-fill" />}
          color="inherit"
        >
          Add Contact
        </Button>
      </Box>

      {/* Controls */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {/* Search */}
          <TextField
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 250, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" width={20} height={20} />
                </InputAdornment>
              )
            }}
          />

          {/* Sort */}
          <Button
            variant="outlined"
            color="inherit"
            onClick={(e) => setFilterMenu(e.currentTarget)}
            endIcon={<Iconify icon="eva:chevron-down-fill" width={16} height={16} />}
          >
            Sort: {sortBy === 'name' ? 'Name' : sortBy === 'company' ? 'Company' : 'Recent'}
          </Button>

          {/* View Mode */}
          <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setViewMode('list')}
              sx={{
                borderRadius: 0,
                bgcolor: viewMode === 'list' ? 'common.black' : 'transparent',
                color: viewMode === 'list' ? 'white' : 'text.secondary'
              }}
            >
              <Iconify icon="eva:list-fill" width={16} height={16} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setViewMode('grid')}
              sx={{
                borderRadius: 0,
                bgcolor: viewMode === 'grid' ? 'common.black' : 'transparent',
                color: viewMode === 'grid' ? 'white' : 'text.secondary'
              }}
            >
              <Iconify icon="eva:grid-fill" width={16} height={16} />
            </IconButton>
          </Box>

          {/* Stats */}
          <Chip
            label={`${filteredContacts.length} of ${contacts.length} contacts`}
            variant="outlined"
            size="small"
          />
        </Box>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
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
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Content */}
      {!loading && (
        <>
          {filteredContacts.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 8 }}>
              <Iconify icon="mingcute:contacts-2-line" width={96} height={96} sx={{ color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchTerm ? 'No contacts found' : 'No contacts yet'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Start building your contact list by adding your first contact'
                }
              </Typography>
              {!searchTerm && (
                <Button
                  variant="contained"
                  onClick={handleAddContact}
                  startIcon={<Iconify icon="eva:plus-fill" width={20} height={20} />}
                >
                  Add First Contact
                </Button>
              )}
            </Card>
          ) : (
            viewMode === 'list' ? renderListView() : renderGridView()
          )}
        </>
      )}

      {/* Sort Menu */}
      <Menu
        anchorEl={filterMenu}
        open={Boolean(filterMenu)}
        onClose={() => setFilterMenu(null)}
      // sx={{ color: "inherit" }}
      >
        <MenuItem onClick={() => { setSortBy('name'); setFilterMenu(null); }}>
          <Iconify icon="eva:person-fill" width={16} height={16} sx={{ mr: 1 }} />
          Sort by Name
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('company'); setFilterMenu(null); }}>
          <Iconify icon="eva:briefcase-fill" width={16} height={16} sx={{ mr: 1 }} />
          Sort by Company
        </MenuItem>
        <MenuItem onClick={() => { setSortBy('recent'); setFilterMenu(null); }}>
          <Iconify icon="eva:clock-fill" width={16} height={16} sx={{ mr: 1 }} />
          Sort by Recent
        </MenuItem>
      </Menu>

      {/* Dialogs */}
      <ContactFormDialog
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, mode: 'add', contact: null })}
        onSubmit={handleFormSubmit}
        loading={loading}
        contact={formDialog.contact}
        mode={formDialog.mode}
      />

      <DeleteConfirmationDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, contactId: null })}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </Box>
  );
}