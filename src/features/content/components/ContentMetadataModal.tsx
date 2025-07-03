// This file is part of the Media Management System project.
// src/features/content/components/ContentMetadataModal.tsx
import {useEffect, useState} from 'react';
import {FileText, Music, Plus, Trash2, X} from 'lucide-react';
import {UploadingFile} from '../store/upload.store';
import {getCategoryFromMime} from '../util/fileTypeUtils';

// This is the data structure the modal will pass back to the parent component.
interface MetadataFormData {
  title: string;
  duration?: number;
  artist?: string;
  album?: string;
  tags: Record<string, string>;
  campaignId?: number; // Kept for future use if needed
  screenIds?: number[]; // Add missing field
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
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [tagList, setTagList] = useState<TagItem[]>([]);
  const [screenIds, setScreenIds] = useState<number[]>([]);

  // --- Effect to pre-populate and reset the form ---
  useEffect(() => {
    if (isOpen && file) {
      // Pre-populate with extracted metadata if available, otherwise use filename.
      const initialTitle = file.extractedMetadata?.title || file.file.name.replace(/\.[^/.]+$/, "");
      const initialDuration = file.extractedMetadata?.duration;
      const initialArtist = file.extractedMetadata?.artist || '';
      const initialAlbum = file.extractedMetadata?.album || '';

      setTitle(initialTitle);
      setDuration(initialDuration ? Math.round(initialDuration) : '');
      setArtist(initialArtist);
      setAlbum(initialAlbum);
      setTagList([{id: Date.now().toString(), key: '', value: ''}]); // Start with one empty tag.
      setScreenIds([]); // Initialize with empty array
    }
  }, [isOpen, file]); // Re-run when the modal is opened or the file changes.

  // --- RE-INTRODUCED: Handlers for Dynamic Tags ---
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

    const finalTags: Record<string, string> = {};
    tagList.forEach(tag => {
      const key = tag.key.trim();
      const value = tag.value.trim();
      if (key && value) {
        finalTags[key] = value;
      }
    });

    // Include artist and album in the data if they are provided
    const formData: MetadataFormData = {
      title: title.trim(),
      duration: Number(duration) || undefined,
      tags: finalTags,
      screenIds: screenIds.length > 0 ? screenIds : undefined,
    };

    // Only include artist and album if they have values
    if (artist.trim()) {
      formData.artist = artist.trim();
    }

    if (album.trim()) {
      formData.album = album.trim();
    }

    onSave(formData);
  };

  // --- NEW: Render a preview of the content ---
  const renderPreview = () => {
    if (!file) return null;

    const previewUrl = file.albumArtUrl || file.url;
    const fileCategory = getCategoryFromMime(file.file.type);

    if (fileCategory === 'IMAGE' || (fileCategory === 'AUDIO' && file.albumArtUrl)) {
      return <img src={previewUrl} alt="Content Preview"
                  className="w-full h-full object-cover rounded-md bg-gray-100"/>;
    }
    if (fileCategory === 'VIDEO') {
      return <video src={file.url} controls className="w-full h-full object-contain rounded-md bg-black"/>;
    }

    // Fallback for audio without album art, or documents
    const Icon = fileCategory === 'AUDIO' ? Music : FileText;
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-md text-gray-500">
          <Icon size={48}/>
          <p className="mt-2 text-sm">No visual preview</p>
        </div>
    );
  };


  if (!isOpen || !file) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* --- Modal Header --- */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Content Metadata</h2>
          <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>

        {/* --- Modal Body (Scrollable with Preview) --- */}
        <div className="flex-grow p-6 flex gap-6 overflow-y-auto">
          {/* --- LEFT SIDE: Preview --- */}
          <div className="w-1/3 flex-shrink-0">
            <div className="aspect-square w-full">
              {renderPreview()}
            </div>
          </div>

          {/* --- RIGHT SIDE: Form Fields --- */}
          <div className="w-2/3 space-y-6">
            <div>
              <span className="text-sm font-medium text-gray-500">File: </span>
              <span className="text-sm font-semibold text-gray-800 break-all">{file.file.name}</span>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
              placeholder="e.g., Winter Deals Promo"
            </div>

            {/* Duration Input */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Duration
                (seconds)</label>
              <input id="duration" type="number" value={duration}
                     onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md"/>
            </div>

            {/* Artist Input - Only show for audio files */}
            {file && getCategoryFromMime(file.file.type) === 'AUDIO' && (
                <div>
                  <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                  <input
                      id="artist"
                      type="text"
                      value={artist}
                      onChange={(e) => setArtist(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Artist Name"
                  />
                </div>
            )}

            {/* Album Input - Only show for audio files */}
            {file && getCategoryFromMime(file.file.type) === 'AUDIO' && (
                <div>
                  <label htmlFor="album" className="block text-sm font-medium text-gray-700 mb-1">Album</label>
                  <input
                      id="album"
                      type="text"
                      value={album}
                      onChange={(e) => setAlbum(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Album Name"
                  />
                </div>
            )}

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
                          className="flex-1 px-3 py-2 border rounded-md" placeholder={`Key ${index + 1}`}
                      />
                      <input type="text" value={tag.value}
                             onChange={(e) => handleTagChange(tag.id, 'value', e.target.value)}
                             className="flex-1 px-3 py-2 border rounded-md" placeholder={`Value ${index + 1}`}/>
                      <button onClick={() => handleRemoveTag(tag.id)}
                              className="p-2 text-gray-500 hover:text-red-600 rounded-md" title="Remove Tag"><Trash2
                          size={18}/></button>
                    </div>
                ))}
              </div>
              <button onClick={handleAddTag}
                      className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 border border-dashed rounded text-sm hover:bg-gray-100">
                <Plus size={16}/> Add Tag
              </button>
            </div>

            {/* Screen Selection */}
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Target Screens</h3>
              <div className="space-y-3">
                {/* This would ideally be a multi-select component */}
                {/* For simplicity, using a basic input for now */}
                <input
                    type="text"
                    value={screenIds.join(', ')}
                    onChange={(e) => {
                      const ids = e.target.value
                          .split(',')
                          .map(id => id.trim())
                          .filter(id => /^\d+$/.test(id))
                          .map(Number);
                      setScreenIds(ids);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter screen IDs separated by commas (e.g., 1, 2, 3)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Modal Footer --- */}
        <div className="flex items-center justify-end p-4 border-t gap-3">
          <button onClick={onClose}
                  className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border
                   rounded-md hover:bg-blue-700">
            Save Content
          </button>
        </div>
      </div>
    </div>
  );
};
