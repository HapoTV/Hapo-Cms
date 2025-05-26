import apiService from './api.service';

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

export const analyticsService = {
  getTrafficData: async (params: {
    startDate: string;
    endDate: string;
    location?: string;
    interval?: 'hour' | 'day' | 'week' | 'month';
  }): Promise<TrafficData[]> => {
    let url = `/analytics/traffic?startDate=${params.startDate}&endDate=${params.endDate}`;
    
    if (params.location) url += `&location=${encodeURIComponent(params.location)}`;
    if (params.interval) url += `&interval=${params.interval}`;
    
    return apiService.get<TrafficData[]>(url);
  },
  
  getDwellTimeData: async (params: {
    startDate: string;
    endDate: string;
    location?: string;
    interval?: 'hour' | 'day' | 'week' | 'month';
  }): Promise<DwellTimeData[]> => {
    let url = `/analytics/dwell-time?startDate=${params.startDate}&endDate=${params.endDate}`;
    
    if (params.location) url += `&location=${encodeURIComponent(params.location)}`;
    if (params.interval) url += `&interval=${params.interval}`;
    
    return apiService.get<DwellTimeData[]>(url);
  },
  
  getCampaignMetrics: async (campaignId: string): Promise<CampaignMetrics> => {
    return apiService.get<CampaignMetrics>(`/analytics/campaigns/${campaignId}`);
  },
  
  // Alternative implementation using Supabase directly
  getTrafficDataFromSupabase: async (params: {
    startDate: string;
    endDate: string;
    location?: string;
    interval?: 'hour' | 'day' | 'week' | 'month';
  }): Promise<TrafficData[]> => {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'view')
      .gte('timestamp', params.startDate)
      .lte('timestamp', params.endDate);

    if (params.location) {
      query = query.eq('location', params.location);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Process data based on interval
    // This is a simplified example - in a real app, you'd aggregate by the requested interval
    const hourlyData: Record<string, number> = {};
    
    data.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      const hourKey = `${hour}:00`;
      
      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = 0;
      }
      
      hourlyData[hourKey]++;
    });
    
    return Object.entries(hourlyData).map(([hour, visitors]) => ({
      hour,
      visitors
    }));
  },
  
  getDwellTimeDataFromSupabase: async (params: {
    startDate: string;
    endDate: string;
    location?: string;
    interval?: 'hour' | 'day' | 'week' | 'month';
  }): Promise<DwellTimeData[]> => {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'engagement')
      .gte('timestamp', params.startDate)
      .lte('timestamp', params.endDate);

    if (params.location) {
      query = query.eq('location', params.location);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Process data based on interval
    // This is a simplified example - in a real app, you'd aggregate by the requested interval
    const dailyData: Record<string, number[]> = {};
    
    data.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      
      dailyData[date].push(event.duration || 0);
    });
    
    return Object.entries(dailyData).map(([day, durations]) => {
      const averageTime = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
      
      return {
        day,
        time: Math.round(averageTime)
      };
    });
  },
  
  getCampaignMetricsFromSupabase: async (campaignId: string): Promise<CampaignMetrics> => {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('campaign_id', campaignId);

    if (error) throw error;

    const views = data.filter(event => event.event_type === 'view').length;
    const engagements = data.filter(event => event.event_type === 'engagement').length;

    return {
      campaignId,
      views,
      engagement: engagements,
      completionRate: views > 0 ? (engagements / views) * 100 : 0
    };
  },
  
  trackView: async (params: {
    campaignId: string;
    contentId: string;
    location: string;
  }): Promise<void> => {
    return apiService.post<void>('/analytics/track/view', params);
  },
  
  trackEngagement: async (params: {
    campaignId: string;
    contentId: string;
    location: string;
    duration: number;
  }): Promise<void> => {
    return apiService.post<void>('/analytics/track/engagement', params);
  },
  
  // Alternative implementation using Supabase directly
  trackViewWithSupabase: async (params: {
    campaignId: string;
    contentId: string;
    location: string;
  }): Promise<void> => {
    const { error } = await supabase
      .from('analytics_events')
      .insert([{
        event_type: 'view',
        campaign_id: params.campaignId,
        content_id: params.contentId,
        location: params.location,
        timestamp: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) throw error;
  },
  
  trackEngagementWithSupabase: async (params: {
    campaignId: string;
    contentId: string;
    location: string;
    duration: number;
  }): Promise<void> => {
    const { error } = await supabase
      .from('analytics_events')
      .insert([{
        event_type: 'engagement',
        campaign_id: params.campaignId,
        content_id: params.contentId,
        location: params.location,
        duration: params.duration,
        timestamp: new Date().toISOString(),
        user_id: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) throw error;
  }
};

export default analyticsService;