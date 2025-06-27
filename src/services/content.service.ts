// src/services/content.service.ts
import apiService from './api.service';
import {ContentItem} from '../types/models/ContentItem';

/**
 * Defines the shape of the standard API response wrapper from the backend.
 * Using a generic <T> allows us to reuse this for any type of data payload.
 */
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: number;
  path: string;
}

export const contentService = {
  /**
   * Creates new content.
   * NOTE: If your POST endpoint also returns the ApiResponse wrapper,
   * you would apply the same unwrapping logic here.
   */
  createContent: async (content: ContentItem): Promise<ContentItem> => {
    // Assuming this returns a wrapper around a single ContentItem
    const response = await apiService.post<ApiResponse<ContentItem>>('/api/content', content);
    return response.data;
  },

  /**
   * Fetches content by its unique identifier.
   * This method retrieves a single content item based on its ID.
   * @param id
   * @return Promise<ContentItem>
   */

  getContentById: async (id: number): Promise<ContentItem> => {
    // Assuming this returns a wrapper around a single ContentItem
    const response = await apiService.get<ApiResponse<ContentItem>>(`/api/content/${id}`);
    return response.data;
  },

  /**
   * Updates an existing content item.
   */
  updateContent: async (id: number, content: ContentItem): Promise<ContentItem> => {
    const response = await apiService.put<ApiResponse<ContentItem>>(`/api/content/${id}`, content);
    return response.data;
  },

  /**
   * Deletes a content item.
   * It now correctly calls the apiService and handles the ApiResponse wrapper
   * that your backend returns on a successful delete.
   */
  deleteContent: async (id: number): Promise<void> => {
    // We call the delete method, expecting it to return our wrapper.
    // The generic type here is `string` because your JSON shows the `data` field is a string message.
    const response = await apiService.delete<ApiResponse<string>>(`/api/content/${id}`);

    // We can optionally log the success message from the backend.
    console.log(response.data); // Logs "Content deleted successfully"

    // The function still returns `void` (nothing) to the component,
    // as the component only needs to know that the operation succeeded, not the message itself.
  },

  /**
   * CORRECTED: Fetches content by a specific format (e.g., MP4, MP3).
   * It now properly unwraps the API response to return the array.
   */
  getContentByType: async (type: string): Promise<ContentItem[]> => {
    const responseWrapper = await apiService.get<ApiResponse<ContentItem[]>>(`/api/content/type/${type}`);
    // Return the nested `data` array, or an empty array if it's missing to prevent errors.
    return responseWrapper.data || [];
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
     * Fetches all content items.
     * This is a general-purpose method to retrieve all content without filtering.
     */
  getAllContent: async (): Promise<ContentItem[]> => {
    // This assumes you have an endpoint that returns all content
    const responseWrapper = await apiService.get<ApiResponse<ContentItem[]>>(`/api/content`);
    return responseWrapper.data || [];
  },

  /**
   * Fetches multiple content items by their IDs.
   * @param ids Array of content IDs to fetch
   * @returns Promise resolving to an ApiResponse containing an array of ContentItems
   */
  getContentsByIds: async (ids: number[]): Promise<ApiResponse<ContentItem[]>> => {
    // In a real implementation, this would call an API endpoint that accepts multiple IDs
    // For now, we'll mock it by fetching all content and filtering by ID
    const allContent = await contentService.getAllContent();
    const filteredContent = allContent.filter(item => ids.includes(item.id));

    // Return in the expected ApiResponse format
    return {
      success: true,
      message: 'Content items fetched successfully',
      data: filteredContent,
      timestamp: Date.now(),
      path: '/api/content/batch'
    };
  },

  /**
   * Publishes content.
   */
  publishContent: async (content: ContentItem): Promise<string> => {
    // Assuming this might return a simple string or a wrapped response. Adjust as needed.
    const response = await apiService.post<ApiResponse<string>>('/api/content/publish', content);
    return response.data;
  }
};

export default contentService;
