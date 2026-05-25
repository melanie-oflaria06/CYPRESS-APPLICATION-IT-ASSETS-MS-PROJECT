import axios from "axios";

const BASE_URL = "http://localhost:8080/api/assets";

/**
 * Asset API Service
 * Handles all hardware inventory communication
 */
const assetApi = {
  // Get all assets in the inventory
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  // Get a single asset by its ID
  getById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Get assets filtered by status (AVAILABLE, IN_USE, etc.)
  getByStatus: async (status) => {
    const response = await axios.get(`${BASE_URL}/status/${status}`);
    return response.data;
  },

  // Helper to specifically get available assets
  getAvailable: async () => {
    const response = await axios.get(`${BASE_URL}/status/AVAILABLE`);
    return response.data;
  },

  // Search for assets by name
  search: async (name) => {
    const response = await axios.get(`${BASE_URL}/search`, { params: { name } });
    return response.data;
  },

  // Register a new asset
  create: async (assetData) => {
    const response = await axios.post(BASE_URL, assetData);
    return response.data;
  },

  // Update an existing asset
  update: async (id, assetData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, assetData);
    return response.data;
  },

  // Delete an asset from the system
  delete: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};

export default assetApi;
