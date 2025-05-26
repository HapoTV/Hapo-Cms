import apiService from './api.service';

export interface ContentItem {
  id?: number;
  name: string;
  type: string;
  url: string;
  tags: any;
  duration?: number;
  uploadDate?: string;
  metadata?: any;
  campaignId?: number;
  screenIds?: number[];
}

export const contentService = {
  createContent: async (content: ContentItem): Promise<ContentItem> => {
    return apiService.post<ContentItem>('/api/content', content);
  },

  getContentById: async (id: number): Promise<ContentItem> => {
    return apiService.get<ContentItem>(`/api/content/${id}`);
  },

  updateContent: async (id: number, content: ContentItem): Promise<ContentItem> => {
    return apiService.put<ContentItem>(`/api/content/${id}`, content);
  },

  deleteContent: async (id: number): Promise<void> => {
    return apiService.delete<void>(`/api/content/${id}`);
  },

  getContentByType: async (type: string): Promise<ContentItem[]> => {
    return apiService.get<ContentItem[]>(`/api/content/type/${type}`);
  },

  publishContent: async (content: ContentItem): Promise<string> => {
    return apiService.post<string>('/api/content/publish', content);
  }
};

export default contentService;