import api from '../config';

const ProfileService = {
  baseUrl: '/profile',

  create: async (profileData) => {
    const response = await api.post(ProfileService.baseUrl, profileData);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`${ProfileService.baseUrl}/${id}`);
    return response.data;
  },

  update: async (id, profileData) => {
    const response = await api.put(`${ProfileService.baseUrl}/${id}`, profileData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`${ProfileService.baseUrl}/${id}`);
    return response.data;
  },
};

export default ProfileService;