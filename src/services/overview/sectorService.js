import api from '../config';

const SectorService = {
  baseUrl: '/sectors',

  createSector: async (sectorData) => {
    const response = await api.post(SectorService.baseUrl, sectorData);
    return response.data;
  },

  getAllSectors: async () => {
    const response = await api.get(SectorService.baseUrl);
    return response.data;
  },

  getLatestSectorValues: async()=>{
    const response = await api.get(`${SectorService.baseUrl}/latest`);
    return response.data
  },

  getSectorById: async (sectorId) => {
    const response = await api.get(`${SectorService.baseUrl}/${sectorId}`);
    return response.data;
  },

  updateSector: async (sectorId, sectorData) => {
    const response = await api.put(`${SectorService.baseUrl}/${sectorId}`, sectorData);
    return response.data;
  },

  deleteSector: async (sectorId) => {
    const response = await api.delete(`${SectorService.baseUrl}/${sectorId}`);
    return response.data;
  },

};

export default SectorService;
