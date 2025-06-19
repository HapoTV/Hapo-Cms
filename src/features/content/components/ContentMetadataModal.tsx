// This file is part of the Media Management System project.
// src/features/content/components/ContentMetadataModal.tsx
import  { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { UploadingFile } from '../store/upload.store';

// This is the data structure the modal will pass back to the parent component.
interface MetadataFormData {
  title: string;
  duration?: number;
  tags: Record<string, string>;
  campaignId?: number; // Kept for future use if needed
}

interface ContentMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MetadataFormData) => void;
  file: UploadingFile | null;
}

// This is a helper type for managing the dynamic list of tags in the UI.
type TagItem = {
  id: string;
  key: string;
  value: string;
};

export const ContentMetadataModal = ({ isOpen, onClose, onSave, file }: ContentMetadataModalProps) => {
  // --- Local State for the Form ---
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [tagList, setTagList] = useState<TagItem[]>([]);

  // --- Effect to pre-populate and reset the form ---
  useEffect(() => {
    if (isOpen && file) {
      // Pre-populate title from the filename for better UX, removing the extension.
      const fileNameWithoutExtension = file.file.name.replace(/\.[^/.]+$/, "");
      setTitle(fileNameWithoutExtension);
      // Reset other fields for the new file
      setDuration('');
      setTagList([{ id: Date.now().toString(), key: '', value: '' }]); // Start with one empty tag
    }
  }, [isOpen, file]); // Re-run when the modal is opened or the file changes

  if (!isOpen || !file) {
    return null;
  }

  // --- Handlers for Dynamic Tags ---
  const handleTagChange = (id: string, field: 'key' | 'value', text: string) => {
    setTagList(currentTags =>
      currentTags.map(tag =>
        tag.id === id ? { ...tag, [field]: text } : tag
      )
    );
  };

  const handleAddTag = () => {
    setTagList(currentTags => [
      ...currentTags,
      { id: Date.now().toString(), key: '', value: '' }
    ]);
  };

  const handleRemoveTag = (id: string) => {
    setTagList(currentTags => currentTags.filter(tag => tag.id !== id));
  };

  // --- Handler for the Final Save Action ---
  const handleSave = () => {
    if (!title.trim()) {
      alert('A title is required.');
      return;
    }

    // Convert the tag list array into the required Record<string, string> object
    const finalTags: Record<string, string> = {};
    tagList.forEach(tag => {
      const key = tag.key.trim();
      const value = tag.value.trim();
      if (key && value) { // Only include tags with both a key and a value
        finalTags[key] = value;
      }
    });

    // Call the onSave prop from the parent with the fully formed data
    onSave({
      title: title.trim(),
      duration: Number(duration) || undefined, // Convert to number or undefined
      tags: finalTags,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* --- Modal Header --- */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Content Metadata</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        {/* --- Modal Body (Scrollable) --- */}
        <div className="p-6 space-y-6 overflow-y-auto">
          <div>
            <span className="text-sm font-medium text-gray-500">File: </span>
            <span className="text-sm font-semibold text-gray-800">{file.file.name}</span>
          </div>

          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Winter Deals Promo"
            />
          </div>

          {/* Duration Input */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (in seconds)
            </label>
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 60"
            />
          </div>

          {/* Dynamic Metadata/Tags Section */}
          <div>
            <h3 className="text-md font-medium text-gray-800 mb-2">Metadata Tags</h3>
            <div className="space-y-3">
              {tagList.map((tag, index) => (
                <div key={tag.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tag.key}
                    onChange={(e) => handleTagChange(tag.id, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Tag Name ${index + 1}`}
                  />
                  <input
                    type="text"
                    value={tag.value}
                    onChange={(e) => handleTagChange(tag.id, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Tag Value ${index + 1}`}
                  />
                  <button
                    onClick={() => handleRemoveTag(tag.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md"
                    title="Remove Tag"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddTag}
              className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 border border-dashed border-gray-400 text-sm font-medium rounded text-gray-600 hover:bg-gray-100"
            >
              <Plus size={16} />
              Add Tag
            </button>
          </div>
        </div>

        {/* --- Modal Footer --- */}
        <div className="flex items-center justify-end p-4 border-t gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
          >
            Save Content
          </button>
        </div>
      </div>
    </div>
  );
};