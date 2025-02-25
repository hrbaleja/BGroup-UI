import api from '../config';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', {userData});
    return response;
  },
  refreshtoken: async (refreshToken) => {
    const response = await api.post('/auth/refreshtoken', { refreshToken })
    return response.data
  },

  forgotPassword: async (usermail) => {
    const response = await api.post('/auth/forgotpassword', usermail)
    return response.data
  },
  resetPassword: async (userdata) => {
    const response = await api.post('/auth/resetpassword', userdata)
    return response.data
  },

  
};

export default authService;