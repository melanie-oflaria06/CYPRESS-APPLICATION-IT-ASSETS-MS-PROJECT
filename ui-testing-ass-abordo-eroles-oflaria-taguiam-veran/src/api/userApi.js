import axios from "axios";

const BASE_URL = "http://localhost:8080/api/users";

/**
 * User/Employee API Service
 */
const userApi = {
  // Get all registered employees
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  // Get only active employees
  getActive: async () => {
    const response = await axios.get(`${BASE_URL}/active`);
    return response.data;
  },

  // Get a specific user by ID
  getById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Register a new employee
  create: async (userData) => {
    const response = await axios.post(BASE_URL, userData);
    return response.data;
  },

  // Update employee information
  update: async (id, userData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, userData);
    return response.data;
  },

  // Deactivate an employee
  deactivate: async (id) => {
    const response = await axios.patch(`${BASE_URL}/${id}/deactivate`);
    return response.data;
  }
};

export default userApi;
