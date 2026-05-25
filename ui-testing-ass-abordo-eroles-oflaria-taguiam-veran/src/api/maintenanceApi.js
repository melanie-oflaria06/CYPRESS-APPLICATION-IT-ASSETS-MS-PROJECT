import axios from "axios";

const BASE_URL = "http://localhost:8080/api/maintenance";

/**
 * Maintenance API Service
 * Handles communications for tracking hardware repair history
 */
const maintenanceApi = {
  
  // Retrieve all maintenance / repair logs
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  // Retrieve a single repair record by id
  getById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Retrieve all repair records for a specific asset
  getByAsset: async (assetId) => {
    const response = await axios.get(`${BASE_URL}/asset/${assetId}`);
    return response.data;
  },

  // Register a new repair log (Status automatically set to PENDING, Asset status to UNDER_REPAIR)
  create: async (maintenanceData) => {
    const response = await axios.post(BASE_URL, maintenanceData);
    return response.data;
  },

  // Resolve a repair log (status: COMPLETED or IRREPARABLE)
  resolve: async (id, status, remarks, cost) => {
    const response = await axios.patch(`${BASE_URL}/${id}/resolve`, null, {
      params: { status, remarks, cost }
    });
    return response.data;
  }
};

export default maintenanceApi;
