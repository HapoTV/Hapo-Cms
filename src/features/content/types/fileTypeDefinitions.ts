// This file is the single source of truth for all supported file types.
// To add a new file type, you only need to add it here.

export interface FileTypeDefinition {
    mime: string;       // The browser's MIME type
    backendType: string; // The type string for your database (e.g., 'MP4')
    category: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT' | 'WEBPAGE';
}

export const FILE_TYPE_DEFINITIONS: FileTypeDefinition[] = [
    // Videos
    {mime: 'video/mp4', backendType: 'MP4', category: 'VIDEO'},
    {mime: 'video/x-msvideo', backendType: 'AVI', category: 'VIDEO'},
    {mime: 'video/x-matroska', backendType: 'MKV', category: 'VIDEO'},
    {mime: 'video/quicktime', backendType: 'MOV', category: 'VIDEO'},
    {mime: 'video/x-flv', backendType: 'FLV', category: 'VIDEO'},
    {mime: 'video/x-ms-wmv', backendType: 'WMV', category: 'VIDEO'},
    {mime: 'video/webm', backendType: 'WEBM', category: 'VIDEO'},

    // Audios
    {mime: 'audio/mpeg', backendType: 'MP3', category: 'AUDIO'},
    {mime: 'audio/wav', backendType: 'WAV', category: 'AUDIO'},
    {mime: 'audio/aac', backendType: 'AAC', category: 'AUDIO'},
    {mime: 'audio/flac', backendType: 'FLAC', category: 'AUDIO'},
    {mime: 'audio/ogg', backendType: 'OGG', category: 'AUDIO'},
    {mime: 'audio/x-ms-wma', backendType: 'WMA', category: 'AUDIO'},
    {mime: 'audio/mp4', backendType: 'M4A', category: 'AUDIO'},

    // Images
    {mime: 'image/jpeg', backendType: 'JPEG', category: 'IMAGE'},
    {mime: 'image/jpg', backendType: 'JPG', category: 'IMAGE'},
    {mime: 'image/png', backendType: 'PNG', category: 'IMAGE'},
    {mime: 'image/gif', backendType: 'GIF', category: 'IMAGE'},
    {mime: 'image/bmp', backendType: 'BMP', category: 'IMAGE'},
    {mime: 'image/tiff', backendType: 'TIFF', category: 'IMAGE'},
    {mime: 'image/svg+xml', backendType: 'SVG', category: 'IMAGE'},

    // Documents
    {mime: 'application/pdf', backendType: 'PDF', category: 'DOCUMENT'},
    {mime: 'application/msword', backendType: 'DOC', category: 'DOCUMENT'},
    {
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        backendType: 'DOCX',
        category: 'DOCUMENT'
    },
    {mime: 'application/vnd.ms-powerpoint', backendType: 'PPT', category: 'DOCUMENT'},
    {
        mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        backendType: 'PPTX',
        category: 'DOCUMENT'
    },
];