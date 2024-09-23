import api from '../config';

const SettingService = {
  baseUrl: '/setting',

  fetchError: async () => {
    const response = await api.get(`${SettingService.baseUrl}/errorlogs`);
    return response.data;
  },

};

export default SettingService;