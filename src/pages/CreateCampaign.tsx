import React, { useReducer, useState } from 'react';
import { ChevronRight, ChevronLeft, Check, X, MapPin, Image } from 'lucide-react';

// Reusable Text Input Component
const TextInput = ({ label, value, onChange, error }: any) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
          type="text"
          value={value}
          onChange={onChange}
          className={`mt-1 block w-full rounded-md shadow-sm ${
              error ? 'border-red-300' : 'border-gray-300'
          } focus:border-blue-500 focus:ring-blue-500`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
);

// Centralized form state with a reducer
const initialState = {
  formData: {
    name: '',
    description: '',
    tags: [],
    selectedContent: [],
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '18:00',
    recurrence: 'none',
    locations: [],
  },
  errors: {},
};

function formReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    default:
      return state;
  }
}

export default function CreateCampaign() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [currentStep, setCurrentStep] = useState(1);

  const { formData, errors } = state;

  const handleNext = () => {
    // Add validation logic here
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleFieldChange = (field: string, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  return (
      <div className="max-w-4xl mx-auto p-8">
        <form>
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
              <div className="space-y-6">
                <TextInput
                    label="Campaign Name"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    error={errors?.name}
                />
              </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <button
                type="button"
                onClick={handlePrevious}
                className={`px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 flex items-center gap-2 ${
                    currentStep === 1 ? 'invisible' : ''
                }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              {currentStep === 4 ? 'Create Campaign' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
  );
}
