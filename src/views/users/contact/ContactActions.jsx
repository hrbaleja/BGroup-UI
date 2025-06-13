import PropTypes from 'prop-types';
import { Box, Grid, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from 'src/components/iconify';

const ActionButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding:  theme.spacing(0.5),
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

const CONTACT_ACTIONS = [
  {
    key: 'call',
    label: 'Call',
    icon: 'eva:phone-fill',
    color: '#2196f3',
    hoverColor: 'rgba(33, 150, 243, 0.1)',
    action: (contact) => window.open(`tel:${contact.phone}`, '_self')
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: 'logos:whatsapp-icon',
    color: '#4caf50',
    hoverColor: 'rgba(76, 175, 80, 0.1)',
    action: (contact) => window.open(`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')
  },
  {
    key: 'email',
    label: 'Email',
    icon: 'eva:email-fill',
    color: '#9c27b0',
    hoverColor: 'rgba(156, 39, 176, 0.1)',
    action: (contact) => window.open(`mailto:${contact.email}`, '_self')
  },
  {
    key: 'edit',
    label: 'Edit',
    icon: 'eva:edit-fill',
    color: '#ff9800',
    hoverColor: 'rgba(255, 152, 0, 0.1)',
    action: null // Will be handled by parent
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: 'eva:trash-2-fill',
    color: '#f44336',
    hoverColor: 'rgba(244, 67, 54, 0.1)',
    action: null // Will be handled by parent
  }
];

export default function ContactActions({ 
  contact, 
  onEdit, 
  onDelete, 
  loading = false,
  compact = false 
}) {
  const handleAction = (actionKey) => {
    const action = CONTACT_ACTIONS.find(a => a.key === actionKey);
    
    if (actionKey === 'edit' && onEdit) {
      onEdit(contact);
    } else if (actionKey === 'delete' && onDelete) {
      onDelete(contact.id);
    } else if (action?.action) {
      action.action(contact);
    }
  };

  if (compact) {
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {CONTACT_ACTIONS.map((action) => (
          <IconButton
            key={action.key}
            size="small"
            onClick={() => handleAction(action.key)}
            disabled={loading}
            sx={{
              color: action.color,
              '&:hover': {
                backgroundColor: action.hoverColor
              }
            }}
          >
            <Iconify icon={action.icon} width={16} height={16} />
          </IconButton>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1} justifyContent="center">
        {CONTACT_ACTIONS.map((action) => (
          <Grid item key={action.key}>
            <ActionButton
              onClick={() => handleAction(action.key)}
              sx={{ 
                '&:hover': { backgroundColor: action.hoverColor },
                opacity: loading ? 0.6 : 1,
                pointerEvents: loading ? 'none' : 'auto'
              }}
            >
              <ActionIcon bgcolor={action.color}>
                <Iconify icon={action.icon} width={18} height={18} />
              </ActionIcon>
              <Typography variant="caption" color="text.secondary">
                {action.label}
              </Typography>
            </ActionButton>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

ContactActions.propTypes = {
  contact: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  compact: PropTypes.bool,
};