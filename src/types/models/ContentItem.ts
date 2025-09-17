// ContentItem.ts
export interface ContentItem {
    id?: string;
    name: string;
    type: string;
    url: string;
    tags?: Record<string, string>;
    duration?: number;
    metadata: Record<string, unknown>;
    uploadDate?: string;
    campaignId?: string;
    screenIds?: string[];
    thumbnailUrl?: string;
}

export interface ContentRequest {
    url: string; // The URL from Supabase is now a required field.
    name: string;
    type: string;
    tags?: Record<string, string>;
    duration?: number;
    metadata?: Record<string, unknown>;
    campaignId?: number;
    screenIds?: number[];
}

export interface ContentResponse {
    name: string;
    type: string;
    url: string;
    tags?: Record<string, string>;
    duration?: number;
    metadata?: Record<string, unknown>;
    uploadDate?: string;
    campaignId?: string;
    screenIds?: string[];
}