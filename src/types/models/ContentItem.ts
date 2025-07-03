export interface ContentItem {
    id?: number; // Make id optional for creating new content
    name: string;
    type: string;
    url: string;
    tags?: Record<string, string>; // Changed from string[] to object structure
    duration?: number;
    metadata: Record<string, unknown>;
    uploadDate?: string;
    campaignId?: number;
    screenIds?: number[]; // Add missing field
}

export interface ContentUploadResponse {
    content: ContentItem;
    url: string;
}
