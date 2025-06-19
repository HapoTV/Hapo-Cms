export interface Content {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  tags: string[];
  metadata?: Record<string, any>;
  userId: string;
  createdAt: string;
}

export interface ContentUploadResponse {
  content: Content;
  url: string;
}