import api from '../config';

const CustomerService = {
    baseUrl: '/accounts',

    fetchCustomers: async () => {
        const response = await api.get(CustomerService.baseUrl);
        return response.data;
    },

    fetchCustomerDetails: async (customerId) => {
        const response = await api.get(`${CustomerService.baseUrl}/tr/${customerId}`);
        return response.data;
    },

    createCustomer: async (customerData) => {
        const response = await api.post(CustomerService.baseUrl, customerData);
        return response.data;
    },
    fetchNonCustomer: async()=>{
        const response= await api.get(`${CustomerService.baseUrl}/getnoncustomer`);
        return response.data;
    }

};

export default CustomerService;