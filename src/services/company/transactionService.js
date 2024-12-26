import api from '../config';

const TransactionService = {
  baseUrl: 'transactions',

  createTransaction: async (transactionData) => {
    const response = await api.post(`${TransactionService.baseUrl}`, transactionData);
    return response.data;
  },

  // getTransactions: async () => {
  //   const response = await api.get(`${TransactionService.baseUrl}`);
  //   return response.data;
  // },

  getTransactions: async (params = {}) => {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'appliedDate',
      order = 'desc' 
    } = params;

    const queryParams = new URLSearchParams({
      page,
      limit,
      search,
      sortBy,
      order
    }).toString();

    const response = await api.get(`${TransactionService.baseUrl}?${queryParams}`);
    return response.data;
  },

  getTransactionById: async (id) => {
    const response = await api.get(`${TransactionService.baseUrl}/${id}`);
    return response.data;
  },

  getTransactionsByUser: async (userId) => {
    const response = await api.get(`${TransactionService.baseUrl}/user/${userId}`);
    return response.data;
  },

  getTransactionsByCompany: async (companyId) => {
    const response = await api.get(`${TransactionService.baseUrl}/company/${companyId}`);
    return response.data;
  },

  updateTransaction: async (id, transactionData) => {
    const response = await api.put(`${TransactionService.baseUrl}/${id}`, transactionData);
    return response.data;
  },

  deleteTransaction: async (id) => {
    const response = await api.delete(`${TransactionService.baseUrl}/${id}`);
    return response.data;
  },
  
};

export default TransactionService;