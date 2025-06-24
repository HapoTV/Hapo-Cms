export interface ContentItem {
    id: number;
    name: string;
    type: string;
    url: string;
    tags?:string[];
    duration?: number;
    uploadDate?: string;
}

export interface Content {
    id: string;
    name: string;
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    tags: string[];
    metadata: Record<string, unknown>;
    userId: string;
    createdAt: string;
}

export interface ContentUploadResponse {
    content: Content;
    url: string;
}