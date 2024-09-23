import api from '../config';

const TransactionService = {
  baseUrl: 'accounts',

  deposit: async (transactionData) => {
    const response = await api.post(`${TransactionService.baseUrl}/deposit`, transactionData);
    return response.data;
  },

  withdraw: async (transactionData) => {
    const response = await api.post(`${TransactionService.baseUrl}/withdraw`, transactionData);
    return response.data;
  },

  getTransactionsByCustomerId: async (customerId) => {
    const response = await api.get(`${TransactionService.baseUrl}/tr/${customerId}`);
    return response.data;
  },
};

export default TransactionService;
