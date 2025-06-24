
export interface ScreenGroup {
    id?: number;
    name: string;
    description?: string;
    screenIds: number[];
    parentGroupId?: number;
    subGroupIds?: number[];
    metadata: Record<string, unknown>;
    defaultPlaylistId?: number;
    version?: number;
}