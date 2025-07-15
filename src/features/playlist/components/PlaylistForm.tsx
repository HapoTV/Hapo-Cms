import React, {forwardRef, useState} from 'react';

// Simple mock of react-hook-form for this component
const useForm = (config) => {
  const [formData, setFormData] = useState(config.defaultValues || {});

  const register = (name) => ({
    name,
    value: formData[name] || '',
    onChange: (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setFormData(prev => ({...prev, [name]: value}));
    }
  });

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return {register, handleSubmit};
};

// Playlist form component with consistent styling
export const PlaylistForm = forwardRef(({onSubmit, initialData}, ref) => {
  const {register, handleSubmit} = useForm({
    defaultValues: {
      name: initialData?.name || '',
        description: initialData?.description || '',
    }
  });

  return (
      // We add a ref here so the parent can submit this form.
      <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Playlist Name <span className="text-red-500">*</span>
            </label>
          <input
              type="text"
              {...register('name')}
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              placeholder="e.g., Morning Cafe Ambience"
          />
        </div>

          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
              </label>
              <textarea
                  {...register('description')}
                  rows={3}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                  placeholder="Optional description for this playlist..."
              />
          </div>

        <button type="submit" className="hidden">Submit</button>
      </form>
  );
});