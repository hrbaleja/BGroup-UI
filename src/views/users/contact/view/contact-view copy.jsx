import React, { useState, useEffect } from 'react';
import {
  Box, Card, Stack, Table, Button, Container, TableBody, Typography, TableContainer,
  TablePagination, IconButton, Avatar, Popover, List, ListItemButton, ListItemAvatar,
  ListItemText, Collapse, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, Menu, MenuItem, Divider, Alert, Snackbar, Fab, InputAdornment,
  TableHead, TableRow, TableCell, TableSortLabel, Toolbar, OutlinedInput, Tooltip,
  Switch, FormControlLabel, CardContent, CardActions, Badge
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';


// Icons (using simple text representations since we don't have the icon library)
const Icon = ({ name, ...props }) => {
  const iconMap = {
    'plus': '+',
    'phone': '📞',
    'email': '✉️',
    'whatsapp': '💬',
    'edit': '✏️',
    'delete': '🗑️',
    'search': '🔍',
    'more': '⋮',
    'close': '✕',
    'expand': '▼',
    'collapse': '▲',
    'contact': '👤',
    'save': '💾',
    'cancel': '❌',
    'filter': '🔽',
    'sort': '↕️',
    'star': '⭐',
    'unstar': '☆'
  };
  return <span style={{ fontSize: '16px', ...props.sx }}>{iconMap[name] || '•'}</span>;
};

// Styled Components
const HeaderBox = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2, 2, 0, 0),
}));

const ActionCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '2px solid transparent',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  }
}));

const ContactCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  border: '1px solid',
  borderColor: alpha(theme.palette.primary.main, 0.1),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  }
}));

const SearchToolbar = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
}));

// Mock API Service
const ContactService = {
  getContacts: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const contacts = Array.from({ length: 2 }, (_, i) => ({
      id: i + 1,
      name: `Contact ${i + 1}`,
      phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      whatsapp: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      email: `contact${i + 1}@example.com`,
      company: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Tesla'][Math.floor(Math.random() * 5)],
      position: ['Manager', 'Developer', 'Designer', 'Analyst', 'Director'][Math.floor(Math.random() * 5)],
      notes: `Notes for contact ${i + 1}`,
      favorite: Math.random() > 0.7,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=contact${i + 1}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
      createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
      tags: ['Work', 'Personal', 'Family', 'Business'].slice(0, Math.floor(Math.random() * 3) + 1)
    }));

    return contacts;
  },

  createContact: async (contactData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: Date.now(),
      ...contactData,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${contactData.name}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
      createdAt: new Date().toISOString(),
      favorite: false
    };
  },

  updateContact: async (id, contactData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id, ...contactData };
  },

  deleteContact: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

// Contact Popover Component
const ContactPopover = ({ anchorEl, onClose, contacts, onContactAction }) => {
  const [expandedContact, setExpandedContact] = useState(null);

  const toggleContact = (contactId) => {
    setExpandedContact(expandedContact === contactId ? null : contactId);
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: { width: 420, maxHeight: '70vh' }
      }}
    >
      <HeaderBox>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h5" fontWeight="bold">Quick Contacts</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {contacts.slice(0, 5).length} recent contacts
            </Typography>
          </Box>
          <IconButton
            onClick={() => onContactAction('add')}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
            }}
          >
            <Iconify icon="eva:plus-fill" width={24} height={24} />
          </IconButton>
        </Box>
      </HeaderBox>

      <Box sx={{ maxHeight: '50vh', overflow: 'auto' }}>
        <List disablePadding>
          {contacts.slice(0, 5).map((contact) => (
            <Box key={contact.id}>
              <ListItemButton onClick={() => toggleContact(contact.id)}>
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={contact.favorite ? <Icon name="star" sx={{ fontSize: 12, color: '#ffc107' }} /> : null}
                  >
                    <Avatar src={contact.avatar} sx={{ width: 44, height: 44 }} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={600}>
                      {contact.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {contact.company} • {contact.position}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contact.phone}
                      </Typography>
                    </Box>
                  }
                />
                <Icon name={expandedContact === contact.id ? 'collapse' : 'expand'} />
              </ListItemButton>

              <Collapse in={expandedContact === contact.id}>
                <Paper elevation={0} sx={{ backgroundColor: 'grey.50', mx: 2, mb: 1, borderRadius: 2 }}>
                  <Grid container spacing={1} sx={{ p: 2 }}>
                    <Grid item xs={6}>
                      <ActionCard onClick={() => window.open(`tel:${contact.phone}`, '_self')}>
                        <Icon name="phone" sx={{ fontSize: 20, color: '#2196f3' }} />
                        <Typography variant="caption" display="block" mt={0.5}>Call</Typography>
                      </ActionCard>
                    </Grid>
                    <Grid item xs={6}>
                      <ActionCard onClick={() => window.open(`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}>
                        <Iconify icon="logos:whatsapp-icon" width={18} height={18} />
                        <Typography variant="caption" display="block" mt={0.5}>WhatsApp</Typography>
                      </ActionCard>
                    </Grid>
                    <Grid item xs={6}>
                      <ActionCard onClick={() => window.open(`mailto:${contact.email}`, '_self')}>
                        <Icon name="email" sx={{ fontSize: 20, color: '#ff5722' }} />
                        <Typography variant="caption" display="block" mt={0.5}>Email</Typography>
                      </ActionCard>
                    </Grid>
                    <Grid item xs={6}>
                      <ActionCard onClick={() => onContactAction('edit', contact)}>
                        <Icon name="edit" sx={{ fontSize: 20, color: '#ff9800' }} />
                        <Typography variant="caption" display="block" mt={0.5}>Edit</Typography>
                      </ActionCard>
                    </Grid>
                  </Grid>
                </Paper>
              </Collapse>
            </Box>
          ))}
        </List>
      </Box>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => onContactAction('viewAll')}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              border: 'none'
            }
          }}
        >
          View All Contacts
        </Button>
      </Box>
    </Popover>
  );
};

// Contact Form Dialog
const ContactFormDialog = ({ open, onClose, contact, onSubmit, mode = 'add' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    company: '',
    position: '',
    notes: '',
    tags: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact && mode === 'edit') {
      setFormData(contact);
    } else {
      setFormData({
        name: '',
        phone: '',
        whatsapp: '',
        email: '',
        company: '',
        position: '',
        notes: '',
        tags: []
      });
    }
  }, [contact, mode, open]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            {mode === 'edit' ? 'Edit Contact' : 'Add New Contact'}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Icon name="close" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Icon name="contact" /></InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Icon name="phone" /></InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="WhatsApp"
              value={formData.whatsapp}
              onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Icon name="whatsapp" /></InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Icon name="email" /></InputAdornment>
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Position"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name.trim() || loading}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            px: 4
          }}
        >
          {loading ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Add Contact')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Delete Confirmation Dialog
const DeleteConfirmDialog = ({ open, onClose, onConfirm, contactName }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>
      <Typography variant="h6" color="error" fontWeight={600}>
        Delete Contact
      </Typography>
    </DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete <strong>{contactName}</strong>? This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 3, gap: 1 }}>
      <Button onClick={onClose} variant="outlined">Cancel</Button>
      <Button onClick={onConfirm} variant="contained" color="error">Delete</Button>
    </DialogActions>
  </Dialog>
);

// Main Contact Management Component
export default function ContactManagement() {
  // State Management
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  // Dialog States
  const [formDialog, setFormDialog] = useState({ open: false, mode: 'add', contact: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, contact: null });
  const [popoverAnchor, setPopoverAnchor] = useState(null);

  // Notification
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Load contacts on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await ContactService.getContacts();
      setContacts(data);
    } catch (error) {
      showNotification('Error loading contacts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  };

  // Contact Actions
  const handleAddContact = async (contactData) => {
    try {
      const newContact = await ContactService.createContact(contactData);
      setContacts(prev => [newContact, ...prev]);
      showNotification('Contact added successfully');
    } catch (error) {
      showNotification('Error adding contact', 'error');
    }
  };

  const handleEditContact = async (contactData) => {
    try {
      const updatedContact = await ContactService.updateContact(formDialog.contact.id, contactData);
      setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
      showNotification('Contact updated successfully');
    } catch (error) {
      showNotification('Error updating contact', 'error');
    }
  };

  const handleDeleteContact = async () => {
    try {
      await ContactService.deleteContact(deleteDialog.contact.id);
      setContacts(prev => prev.filter(c => c.id !== deleteDialog.contact.id));
      setDeleteDialog({ open: false, contact: null });
      showNotification('Contact deleted successfully');
    } catch (error) {
      showNotification('Error deleting contact', 'error');
    }
  };

  const toggleFavorite = (contactId) => {
    setContacts(prev => prev.map(c =>
      c.id === contactId ? { ...c, favorite: !c.favorite } : c
    ));
  };

  const handlePopoverAction = (action, contact) => {
    setPopoverAnchor(null);

    switch (action) {
      case 'add':
        setFormDialog({ open: true, mode: 'add', contact: null });
        break;
      case 'edit':
        setFormDialog({ open: true, mode: 'edit', contact });
        break;
      case 'viewAll':
        // Already on the main page
        break;
    }
  };

  // Table Functions
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(filterName.toLowerCase()) ||
    contact.email.toLowerCase().includes(filterName.toLowerCase()) ||
    contact.company.toLowerCase().includes(filterName.toLowerCase())
  );

  const sortedContacts = filteredContacts.sort((a, b) => {
    if (orderBy === 'name') {
      return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    return 0;
  });

  const paginatedContacts = sortedContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6">Loading contacts...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
        <Box>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Contact Management
          </Typography>

        </Box>
        <Stack direction="row" spacing={2}>
          <IconButton
            onClick={(e) => setPopoverAnchor(e.currentTarget)}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': { backgroundColor: 'primary.dark' }
            }}
          >
            <Icon name="contact" sx={{ color: 'white' }} />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" width={18} height={18} />}
            onClick={() => setFormDialog({ open: true, mode: 'add', contact: null })}
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 3
            }}
          >
            Add Contact
          </Button>
        </Stack>
      </Stack>

      {/* Main Content */}
      <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Toolbar */}
        <SearchToolbar>
          <OutlinedInput
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Search contacts..."
            startAdornment={<Icon name="search" sx={{ mr: 1, color: 'text.secondary' }} />}
            sx={{ width: 320, backgroundColor: 'white', borderRadius: 2 }}
          />
          <Box display="flex" alignItems="center" gap={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={viewMode === 'card'}
                  onChange={(e) => setViewMode(e.target.checked ? 'card' : 'table')}
                />
              }
              label="Card View"
            />
            <Typography variant="body2" color="text.secondary">
              {filteredContacts.length} contact(s)
            </Typography>
          </Box>
        </SearchToolbar>

        {/* Content */}
        {viewMode === 'table' ? (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Icon name="star" />
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={orderBy === 'name'}
                        direction={orderBy === 'name' ? order : 'asc'}
                        onClick={() => handleSort('name')}
                      >
                        Contact
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedContacts.map((contact) => (
                    <StyledTableRow key={contact.id}>
                      <TableCell padding="checkbox">
                        <IconButton onClick={() => toggleFavorite(contact.id)}>
                          <Icon name={contact.favorite ? 'star' : 'unstar'} sx={{ color: contact.favorite ? '#ffc107' : 'text.secondary' }} />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar src={contact.avatar} sx={{ width: 40, height: 40 }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {contact.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {contact.position}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{contact.company}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{contact.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{contact.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={0.5} flexWrap="wrap">
                          {contact.tags.slice(0, 2).map((tag, index) => (
                            <Chip key={index} label={tag} size="small" />
                          ))}
                          {contact.tags.length > 2 && (
                            <Chip label={`+${contact.tags.length - 2}`} size="small" variant="outlined" />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Call">
                            <IconButton size="small" onClick={() => window.open(`tel:${contact.phone}`, '_self')}>
                              <Iconify icon="eva:phone-fill" width={18} height={18} sx={{ color: '#2196f3' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="WhatsApp">
                            <IconButton size="small" onClick={() => window.open(`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}>
                              <Iconify icon="logos:whatsapp-icon" width={18} height={18} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => setFormDialog({ open: true, mode: 'edit', contact })}>
                              <Iconify icon="eva:edit-fill" width={22} height={22} sx={{ color: '#ff9800' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => setDeleteDialog({ open: true, contact })}>
                              <Iconify icon="eva:trash-2-fill" width={18} height={18} sx={{ color: '#f44336' }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredContacts.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        ) : (
          <>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {paginatedContacts.map((contact) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={contact.id}>
                    <ContactCard>
                      <CardContent sx={{ pb: 1 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Avatar src={contact.avatar} sx={{ width: 56, height: 56 }} />
                          <IconButton onClick={() => toggleFavorite(contact.id)}>
                            <Icon name={contact.favorite ? 'star' : 'unstar'} sx={{ color: contact.favorite ? '#ffc107' : 'text.secondary' }} />
                          </IconButton>
                        </Box>

                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {contact.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {contact.position} at {contact.company}
                        </Typography>

                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Icon name="phone" sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption">{contact.phone}</Typography>
                        </Box>

                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                          <Icon name="email" sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption">{contact.email}</Typography>
                        </Box>

                        <Box display="flex" gap={0.5} flexWrap="wrap" mb={2}>
                          {contact.tags.slice(0, 3).map((tag, index) => (
                            <Chip key={index} label={tag} size="small" />
                          ))}
                        </Box>
                      </CardContent>

                      <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Call">
                            <IconButton size="small" onClick={() => window.open(`tel:${contact.phone}`, '_self')}>
                              <Icon name="phone" sx={{ color: '#2196f3' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="WhatsApp">
                            <IconButton size="small" onClick={() => window.open(`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}>
                              <Icon name="whatsapp" sx={{ color: '#4caf50' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Email">
                            <IconButton size="small" onClick={() => window.open(`mailto:${contact.email}`, '_self')}>
                              <Icon name="email" sx={{ color: '#ff5722' }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => setFormDialog({ open: true, mode: 'edit', contact })}>
                              <Icon name="edit" sx={{ color: '#ff9800' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => setDeleteDialog({ open: true, contact })}>
                              <Icon name="delete" sx={{ color: '#f44336' }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </CardActions>
                    </ContactCard>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box display="flex" justifyContent="center" pb={3}>
              <TablePagination
                component="div"
                count={filteredContacts.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[8, 16, 24, 32]}
                showFirstButton
                showLastButton
              />
            </Box>
          </>
        )}
      </Card>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg,rgb(241, 174, 186) 0%,rgb(240, 39, 156) 100%)',
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={() => setFormDialog({ open: true, mode: 'add', contact: null })}
      >
        <Iconify icon="eva:plus-fill" width={24} height={24} />
      </Fab>

      {/* Contact Popover */}
      <ContactPopover
        anchorEl={popoverAnchor}
        onClose={() => setPopoverAnchor(null)}
        contacts={contacts}
        onContactAction={handlePopoverAction}
      />

      {/* Contact Form Dialog */}
      <ContactFormDialog
        open={formDialog.open}
        onClose={() => setFormDialog({ open: false, mode: 'add', contact: null })}
        contact={formDialog.contact}
        mode={formDialog.mode}
        onSubmit={formDialog.mode === 'edit' ? handleEditContact : handleAddContact}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, contact: null })}
        onConfirm={handleDeleteContact}
        contactName={deleteDialog.contact?.name || ''}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Empty State */}
      {contacts.length === 0 && !loading && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          textAlign="center"
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3
            }}
          >
            <Icon name="contact" sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            No Contacts Yet
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Start building your contact network by adding your first contact.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Iconify icon="eva:plus-fill" width={24} height={24} />}
            onClick={() => setFormDialog({ open: true, mode: 'add', contact: null })}
            sx={{
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              py: 1.5
            }}
          >
            Add Your First Contact
          </Button>
        </Box>
      )}

      {/* No Search Results */}
      {contacts.length > 0 && filteredContacts.length === 0 && filterName && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
          textAlign="center"
        >
          <Icon name="search" sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            No contacts found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No contacts match your search for "{filterName}"
          </Typography>
          <Button
            variant="text"
            onClick={() => setFilterName('')}
            sx={{ mt: 2 }}
          >
            Clear Search
          </Button>
        </Box>
      )}
    </Container>
  );
}