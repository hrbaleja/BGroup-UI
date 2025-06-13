import { useState, useEffect, useCallback } from 'react';
import ContactService from 'src/services/users/contactService';
import { useNotification } from 'src/context/NotificationContext';


// Generate avatar URL based on name
const generateAvatarUrl = (name) => {
    const safeName = name?.toString().replace(/\s+/g, '') || 'anonymous';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${safeName}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};
// Transform API response to component format
const transformContact = (contact) => ({
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
});

export const useContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { showNotification } = useNotification();


    // Fetch contacts
    const fetchContacts = useCallback(async (params) => {
        try {
            setLoading(true);
            setError(null);
            const response = await ContactService.fetchContacts(params);
            const transformedContacts = response.map(transformContact);
            setContacts(transformedContacts);
            return transformedContacts;
        } catch (err) {
            // showNotification("Hello", { severity: 'success', });
            setError('Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    }, []);

    // Create contact
    const createContact = useCallback(async (contactData) => {
        try {
            setLoading(true);
            setError(null);

            const dataToSend = {
                ...contactData,
                whatsapp: contactData.whatsapp || contactData.phone
            };

            const response = await ContactService.createContact(dataToSend);
            if (response.success) {
                fetchContacts()
            }
        } catch (err) {
            setError('Failed to create contact');
        } finally {
            setLoading(false);
        }
    }, []);


    // Update contact
    const updateContact = useCallback(async (contactId, contactData) => {
        try {
            setLoading(true);
            setError(null);

            const dataToSend = {
                ...contactData,
                whatsapp: contactData.whatsapp || contactData.phone
            };

            const response = await ContactService.updateContact(contactId, dataToSend);
            if (response.success) {
                fetchContacts()
            }
        } catch (err) {
            setError('Failed to update contact');
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete contact
    const deleteContact = useCallback(async (contactId) => {
        try {
            setLoading(true);
            setError(null);

            await ContactService.deleteContact(contactId);
            setContacts(prev => prev.filter(contact => contact.id !== contactId));
            return true;
        } catch (err) {
            setError('Failed to delete contact');
            console.error('Error deleting contact:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    return {
        contacts,
        loading,
        error,
        fetchContacts,
        createContact,
        updateContact,
        deleteContact,
        clearError
    };
};