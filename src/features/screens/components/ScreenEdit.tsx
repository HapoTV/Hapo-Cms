import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ScreenForm } from './ScreenForm';

export const ScreenEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={() => navigate('..')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Screens
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Screen</h1>

      <ScreenForm
        screenId={id}
        onSubmit={async (data) => {
          // Handle form submission
          navigate('..');
        }}
      />
    </div>
  );
};