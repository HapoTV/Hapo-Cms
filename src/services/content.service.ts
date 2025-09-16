// src/services/content.service.ts

import apiService from './api.service';
import {ContentItem, ContentRequest, ContentResponse} from '../types/models/ContentItem';

// A generic interface to match the structure of your backend's ApiResponse
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
  path: string;
}

export const contentService = {
    // --- NEW METHOD FOR SUPABASE WORKFLOW ---
    /**
     * Creates a new content record by sending metadata and the Supabase URL to the backend.
     * Corresponds to: POST /api/content/create
   */
    saveContentMetadata: async (
  contentRequest: ContentRequest
): Promise<ContentResponse> => {
        const response = await apiService.post<ApiResponse<ContentResponse>>(
            '/api/content/create',
            contentRequest
  );
        return response.data;
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
     * Retrieves a single content item by its UUID.
     * Corresponds to: GET /api/content/{id}
     */
    getContentById: async (id: string): Promise<ContentItem> => {
            const response = await apiService.get<ApiResponse<ContentItem>>(
                `/api/content/${id}`
            );
            return response.data;
    },

    /**
     * Updates an existing content item.
     * Corresponds to: PUT /api/content/{id}
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
     * Deletes a content item by its UUID.
     * Corresponds to: DELETE /api/content/{id}
     */
    deleteContent: async (id: string): Promise<void> => {
        await apiService.delete(`/api/content/${id}`);
    },

    /**
     * Retrieves all content items.
     * Corresponds to: GET /api/content
     */
    getAllContent: async (): Promise<ContentItem[]> => {
        const response = await apiService.get<ApiResponse<ContentItem[]>>(
            '/api/content'
        );
        return response.data || [];
    },

    // --- FILTERING ENDPOINTS ---
    /**
     * Retrieves a list of content items filtered by a specific type (e.g., MP4, JPEG).
     * Corresponds to: GET /api/content/type/{type}
     */
    getContentByType: async (type: string): Promise<ContentItem[]> => {
        const response = await apiService.get<ApiResponse<ContentItem[]>>(
            `/api/content/type/${type}`
        );
        return response.data || [];
    },

    /**
     * Retrieves a list of content items filtered by a broad category (e.g., VIDEO, AUDIO).
     * Corresponds to: GET /api/content/category/{category}
   */
  getContentByCategory: async (category: string): Promise<ContentItem[]> => {
        const response = await apiService.get<ApiResponse<ContentItem[]>>(
            `/api/content/category/${category}`
        );
        return response.data || [];
    },

    // --- ACTION ENDPOINTS ---
    /**
     * Sends a request to publish content to one or more screens.
     * Corresponds to: POST /api/content/publish
     */
    publishContent: async (content: ContentItem): Promise<void> => {
        // The backend expects a ContentDTO which includes screenIds
        await apiService.post('/api/content/publish', content);
    },

    /**
     * Duplicates an existing content item.
     * NOTE: Your controller did not have a /duplicate endpoint, but your previous service file did.
     * I am including it here for completeness. If you don't have this endpoint, you can remove it.
     */
    duplicateContent: async (id: string): Promise<ContentItem> => {
      const response = await apiService.post<ApiResponse<ContentItem>>(`/api/content/duplicate/${id}`);
      return response.data;
    }
};

export default contentService;