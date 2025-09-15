import {create} from 'zustand';
import {ContentItem} from '../../../types/models/ContentItem';
import {contentService} from '../../../services/content.service';

interface ContentState {
    contentItems: ContentItem[];
    isLoading: boolean;
    error: string | null;
    fetchedCategories: Set<string>;
    currentContentDetails: ContentItem | null;
    fetchContentByCategory: (category: 'ALL' | 'AUDIO' | 'VIDEO' | 'IMAGE' | 'DOCUMENT' | 'WEBPAGE') => Promise<void>;
    deleteContent: (itemToDelete: ContentItem) => Promise<void>;
    updateContent: (id: number, updatedContent: ContentItem) => Promise<ContentItem>;

    // New methods
    duplicateContent: (itemToDuplicate: ContentItem) => Promise<ContentItem>;
    getContentDetails: (id: number) => Promise<ContentItem>;
    clearContentDetails: () => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
    contentItems: [],
    isLoading: false,
    error: null,
    fetchedCategories: new Set(),
    currentContentDetails: null,  // Initialize as null

    fetchContentByCategory: async (category) => {
        if (get().fetchedCategories.has(category)) {
            return;
        }

        set({isLoading: true, error: null});

        try {
            let newItems: ContentItem[] = [];
            if (category === 'ALL') {
                newItems = await contentService.getAllContent();
            } else {
                newItems = await contentService.getContentByCategory(category);
            }

            set(state => {
                const existingIds = new Set(state.contentItems.map(i => i.id));
                const uniqueNewItems = newItems.filter(i => !existingIds.has(i.id));

                return {
                    contentItems: [...state.contentItems, ...uniqueNewItems],
                    isLoading: false,
                    fetchedCategories: new Set(state.fetchedCategories).add(category),
                };
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : `Failed to fetch ${category} content`;
            set({error: errorMessage, isLoading: false});
        }
    },

    deleteContent: async (itemToDelete: ContentItem) => {
        console.log(`Starting deletion process for "${itemToDelete.name}" (ID: ${itemToDelete.id})`);

        set({isLoading: true, error: null});

        try {
            if (typeof itemToDelete.id !== 'number') {
                throw new Error('Cannot delete content: Invalid ID');
            }

            // Use contentService for deletion (handles both DB and storage)
            await contentService.deleteContent(itemToDelete.id);

            // Update local state
            set((state) => ({
                contentItems: state.contentItems.filter((item) => item.id !== itemToDelete.id),
                isLoading: false
            }));

            console.log(`Successfully deleted "${itemToDelete.name}"`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete content';
            set({error: errorMessage, isLoading: false});
            throw error;
        }
    },

    updateContent: async (id: number, updatedContent: ContentItem) => {
        console.log(`Updating content ID: ${id}`);

        set({isLoading: true, error: null});

        try {
            // Use contentService for update
            const updatedItem = await contentService.updateContent(id, updatedContent);

            // Update local state
            set((state) => ({
                contentItems: state.contentItems.map(item => 
                    item.id === id ? updatedItem : item
                ),
                isLoading: false
            }));

            console.log(`Successfully updated content ID: ${id}`);
            return updatedItem;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update content';
            set({error: errorMessage, isLoading: false});
            throw error;
        }
    },

    // New method: Duplicate content
    duplicateContent: async (itemToDuplicate: ContentItem): Promise<ContentItem> => {
  console.log(`Duplicating content: "${itemToDuplicate.name}" (ID: ${itemToDuplicate.id})`);

  set({ isLoading: true, error: null });

  try {
    if (typeof itemToDuplicate.id !== 'number') {
      throw new Error('Cannot duplicate content: Invalid ID');
    }

    // Create a duplicate object on the client side
    const duplicateItem: ContentItem = {
      ...itemToDuplicate,
      id: undefined, // Remove ID so backend creates new record
      name: `${itemToDuplicate.name} (Copy)`,
      uploadDate: new Date().toISOString(),
      // You might want to modify other fields for the duplicate
    };

    // Use the create endpoint instead of duplicate
    const createdItem = await contentService.createContent(duplicateItem);

    // Update local state
    set(state => ({
      contentItems: [...state.contentItems, createdItem],
      isLoading: false
    }));

    console.log(`Successfully duplicated "${itemToDuplicate.name}" as ID: ${createdItem.id}`);
    return createdItem;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to duplicate content';
    set({ error: errorMessage, isLoading: false });
    throw error;
  }
},

    // New method: Get detailed content information
    getContentDetails: async (id) => {
        console.log(`Fetching details for content ID: ${id}`);
        set({ isLoading: true, error: null });

        try {
            // Check if we already have full details
            const existingItem = get().contentItems.find(item => item.id === id);
            if (existingItem && existingItem.metadata && existingItem.tags) {
                set({ currentContentDetails: existingItem, isLoading: false });
                return existingItem; // Return the item
            }

            // Fetch from API
            const detailedItem = await contentService.getContentById(id);

            set(state => ({
                contentItems: state.contentItems.map(item => 
                    item.id === id ? { ...item, ...detailedItem } : item
                ),
                currentContentDetails: detailedItem,
                isLoading: false
            }));

            return detailedItem; // Return the item

        } catch (error) {
            console.error('Error in getContentDetails:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to get content details';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    // Clear the current content details
    clearContentDetails: () => {
        set({ currentContentDetails: null });
    }
}));