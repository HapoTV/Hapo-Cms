// src/features/campaigns/components/CampaignEdit.tsx

import {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {ChevronLeft} from 'lucide-react';
// Mock data type for the form
import {CampaignForm, CampaignFormData} from './CampaignForm';
// CHANGED: Imported Button, useTheme, and LoadingSpinner
import {useTheme} from '../../../contexts/ThemeContext';
import {Button, LoadingSpinner} from '../../../components/ui';

export const CampaignEdit = () => {
  const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const {currentTheme} = useTheme();

    // State for holding existing campaign data and loading status
    const [campaignData, setCampaignData] = useState<CampaignFormData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // In a real application, you would fetch the campaign data here
    useEffect(() => {
        const fetchCampaign = async () => {
            console.log(`Fetching data for campaign ID: ${id}`);
            setIsLoading(true);
            try {
                // --- Replace with your actual API call ---
                // const data = await campaignsService.getById(id);
                // For demonstration, we'll use mock data
                const mockData: CampaignFormData = {
                    name: `Summer Sale ${id}`,
                    description: 'Annual summer promotional event.',
                    startDate: '2024-06-01',
                    endDate: '2024-08-31',
                    locations: ['store-a', 'store-c'],
                };
                setCampaignData(mockData);
                // -----------------------------------------
            } catch (error) {
                console.error("Failed to fetch campaign data", error);
                // Handle error (e.g., show a toast notification, redirect)
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchCampaign();
        }
    }, [id]);

  return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
          <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              leftIcon={<ChevronLeft className="w-5 h-5"/>}
              className="mb-6"
      >
        Back to Campaigns
          </Button>

          <h1
              className="text-3xl font-bold mb-8"
              style={{color: currentTheme.colors.text.primary}}
          >
              Edit Campaign
          </h1>

          {isLoading ? (
              <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg"/>
              </div>
          ) : campaignData ? (
      <CampaignForm
        campaignId={id}
          // Pass the fetched data to pre-fill the form
        defaultValues={campaignData}
        onSubmit={async (data) => {
            console.log('Updated campaign data:', data);
          navigate('..');
        }}
      />
          ) : (
              <p style={{color: currentTheme.colors.text.secondary}}>
                  Campaign not found.
              </p>
          )}
    </div>
  );
};