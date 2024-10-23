import api from '../config';

const PublicService = {
  baseUrl: '/inovice',

  getTransactionsByCustomerId: async (customerId) => {
    const response = await api.get(`${PublicService.baseUrl}/${customerId}`);
    return response.data;
  },

  getTokenByCustomerId: async (customerId) => {
    const response = await api.post(`${PublicService.baseUrl}`, { customerId });
    return response.data;
  },
};

export default PublicService;