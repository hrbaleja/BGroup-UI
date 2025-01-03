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
    const response = await api.get(`${AccountsService.baseUrl}/drop`);
    return response.data;
  },

  fetchCustomerDetails: async (customerId) => {
    const response = await api.get(`${AccountsService.baseUrl}/tr/${customerId}`);
    return response.data;
  },

  fetchNonCustomer: async () => {
    const response = await api.get(`${AccountsService.baseUrl}/getnoncustomer`);
    return response.data;
  },
};

export default AccountsService;
