import api from '../config';

const IncomeService = {
  baseUrl: 'other/incomes',

  createIncome: async (incomeData) => {
    const response = await api.post(IncomeService.baseUrl, incomeData);
    return response.data;
  },

  getAllIncomes: async () => {
    const response = await api.get(IncomeService.baseUrl);
    return response.data;
  },

  getIncome: async (incomeId) => {
    const response = await api.get(`${IncomeService.baseUrl}/${incomeId}`);
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
  
};

export default IncomeService;
