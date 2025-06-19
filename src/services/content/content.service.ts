import { api } from '../api';
import type { Content, ContentUploadResponse } from './types';

export const contentService = {
  getAllContent: async (params?: {
    type?: string;
    tags?: string[];
    search?: string;
  }): Promise<Content[]> => {
    return api.get('/content', { params });
  },

  getContentById: async (id: string): Promise<Content> => {
    return api.get(`/content/${id}`);
  },

  uploadContent: async (
    file: File,
    metadata: Partial<Content>,
    onProgress?: (progress: number) => void
  ): Promise<ContentUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    return api.post('/content/upload', formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = (progressEvent.loaded * 100) / progressEvent.total;
          onProgress(Math.round(progress));
        }
      }
    });
  },

  updateContent: async (id: string, data: Partial<Content>): Promise<Content> => {
    return api.put(`/content/${id}`, data);
  },

  deleteContent: async (id: string): Promise<void> => {
    return api.delete(`/content/${id}`);
  },

  addTags: async (id: string, tags: string[]): Promise<Content> => {
    return api.post(`/content/${id}/tags`, { tags });
  },

  removeTag: async (id: string, tag: string): Promise<Content> => {
    return api.delete(`/content/${id}/tags/${tag}`);
  }
};