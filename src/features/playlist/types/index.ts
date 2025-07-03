export interface Playlist {
  id: string;
  name: string;
  playlistData: {
    startTime: string;
    endTime: string;
    repeat: boolean;
    duration?: string;
    metadata: {
      priority: 'low' | 'normal' | 'high' | 'emergency';
      createdBy: string;
    };
  };
  screenIds: number[];
  contentIds: number[];
}