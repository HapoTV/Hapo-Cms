import apiService from './api.service';

export interface Campaign {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  locations: string[];
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  contentIds: number[];
  userId: string;
  createdAt: string;
}

export interface CampaignResponse {
  content: Campaign[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export const campaignsService = {
  getAllCampaigns: async (
    page: number = 0, 
    size: number = 10, 
    status?: string, 
    location?: string,
    search?: string
  ): Promise<CampaignResponse> => {
    let url = `/campaigns?page=${page}&size=${size}`;
    
    if (status) url += `&status=${status}`;
    if (location) url += `&location=${encodeURIComponent(location)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    
    return apiService.get<CampaignResponse>(url);
  },
  
  getCampaignById: async (id: number): Promise<Campaign> => {
    return apiService.get<Campaign>(`/campaigns/${id}`);
  },
  
  createCampaign: async (campaignData: Omit<Campaign, 'id' | 'createdAt'>): Promise<Campaign> => {
    return apiService.post<Campaign>('/campaigns', campaignData);
  },
  
  updateCampaign: async (id: number, campaignData: Partial<Campaign>): Promise<Campaign> => {
    return apiService.put<Campaign>(`/campaigns/${id}`, campaignData);
  },
  
  deleteCampaign: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/campaigns/${id}`);
  },
  
  changeCampaignStatus: async (id: number, status: Campaign['status']): Promise<Campaign> => {
    return apiService.patch<Campaign>(`/campaigns/${id}/status`, { status });
  },
  
  addContentToCampaign: async (campaignId: number, contentIds: number[]): Promise<Campaign> => {
    return apiService.post<Campaign>(`/campaigns/${campaignId}/content`, { contentIds });
  },
  
  removeContentFromCampaign: async (campaignId: number, contentId: number): Promise<Campaign> => {
    return apiService.delete<Campaign>(`/campaigns/${campaignId}/content/${contentId}`);
  },
  
  getCampaignAnalytics: async (id: number): Promise<{ views: number, engagement: number }> => {
    return apiService.get<{ views: number, engagement: number }>(`/campaigns/${id}/analytics`);
  },
  
  scheduleCampaign: async (id: number, startDate: string, endDate: string): Promise<Campaign> => {
    return apiService.post<Campaign>(`/campaigns/${id}/schedule`, { startDate, endDate });
  }
};

export default campaignsService;