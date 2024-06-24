// src/services/companyStatisticsService.js
import api from '../config';

const CompanyStatisticsService = {
  fetchCompanyStatistics: async () => {
    try {
      const response = await api.get('/dashboardinfo');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch company statistics:', error);
      return {};
    }
  },
};

export default CompanyStatisticsService;