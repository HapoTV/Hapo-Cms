import type { Campaign } from '../lib/database.types';

export const campaignService = {
  async getCampaigns(filters?: {
    status?: Campaign['status'];
    location?: string;
    startDate?: string;
    endDate?: string;
  }) {
    let query = supabase
      .from('campaigns')
      .select('*');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.location) {
      query = query.contains('locations', [filters.location]);
    }

    if (filters?.startDate) {
      query = query.gte('start_date', filters.startDate);
    }

    if (filters?.endDate) {
      query = query.lte('end_date', filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getCampaign(id: string) {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createCampaign(campaign: Omit<Campaign, 'id'>) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaign])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCampaign(id: string, updates: Partial<Campaign>) {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCampaign(id: string) {
    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async scheduleCampaign(id: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('campaigns')
      .update({
        status: 'scheduled',
        start_date: startDate,
        end_date: endDate
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async pauseCampaign(id: string) {
    const { data, error } = await supabase
      .from('campaigns')
      .update({ status: 'paused' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async resumeCampaign(id: string) {
    const { data, error } = await supabase
      .from('campaigns')
      .update({ status: 'active' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};