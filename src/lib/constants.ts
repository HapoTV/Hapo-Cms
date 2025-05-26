export const ALLOWED_CONTENT_TYPES = [
  // Video formats
  'video/mp4',
  'video/x-msvideo', // AVI
  'video/x-matroska', // MKV
  'video/quicktime', // MOV
  'video/x-flv', // FLV
  'video/x-ms-wmv', // WMV
  'video/webm',

  // Audio formats
  'audio/mpeg', // MP3
  'audio/wav',
  'audio/aac',
  'audio/flac',
  'audio/ogg',
  'audio/x-ms-wma', // WMA
  'audio/mp4', // M4A

  // Image formats
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/tiff',
  'image/svg+xml',

  // Presentation formats
  'application/vnd.ms-powerpoint', // PPT
  'application/vnd.openxmlformats-officedocument.presentationml.presentation' // PPTX
] as const;

export const FILE_TYPE_CATEGORIES = {
  video: ['mp4', 'avi', 'mkv', 'mov', 'flv', 'wmv', 'webm'],
  audio: ['mp3', 'wav', 'aac', 'flac', 'ogg', 'wma', 'm4a'],
  image: ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'tiff', 'svg'],
  presentation: ['ppt', 'pptx']
} as const;