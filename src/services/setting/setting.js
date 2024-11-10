import api from '../config';

const SettingService = {
  baseUrl: '/setting',

  fetchError: async () => {
    const response = await api.get(`${SettingService.baseUrl}/errorlogs`);
    return response.data;
  },

  fetchMenuSettings: async () => {
    const response = await api.get(`${SettingService.baseUrl}/menuSettings`);
    return response.data;
  },

  saveOrUpdateMenuSettings: async (menuSettings) => {
    const response = await api.post(`${SettingService.baseUrl}/menuSettings`, menuSettings);
    return response.data;
  },
  
};

export default SettingService;