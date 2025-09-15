// ContentItem.ts
export interface ContentItem {
    id?: number;
    name: string;
    type: string;
    url: string;
    tags?: Record<string, string>;
    duration?: number;
    metadata: Record<string, unknown>;
    uploadDate?: string;
    campaignId?: number;
    screenIds?: number[];
    thumbnailUrl?: string;
}

export interface ContentRequest {
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
    campaignId?: number;
    screenIds?: number[];
}