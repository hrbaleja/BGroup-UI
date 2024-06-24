import api from '../config';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response;
  },
  refreshtoken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken })
    return response
  }
};

export default authService;