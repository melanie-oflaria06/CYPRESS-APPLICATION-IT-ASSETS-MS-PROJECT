import axios from "axios";

const BASE_URL = "http://localhost:8080/api/assignments";

/**
 * Asset Assignment API Service
 */
const assignmentApi = {
  // Get all assignment history
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  // Get currently active assignments
  getActive: async () => {
    const response = await axios.get(`${BASE_URL}/active`);
    return response.data;
  },

  // Create a new assignment
  assign: async (data) => {
    const response = await axios.post(`${BASE_URL}/assign`, data);
    return response.data;
  },

  // Mark an asset as returned
  returnAsset: async (id) => {
    const response = await axios.patch(`${BASE_URL}/${id}/return`);
    return response.data;
  },

  // Mark an asset as lost during assignment
  markAsLost: async (id) => {
    const response = await axios.patch(`${BASE_URL}/${id}/lost`);
    return response.data;
  }
};

export default assignmentApi;
