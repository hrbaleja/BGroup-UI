import api from '../config';

const TaskService = {
  baseUrl: '/tasks',

  getTasks: async () => {
    const response = await api.get(TaskService.baseUrl);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post(TaskService.baseUrl, taskData);
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`${TaskService.baseUrl}/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`${TaskService.baseUrl}/${taskId}`);
    return response.data;
  },

  getTasksByStatus: async (status) => {
    const response = await api.get(`${TaskService.baseUrl}/${status}`);
    return response.data;
  },
};

export default TaskService;