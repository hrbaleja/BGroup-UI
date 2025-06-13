import { Box, Paper, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';

const CONTACT_FIELDS = [
  { key: 'phone', label: 'Phone', icon: 'eva:phone-fill', color: '#2196f3' },
  { key: 'whatsapp', label: 'WhatsApp', icon: 'logos:whatsapp-icon', color: '#4caf50' },
  { key: 'email', label: 'Email', icon: 'eva:email-fill', color: '#9c27b0' },
  { key: 'company', label: 'Company', icon: 'eva:briefcase-fill', color: '#ff9800' },
  { key: 'position', label: 'Position', icon: 'eva:person-fill', color: '#9c27b0' },
  { key: 'notes', label: 'Notes', icon: 'eva:file-text-fill', color: '#4caf50', multiline: true }
];

export default function ContactDetails({ contact, variant = 'default' }) {
  const visibleFields = CONTACT_FIELDS.filter(field => 
    contact[field.key] && contact[field.key].trim()
  );

  if (visibleFields.length === 0) {
    return (
      <Paper elevation={1} sx={{ m: 2, p: 2, borderRadius: 1.5 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No additional details available
        </Typography>
      </Paper>
    );
  }

  if (variant === 'compact') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {visibleFields.map((field) => (
          <Box key={field.key} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Iconify 
              icon={field.icon} 
              width={14} 
              height={14} 
              sx={{ 
                color: field.color, 
                mt: field.multiline ? 0.2 : 0.1,
                flexShrink: 0
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              <strong>{field.label}:</strong> {contact[field.key]}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Paper elevation={1} sx={{ m: 2, p: 2, borderRadius: 1.5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {visibleFields.map((field) => (
          <Box key={field.key} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Iconify 
              icon={field.icon} 
              width={16} 
              height={16} 
              sx={{ 
                color: field.color, 
                mt: field.multiline ? 0.2 : 0,
                flexShrink: 0
              }} 
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>{field.label}:</strong> {contact[field.key]}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}