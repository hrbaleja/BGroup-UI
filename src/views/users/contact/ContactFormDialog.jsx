import { useState, useEffect } from 'react';
import { Box, Dialog, TextField, IconButton, Typography, DialogTitle, DialogContent, DialogActions, Button, CircularProgress } from '@mui/material';
import Iconify from 'src/components/iconify';

const INITIAL_CONTACT = {
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    company: '',
    position: '',
    notes: '',
    favorite: false
};

const FORM_FIELDS = [
    { key: 'name', label: 'Name', required: true, icon: 'eva:person-fill' },
    { key: 'phone', label: 'Phone', icon: 'eva:phone-fill', placeholder: '+91 9664759611' },
    { key: 'whatsapp', label: 'WhatsApp', icon: 'logos:whatsapp-icon', placeholder: '+91 9664759611' },
    { key: 'email', label: 'Email', type: 'email', icon: 'eva:email-fill', placeholder: 'example@email.com' },
    { key: 'company', label: 'Company', icon: 'eva:briefcase-fill', placeholder: 'Company Name' },
    { key: 'position', label: 'Position', icon: 'eva:person-fill', placeholder: 'Job Title' },
    { key: 'notes', label: 'Notes', multiline: true, rows: 3, icon: 'eva:file-text-fill', placeholder: 'Additional notes...' }
];

export default function ContactFormDialog({
    open,
    onClose,
    onSubmit,
    loading = false,
    contact = null,
    mode = 'add' // 'add' or 'edit'
}) {
    const [formData, setFormData] = useState(INITIAL_CONTACT);
    const [errors, setErrors] = useState({});

    const isEditMode = mode === 'edit' && contact;
    const title = isEditMode ? 'Edit Contact' : 'Add New Contact';
    const submitText = isEditMode ? 'Update Contact' : 'Add Contact';

    // Initialize form data
    useEffect(() => {
        if (isEditMode) {
            setFormData({
                name: contact.name || '',
                phone: contact.phone || '',
                whatsapp: contact.whatsapp || '',
                email: contact.email || '',
                company: contact.company || '',
                position: contact.position || '',
                notes: contact.notes || '',
                favorite: contact.favorite || false
            });
        } else {
            setFormData(INITIAL_CONTACT);
        }
        setErrors({});
    }, [contact, isEditMode, open]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            await onSubmit(formData);
            handleClose();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleClose = () => {
        setFormData(INITIAL_CONTACT);
        setErrors({});
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={600}>
                        {title}
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <Iconify icon="eva:close-fill" width={20} height={20} />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                    {FORM_FIELDS.map((field) => (
                        <TextField
                            key={field.key}
                            fullWidth
                            label={field.label}
                            type={field.type || 'text'}
                            value={formData[field.key]}
                            onChange={(e) => handleInputChange(field.key, e.target.value)}
                            required={field.required}
                            variant="outlined"
                            placeholder={field.placeholder}
                            multiline={field.multiline}
                            rows={field.rows}
                            error={!!errors[field.key]}
                            helperText={errors[field.key] || (field.required ? 'Required field' : '')}
                            InputProps={{
                                startAdornment: (
                                    <Iconify
                                        icon={field.icon}
                                        width={20}
                                        height={20}
                                        sx={{
                                            mr: 1,
                                            color: field.key === 'whatsapp' ? 'inherit' : 'text.secondary',
                                            alignSelf: field.multiline ? 'flex-start' : 'center',
                                            mt: field.multiline ? 1 : 0
                                        }}
                                    />
                                )
                            }}
                        />
                    ))}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 2 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="inherit"
                    sx={{ borderRadius: 2 }}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!formData.name.trim() || loading}
                    sx={{
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #c2185b 0%, #e91e63 100%)',
                        }
                    }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : submitText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}