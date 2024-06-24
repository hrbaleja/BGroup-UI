import api from '../config';

const IncomeService = {
  baseUrl: '/income',

  getIncomes: async () => {
    const response = await api.get(IncomeService.baseUrl);
    return response.data;
  },

  createIncome: async (incomeData) => {
    const response = await api.post(IncomeService.baseUrl, incomeData);
    return response.data;
  },

  updateIncome: async (incomeId, incomeData) => {
    const response = await api.put(`${IncomeService.baseUrl}/${incomeId}`, incomeData);
    return response.data;
  },

  deleteIncome: async (incomeId) => {
    const response = await api.delete(`${IncomeService.baseUrl}/${incomeId}`);
    return response.data;
  },

  getIncomeSummary: async () => {
    const response = await api.get(`${IncomeService.baseUrl}/summary`);
    return response.data;
  },

  getIncomesByUser: async (userId) => {
    const response = await api.get(`${IncomeService.baseUrl}/user/${userId}`);
    return response.data;
  },

  getIncomesByCompany: async (companyId) => {
    const response = await api.get(`${IncomeService.baseUrl}/company/${companyId}`);
    return response.data;
  },
};

export default IncomeService;