import React, { useState } from 'react';
import { X, Tag, Plus } from 'lucide-react';

interface ContentMetadata {
  name: string;
  type: string;
  url: string;
  tags: string[];
  size: number;
  uploadDate: Date;
  metadata: Record<string, any>;
  campaignId?: number;
  screens: string[];
}

interface ContentMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metadata: ContentMetadata) => void;
  initialData: Partial<ContentMetadata>;
  campaigns: Array<{ id: number; name: string }>;
  screens: Array<{ id: string; name: string }>;
}

const ContentMetadataModal: React.FC<ContentMetadataModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  campaigns,
  screens
}) => {
  const [formData, setFormData] = useState<ContentMetadata>({
    name: initialData.name || '',
    type: initialData.type || '',
    url: initialData.url || '',
    tags: initialData.tags || [],
    size: initialData.size || 0,
    uploadDate: initialData.uploadDate || new Date(),
    metadata: initialData.metadata || {},
    campaignId: initialData.campaignId,
    screens: initialData.screens || []
  });

  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleScreenToggle = (screenId: string) => {
    setFormData(prev => ({
      ...prev,
      screens: prev.screens.includes(screenId)
        ? prev.screens.filter(id => id !== screenId)
        : [...prev.screens, screenId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Content Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <input
                type="text"
                value={formData.type}
                className="w-full rounded-lg border-gray-300 bg-gray-50"
                disabled
              />
            </div>
          </div>

          {/* URL and Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL
              </label>
              <input
                type="text"
                value={formData.url}
                className="w-full rounded-lg border-gray-300 bg-gray-50"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <input
                type="text"
                value={`${(formData.size / 1024 / 1024).toFixed(2)} MB`}
                className="w-full rounded-lg border-gray-300 bg-gray-50"
                disabled
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add new tag"
                className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Campaign Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign
            </label>
            <select
              value={formData.campaignId || ''}
              onChange={e => setFormData(prev => ({ ...prev, campaignId: Number(e.target.value) || undefined }))}
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a campaign</option>
              {campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>

          {/* Screen Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Screens
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded-lg">
              {screens.map(screen => (
                <label
                  key={screen.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                >
                  <input
                    type="checkbox"
                    checked={formData.screens.includes(screen.id)}
                    onChange={() => handleScreenToggle(screen.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{screen.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentMetadataModal;