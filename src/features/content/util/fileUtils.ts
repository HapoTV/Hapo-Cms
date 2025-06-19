/**
 * @file Contains file-related utility functions.
 * @path src/features/content/util/fileUtils.ts
 */

// This object maps the browser's MIME type to the simplified
// file type string that our backend wants to store.
const MIME_TYPE_TO_BACKEND_TYPE: Record<string, string> = {
    // Video
    'video/mp4': 'MP4',
    'video/webm': 'WEBM',
    // Audio
    'audio/mpeg': 'MP3',
    'audio/wav': 'WAV',
    'audio/aac': 'AAC',
    'audio/mp4': 'M4A',
    // Image
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    // Add other mappings from your constants file as needed
    'video/x-msvideo': 'AVI',
    'video/quicktime': 'MOV',
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
};

/**
 * Converts a file's MIME type to the simplified format required by the backend.
 * @param mimeType The full MIME type (e.g., 'image/jpeg').
 * @returns The backend-friendly type (e.g., 'JPEG') or null if not mapped.
 */
export const getBackendFileType = (mimeType: string): string | null => {
    return MIME_TYPE_TO_BACKEND_TYPE[mimeType] || null;
};