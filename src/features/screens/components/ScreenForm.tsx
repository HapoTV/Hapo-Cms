import React, {useEffect, useState} from 'react';
import {Plus, Save, X} from 'lucide-react';
import type {Location, Screen} from '../../../types/models/screen.types';
import {LocationSearchInput} from './LocationSearchInput'; // We'll use our reusable component

interface ScreenFormProps {
  initialData: Screen;
  onSubmit: (data: Partial<Screen>) => void;
  onCancel: () => void;
}

export const ScreenForm: React.FC<ScreenFormProps> = ({initialData, onSubmit, onCancel}) => {
  // Use a more flexible state for metadata to allow key editing
  const [metadata, setMetadata] = useState<{ key: string, value: string | number }[]>([]);
  const [formData, setFormData] = useState<Partial<Screen>>(initialData);

  useEffect(() => {
    // When initial data is loaded, populate the form state
    setFormData(initialData);
    // Convert the metadata object into an array of key-value pairs for the form
    if (initialData.metadata) {
      setMetadata(Object.entries(initialData.metadata).map(([key, value]) => ({key, value})));
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, checked} = e.target;
    const [parent, child] = name.split('.'); // e.g., 'screenSettingsDTO.loop'
    setFormData(prev => ({...prev, [parent]: {...(prev[parent as keyof typeof prev] as object), [child]: checked}}));
  };

  const handleLocationSelect = (location: Location) => {
    setFormData(prev => ({...prev, location}));
  };

  // --- Dynamic Metadata Handlers ---
  const handleMetadataKeyChange = (index: number, newKey: string) => {
    const newMetadata = [...metadata];
    newMetadata[index].key = newKey;
    setMetadata(newMetadata);
  };

  const handleMetadataValueChange = (index: number, newValue: string | number) => {
    const newMetadata = [...metadata];
    newMetadata[index].value = newValue;
    setMetadata(newMetadata);
  };

  const addMetadataField = () => {
    setMetadata([...metadata, {key: '', value: ''}]);
  };

  const removeMetadataField = (index: number) => {
    setMetadata(metadata.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert the metadata array back into an object for submission
    const metadataObject = metadata.reduce((obj, item) => {
      if (item.key) obj[item.key] = item.value;
      return obj;
    }, {} as Record<string, any>);

    onSubmit({...formData, metadata: metadataObject});
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Screen Name</label>
              <input type="text" value={formData.name || ''} onChange={(e) => handleInputChange(e)} name="name" required
                     className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select value={formData.type || 'WINDOWS'} onChange={(e) => handleInputChange(e)} name="type"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="WINDOWS">Windows</option>
                <option value="ANDROID">Android</option>
                <option value="LINUX">Linux</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location with Google Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search for Address</label>
          <LocationSearchInput initialValue={formData.location?.name || ''} onPlaceSelect={handleLocationSelect}/>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
              <input type="number" readOnly value={formData.location?.latitude || ''}
                     className="w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
              <input type="number" readOnly value={formData.location?.longitude || ''}
                     className="w-full px-3 py-2 border bg-gray-100 border-gray-300 rounded-md"/>
            </div>
          </div>
        </div>

        {/* Dynamic Metadata Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Hardware & Metadata</h2>
            <button type="button" onClick={addMetadataField}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">
              <Plus className="w-4 h-4"/> Add Field
            </button>
          </div>
          <div className="space-y-4">
            {metadata.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <label className="block text-xs font-medium text-gray-600">Field Name</label>
                    <input type="text" placeholder="e.g., Resolution" value={item.key}
                           onChange={(e) => handleMetadataKeyChange(index, e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                  </div>
                  <div className="col-span-6">
                    <label className="block text-xs font-medium text-gray-600">Value</label>
                    <input type="text" placeholder="e.g., 1920x1080" value={item.value}
                           onChange={(e) => handleMetadataValueChange(index, e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
                  </div>
                  <div className="col-span-1">
                    <button type="button" onClick={() => removeMetadataField(index)}
                            className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-md" title="Remove Field">
                      <X className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
            ))}
            {metadata.length === 0 && <p className="text-gray-500 text-center py-4">No metadata added.</p>}
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Playback Settings</h2>
          <div className="space-y-4">
            <div className="relative flex items-start">
              <div className="flex h-6 items-center"><input id="loop" name="screenSettingsDTO.loop" type="checkbox"
                                                            checked={formData.screenSettingsDTO?.loop || false}
                                                            onChange={handleCheckboxChange}
                                                            className="h-4 w-4 rounded border-gray-300"/></div>
              <div className="ml-3 text-sm leading-6"><label htmlFor="loop" className="font-medium text-gray-900">Loop
                Content</label></div>
            </div>
            <div className="relative flex items-start">
              <div className="flex h-6 items-center"><input id="cacheMedia" name="screenSettingsDTO.cacheMedia"
                                                            type="checkbox"
                                                            checked={formData.screenSettingsDTO?.cacheMedia || false}
                                                            onChange={handleCheckboxChange}
                                                            className="h-4 w-4 rounded border-gray-300"/></div>
              <div className="ml-3 text-sm leading-6"><label htmlFor="cacheMedia" className="font-medium text-gray-900">Cache
                Media</label></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onCancel}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel
          </button>
          <button type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <Save className="w-4 h-4"/>Save Changes
          </button>
        </div>
      </form>
  );
};