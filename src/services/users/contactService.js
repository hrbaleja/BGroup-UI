import api from '../config';

const ContactService = {
    baseUrl: '/contacts',

    // Fetch all contacts for the logged-in user
    fetchContacts: async (params) => {
        const response = await api.get(ContactService.baseUrl, { params });
        return response.data.data;
    },

    // Create a new contact
    createContact: async (newContact) => {
        const response = await api.post(ContactService.baseUrl, newContact);
        return response.data;
    },

    // Update a contact by ID
    updateContact: async (contactId, updatedContact) => {
        const response = await api.put(`${ContactService.baseUrl}/${contactId}`, updatedContact);
        return response.data;
    },

    // Delete a contact by ID
    deleteContact: async (contactId) => {
        const response = await api.delete(`${ContactService.baseUrl}/${contactId}`);
        return response.data;
    }
};

export default ContactService;
