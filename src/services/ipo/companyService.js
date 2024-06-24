import api from '../config';

const CompanyService = {
  baseUrl: '/companies',

  getCompanyById: async (companyId) => {
    const response = await api.get(`${CompanyService.baseUrl}/${companyId}`);
    return response.data;
  },

  getCompanies: async (isArchived = true) => {
    const response = await api.get(`${CompanyService.baseUrl}?archiveStatus=${isArchived ? 'yes' : 'no'}`);
    return response.data;
  },
  // getCompanies: async () => {
  //   const response = await api.get(CompanyService.baseUrl);
  //   return response.data;
  // },

  createCompany: async (companyData) => {
    const response = await api.post(CompanyService.baseUrl, companyData);
    return response.data;
  },

  updateCompany: async (companyId, companyData) => {
    const response = await api.put(`${CompanyService.baseUrl}/${companyId}`, companyData);
    return response.data;
  },
  
};

export default CompanyService;