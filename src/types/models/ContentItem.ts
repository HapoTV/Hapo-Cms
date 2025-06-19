export interface ContentItem {
    id: number;
    name: string;
    type: string;
    url: string;
    // CORRECTED: 'tags' is an object with string keys and string values.
    tags?:string[];
    duration?: number;
    uploadDate?: string; // Best set by backend to ensure accuracy
}

// NOTE: Your previous ContentItem type had a separate `metadata` field.
// Based on the new JSON, it seems the `tags` object serves this purpose.
// If you have other metadata, you can keep the `metadata` field, but for now,
// we will focus on matching the provided JSON.