import api from '../config';

const UserService = {
    baseUrl: '/users',

    fetchUsers: async () => {
        const response = await api.get(UserService.baseUrl);
        return response.data;
    },

    updateUser: async (userId, updatedUser) => {
        const response = await api.put(`${UserService.baseUrl}/${userId}`, updatedUser);
        return response.data;
    },

    updateStatus: async (userId, updatedUser) => {
        const response = await api.put(`${UserService.baseUrl}/status/${userId}`, { isActive: updatedUser.isActive });
        return response.data;
    },

    updatePassword: async (userId, updatedPassword) => {
        const response = await api.put(`${UserService.baseUrl}/password/${userId}`, updatedPassword);
        return response.data;
    },

};

export default UserService;