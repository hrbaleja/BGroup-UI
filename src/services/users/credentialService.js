import api from '../config';

const InformationService = {
  baseUrl: '/credentials',

  createEntry: async (entryData) => {
    const response = await api.post(InformationService.baseUrl, entryData);
    return response.data;
  },

  getEntries: async () => {
    const response = await api.get(InformationService.baseUrl);
    return response.data;
  },

  updateEntry: async (entryId, entryData) => {
    const response = await api.put(`${InformationService.baseUrl}/${entryId}`, entryData);
    return response.data;
  },

  deleteEntry: async (entryId) => {
    const response = await api.delete(`${InformationService.baseUrl}/${entryId}`);
    return response.data;
  },
};

export default InformationService;