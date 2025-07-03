import {create} from 'zustand';
import {ContentItem} from '../../../types/models/ContentItem';
import {contentService} from '../../../services/content.service';
import {deleteFileFromS3} from '../../../services//s3';

// Helper to extract the S3 file key from a full URL
const getFileKeyFromUrl = (url: string): string | null => {
    try {
        const urlObject = new URL(url);
        // The pathname starts with a '/', so we remove it.
        // e.g., /Music/file.mp3 -> Music/file.mp3
        return urlObject.pathname.substring(1);
    } catch (error) {
        console.error("Invalid URL, cannot extract file key:", url);
        console.error(error);
        return null;
    }
};

interface ContentState {
    contentItems: ContentItem[];
    isLoading: boolean;
    error: string | null;
    fetchedCategories: Set<string>; // Keep track of what we've fetched
    fetchContentByCategory: (category: 'ALL' | 'AUDIO' | 'VIDEO' | 'IMAGE' | 'DOCUMENT' | 'WEBPAGE') => Promise<void>;
    deleteContent: (itemToDelete: ContentItem) => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
    contentItems: [],
    isLoading: false,
    error: null,
    fetchedCategories: new Set(),

    fetchContentByCategory: async (category) => {
        // If we've already fetched this category, don't do it again.
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

            // Add the newly fetched items to our central cache, avoiding duplicates.
            set(state => {
                const existingIds = new Set(state.contentItems.map(i => i.id));
                const uniqueNewItems = newItems.filter(i => !existingIds.has(i.id));

                return {
                    contentItems: [...state.contentItems, ...uniqueNewItems],
                    isLoading: false,
                    // Add the category to our set of fetched categories
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

        // --- Step 1: Delete main file from S3 ---
        const mainFileKey = getFileKeyFromUrl(itemToDelete.url);
        if (mainFileKey) {
            try {
                await deleteFileFromS3(mainFileKey);
            } catch (s3Error) {
                // If S3 deletion fails, we stop and report the error.
                // We don't want to have an orphaned S3 file.
                throw new Error(`Failed during S3 main file deletion. Aborting. Reason: ${s3Error}`);
            }
        }

        // --- Step 2: Delete album art from S3 (if it exists) ---
        const albumArtUrl = itemToDelete.metadata?.albumArtUrl;
        if (albumArtUrl) {
            const albumArtKey = getFileKeyFromUrl(albumArtUrl);
            if (albumArtKey) {
                try {
                    await deleteFileFromS3(albumArtKey);
                } catch (s3ArtError) {
                    // Log this error but continue, as deleting the main entry is more critical.
                    console.warn(`Could not delete album art from S3, but proceeding to delete DB record. Reason: ${s3ArtError}`);
                }
            }
        }

        // --- Step 3: Delete the content record from the database ---
        try {
            await contentService.deleteContent(itemToDelete.id);

            // --- Step 4: Update the local state to reflect the deletion in the UI ---
            set((state) => ({
                contentItems: state.contentItems.filter((item) => item.id !== itemToDelete.id),
            }));
            console.log(`Successfully deleted "${itemToDelete.name}" from DB and updated UI.`);
            // Optionally, show a success toast here.
        } catch (dbError) {
            throw new Error(`S3 file was deleted, but failed to delete database record. Please check manually. Reason: ${dbError}`);
        }
    },
}));