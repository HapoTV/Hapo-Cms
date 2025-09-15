// src/services/content.service.ts

import apiService from './api.service';
import {ContentItem, ContentRequest, ContentResponse} from '../types/models/ContentItem';

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
  
  // Append file (important: use the exact field name expected by backend)
  formData.append('file', file, file.name);
  
  // Append content as JSON blob
  const contentJson = JSON.stringify(contentRequest);
  const contentBlob = new Blob([contentJson], { type: 'application/json' });
  formData.append('content', contentBlob);

  // Use the special upload method
  return await apiService.upload<ContentResponse>(
    '/api/content/upload',
    formData
  );
},

  /**
   * Creates new content (without file)
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
    getContentById: async (id: number): Promise<ContentItem> => {
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
        id: number, 
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
    deleteContent: async (id: number): Promise<void> => {
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
   * CORRECTED: Fetches content by a broad category (e.g., VIDEO, AUDIO).
   * It now properly unwraps the API response to return the array.
   */
  getContentByCategory: async (category: string): Promise<ContentItem[]> => {
    const responseWrapper = await apiService.get<ApiResponse<ContentItem[]>>(`/api/content/category/${category}`);
    // Return the nested `data` array, or an empty array if it's missing.
    return responseWrapper.data || [];
  },

    /**

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
     * Duplicate content
     */
    duplicateContent: async(id: number): Promise<ContentItem> => {
      const response = await apiService.post<ApiResponse<ContentItem>>(`/api/content/duplicate/${id}`);
      return response.data;
    }

     
};

export default contentService;