
export interface ScreenGroup {
    id?: number;
    name: string;
    description?: string;
    screenIds: number[];
    parentGroupId?: number;
    subGroupIds?: number[];
    metadata?: any;
    defaultPlaylistId?: number;
    version?: number;
}