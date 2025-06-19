export interface TrafficData {
    hour: string;
    visitors: number;
}

export interface DwellTimeData {
    day: string;
    time: number;
}

export interface CampaignMetrics {
    campaignId: string;
    views: number;
    engagement: number;
    completionRate: number;
}