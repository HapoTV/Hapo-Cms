// src/services/content.service.ts

import apiService from './api.service';
import { ContentItem, ContentRequest, ContentResponse } from '../types/models/ContentItem';

// A generic interface to match the structure of your backend's ApiResponse
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
  path: string;
}

export const contentService = {
  /**
   * Uploads content file with metadata
   */
  uploadContentWithFile: async (
    file: File,
    contentRequest: ContentRequest
  ): Promise<ContentResponse> => {
    const formData = new FormData();

    formData.append('file', file, file.name);

    const contentJson = JSON.stringify(contentRequest);
    const contentBlob = new Blob([contentJson], { type: 'application/json' });
    formData.append('content', contentBlob);

    return await apiService.upload<ContentResponse>(
      '/api/content/upload',
      formData
    );
  },

    // --- EXISTING CRUD AND OTHER ENDPOINTS ---
  /**
   * Creates a new content entity without a file upload (e.g., for text-based content).
   * Corresponds to: POST /api/content
   */
  createContent: async (content: ContentItem): Promise<ContentItem> => {
    const response = await apiService.post<ApiResponse<ContentItem>>(
      '/api/content',
      content
    );
    return response.data;
  },

  /**
   * Fetch content by ID
   */
  getContentById: async (id: string): Promise<ContentItem> => {
    console.log(`Calling API endpoint: /api/content/${id}`);
    try {
      const response = await apiService.get<ApiResponse<ContentItem>>(
        `/api/content/${id}`
      );
      console.log('API response:', response);
      return response.data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  },

  /**
   * Update content
   */
  updateContent: async (
    id: string,
    content: ContentItem
  ): Promise<ContentItem> => {
    const response = await apiService.put<ApiResponse<ContentItem>>(
      `/api/content/${id}`,
      content
    );
    return response.data;
  },

  /**
   * Delete content
   */
  deleteContent: async (id: string): Promise<void> => {
    await apiService.delete(`/api/content/${id}`);
  },

  /**
   * Fetch content by type
   */
  getContentByType: async (type: string): Promise<ContentItem[]> => {
    const response = await apiService.get<ApiResponse<ContentItem[]>>(
      `/api/content/type/${type}`
    );
    return response.data || [];
  },

  /**
   * Fetch content by category (VIDEO, AUDIO, IMAGE, etc.)
   */
  getContentByCategory: async (category: string): Promise<ContentItem[]> => {
    const response = await apiService.get<ApiResponse<ContentItem[]>>(
      `/api/content/category/${category}`
    );
    return response.data || [];
  },

  /**
   * Fetch all content
   */
  getAllContent: async (): Promise<ContentItem[]> => {
    const response = await apiService.get<ApiResponse<ContentItem[]>>(
      '/api/content'
    );
    return response.data || [];
  },

  /**
   * Publish content
   */
  publishContent: async (content: ContentItem): Promise<void> => {
    await apiService.post('/api/content/publish', content);
  },

  /**
   * Duplicate content (only if backend supports it!)
   */
  duplicateContent: async (id: string): Promise<ContentItem> => {
    const response = await apiService.post<ApiResponse<ContentItem>>(
      `/api/content/duplicate/${id}`
    );
    return response.data;
  },
};

export default contentService;
