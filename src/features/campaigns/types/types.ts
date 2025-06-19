export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  locations: string[];
  status: CampaignStatus;
  contentIds: string[];
  userId: string;
  createdAt: string;
}