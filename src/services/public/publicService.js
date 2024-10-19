import api from '../config';

const PublicService = {
  baseUrl: '/inovice',

  getTransactionsByCustomerId: async (customerId) => {
    const response = await api.get(`${PublicService.baseUrl}/${customerId}`);
    return response.data;
  },

};

export default PublicService;