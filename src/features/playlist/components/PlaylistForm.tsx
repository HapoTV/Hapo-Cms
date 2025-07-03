import React, {useState} from 'react';

// This simple mock of react-hook-form can live with the component that uses it.
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

// This is now the ONLY component in this file.
export const PlaylistForm = ({ onSubmit, initialData }) => {
  const {register, handleSubmit} = useForm({
    defaultValues: {
      name: initialData?.name || '',
    }
  });

  return (
      // We add a ref here so the parent can submit this form.
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Playlist Name</label>
          <input
              type="text"
              {...register('name')}
              required
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1"
              placeholder="e.g., Morning Cafe Ambience"
          />
        </div>
        <button type="submit" className="hidden">Submit</button>
      </form>
  );
};