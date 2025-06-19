import { api } from '../api';
import type { Campaign, CampaignStatus } from './types';

export const campaignService = {
  getAllCampaigns: async (params?: {
    status?: CampaignStatus;
    location?: string;
    search?: string;
  }): Promise<Campaign[]> => {
    return api.get('/campaigns', { params });
  },

  getCampaignById: async (id: string): Promise<Campaign> => {
    return api.get(`/campaigns/${id}`);
  },

  createCampaign: async (campaign: Omit<Campaign, 'id' | 'createdAt'>): Promise<Campaign> => {
    return api.post('/campaigns', campaign);
  },

  updateCampaign: async (id: string, campaign: Partial<Campaign>): Promise<Campaign> => {
    return api.put(`/campaigns/${id}`, campaign);
  },

  deleteCampaign: async (id: string): Promise<void> => {
    return api.delete(`/campaigns/${id}`);
  },

  updateStatus: async (id: string, status: CampaignStatus): Promise<Campaign> => {
    return api.patch(`/campaigns/${id}/status`, { status });
  },

  addContent: async (id: string, contentIds: string[]): Promise<Campaign> => {
    return api.post(`/campaigns/${id}/content`, { contentIds });
  },

  removeContent: async (id: string, contentId: string): Promise<Campaign> => {
    return api.delete(`/campaigns/${id}/content/${contentId}`);
  }
};