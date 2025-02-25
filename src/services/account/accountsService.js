import api from '../config';

const AccountsService = {
  baseUrl: '/accounts',
  createCustomer: async (customerData) => {
    const response = await api.post(AccountsService.baseUrl, customerData);
    return response.data;
  },

  fetchCustomers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`${AccountsService.baseUrl}?${queryParams}`);
    return response.data;
  },

  fetchCustomersdropdown: async () => {
    const response = await api.get(`${AccountsService.baseUrl}/getallaccount`);
    return response.data;
  },

  fetchNonCustomer: async () => {
    const response = await api.get(`${AccountsService.baseUrl}/getnoncustomer`);
    return response.data;
  },

  deleteCustomerAccount: async (accountId) => {
    const response = await api.delete(`${AccountsService.baseUrl}/${accountId}`);
    return response.data; 
  },

  sendTransactionEmail: async (accountId) => {
    const response = await api.post(`${AccountsService.baseUrl}/sendmail`,accountId);
    return response.data; 
  }
};

export default AccountsService;
