// src/features/campaigns/components/CampaignForm.tsx

import React from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {ChevronRight} from 'lucide-react';
import {Button, Card, Input} from '../../../components/ui';

// Define the shape of our form data for type safety
interface CampaignFormData {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    locations: string[];
}

interface CampaignFormProps {
  campaignId?: string;
    onSubmit: SubmitHandler<CampaignFormData>;
    // Add an optional prop to pass default values for editing
    defaultValues?: Partial<CampaignFormData>;
    isLoading?: boolean;
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
                                                              campaignId,
                                                              onSubmit,
                                                              defaultValues,
                                                              isLoading = false
                                                          }) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<CampaignFormData>({
        defaultValues: defaultValues,
    });

  return (
      <Card elevated padding="lg">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
            label="Campaign Name"
            id="name"
            // Spread the register props here
          {...register('name', { required: 'Name is required' })}
            // Pass the error message to the component's error prop
            error={errors.name?.message}
            required
        />

        <Input
            label="Description"
            id="description"
            // Use the 'as' prop to render a textarea
            as="textarea"
            rows={4}
          {...register('description')}
            error={errors.description?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
                label="Start Date"
                id="startDate"
            type="date"
            {...register('startDate', { required: 'Start date is required' })}
                error={errors.startDate?.message}
                required
          />

            <Input
                label="End Date"
                id="endDate"
            type="date"
            {...register('endDate', { required: 'End date is required' })}
                error={errors.endDate?.message}
                required
          />
      </div>

        <Input
            label="Locations"
            id="locations"
            // Use the 'as' prop to render a select element
            as="select"
          multiple
          {...register('locations', { required: 'At least one location is required' })}
            error={errors.locations?.message}
            required
        >
            {/* Options are passed as children */}
          <option value="store-a">Store A</option>
          <option value="store-b">Store B</option>
          <option value="store-c">Store C</option>
        </Input>

        <div className="flex justify-end pt-4">
            <Button
          type="submit"
          rightIcon={<ChevronRight className="w-5 h-5"/>}
          loading={isLoading}
        >
          {campaignId ? 'Save Changes' : 'Create Campaign'}
            </Button>
      </div>
    </form>
      </Card>
  );
};