
export interface ScreenGroup {
    id?: string;
    name: string;
    description?: string;
    screenIds: string[];
    parentGroupId?: string;
    subGroupIds?: string[];
    metadata: Record<string, unknown>;
    defaultPlaylistId?: string;
    version?: number;
}