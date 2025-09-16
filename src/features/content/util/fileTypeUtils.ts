// src/features/content/util/fileTypeUtils.ts

import {FILE_TYPE_DEFINITIONS} from '../types/fileTypeDefinitions';

/**
 * An array of MIME types allowed for upload.
 * Used by the `<input accept="...">` attribute.
 */
export const ALLOWED_CONTENT_TYPES: string[] = FILE_TYPE_DEFINITIONS.map(def => def.mime);


const MIME_TYPE_TO_BACKEND_TYPE_MAP: Record<string, string> =
    FILE_TYPE_DEFINITIONS.reduce((acc, current) => {
        acc[current.mime] = current.backendType;
        return acc;
    }, {} as Record<string, string>);

/**
 * Converts a browser's MIME type (e.g., 'image/jpeg') to the simplified
 * string format required by the backend (e.g., 'JPEG').
 * @param mimeType The full MIME type of the file.
 * @returns The backend-friendly type string, or null if not found.
 */
export const getBackendFileType = (mimeType: string): string | null => {
    return MIME_TYPE_TO_BACKEND_TYPE_MAP[mimeType] || null;
};


const CATEGORY_TO_BACKEND_TYPES_MAP: Record<string, string[]> =
    FILE_TYPE_DEFINITIONS.reduce((acc, current) => {
        if (!acc[current.category]) {
            acc[current.category] = [];
        }
        acc[current.category].push(current.backendType);
        return acc;
    }, {} as Record<string, string[]>);

/**
 * Checks if a content item's type belongs to a given broad category.
 * Used for filtering content in the UI tabs.
 * @param itemType The backend type of the content item (e.g., 'MP3').
 * @param category The broad category to check against (e.g., 'AUDIO').
 * @returns True if the item belongs to the category.
 */
export const isItemInCategory = (itemType: string, category: string): boolean => {
    if (category === 'ALL') return true;

    const typesInCategory = CATEGORY_TO_BACKEND_TYPES_MAP[category.toUpperCase()];
    if (!typesInCategory) return false;

    return typesInCategory.includes(itemType.toUpperCase());
};

// --- NEWLY ADDED PART ---
const MIME_TO_CATEGORY_MAP: Record<string, string> =
    FILE_TYPE_DEFINITIONS.reduce((acc, current) => {
        acc[current.mime] = current.category;
        return acc;
    }, {} as Record<string, string>);

/**
 * Gets the broad category (e.g., 'AUDIO') from a file's MIME type.
 * Used for determining the S3 prefix folder.
 * @param mimeType The full MIME type of the file.
 * @returns The category string (e.g., 'VIDEO') or null if not found.
 */
export const getCategoryFromMime = (mimeType: string): string | null => {
    return MIME_TO_CATEGORY_MAP[mimeType] || null;
}

// --- NEWLY ADDED AND REQUIRED FUNCTION ---

const BACKEND_TYPE_TO_CATEGORY_MAP: Record<string, string> =
    FILE_TYPE_DEFINITIONS.reduce((acc, current) => {
        // Use toUpperCase() to make the lookup case-insensitive
        acc[current.backendType.toUpperCase()] = current.category;
        return acc;
    }, {} as Record<string, string>);

/**
 * Gets the broad category (e.g., 'IMAGE') from a specific backend type (e.g., 'JPEG').
 * This is REQUIRED by the ContentDetailsModal to show the correct icon and preview.
 * @param backendType The specific type string from the database.
 * @returns The category string (e.g., 'VIDEO') or null if not found.
 */
export const getTypeCategory = (backendType: string): string | null => {
    return BACKEND_TYPE_TO_CATEGORY_MAP[backendType.toUpperCase()] || null;
}