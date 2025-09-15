import { useEffect, useState } from 'react';
import { FileText, Music, Plus, Trash2, X } from 'lucide-react';
import { ContentItem } from '../../../types/models/ContentItem';

interface TagItem {
  id: string;
  key: string;
  value: string;
}

interface ContentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ContentItem) => Promise<void>;
  contentItem: ContentItem | null;
}

export const ContentEditModal = ({ isOpen, onClose, onSave, contentItem }: ContentEditModalProps) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [tagList, setTagList] = useState<TagItem[]>([]);
  const [screenIds, setScreenIds] = useState<number[]>([]);
  const [campaignId, setCampaignId] = useState<number | ''>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && contentItem) {
      setName(contentItem.name);
      setDuration(contentItem.duration || '');
      setArtist(contentItem.metadata?.artist as string || '');
      setAlbum(contentItem.metadata?.album as string || '');
      
      // Convert tags object to array
      const tags = contentItem.tags || {};
      setTagList(
        Object.keys(tags).length > 0 
          ? Object.entries(tags).map(([key, value]) => ({
              id: Date.now().toString(),
              key,
              value
            }))
          : [{id: Date.now().toString(), key: '', value: ''}]
      );

      setScreenIds(contentItem.screenIds || []);
      setCampaignId(contentItem.campaignId || '');
      setError(null);
    }
  }, [isOpen, contentItem]);

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

  const handleSave = async () => {
    if (!name.trim()) {
      setError('A name is required');
      return;
    }

    if (!contentItem) {
      setError('Content information is missing');
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

    const updatedContent: ContentItem = {
      ...contentItem,
      name: name.trim(),
      duration: Number(duration) || undefined,
      screenIds: screenIds.length > 0 ? screenIds : undefined,
      campaignId: campaignId ? Number(campaignId) : undefined,
      tags: finalTags,
      metadata: {
        ...contentItem.metadata,
        artist: artist.trim(),
        album: album.trim()
      }
    };

    try {
      setIsSaving(true);
      setError(null);
      await onSave(updatedContent);
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => {
    if (!contentItem) return null;

    const previewUrl = contentItem.thumbnailUrl || contentItem.url;
    const fileCategory = contentItem.type;

    if (fileCategory === 'IMAGE' || (fileCategory === 'AUDIO' && contentItem.thumbnailUrl)) {
      return <img src={previewUrl} alt="Content Preview"
                  className="w-full h-full object-cover rounded-md bg-gray-100"/>;
    }
    if (fileCategory === 'VIDEO') {
      return <video src={contentItem.url} controls className="w-full h-full object-contain rounded-md bg-black"/>;
    }

    const Icon = fileCategory === 'AUDIO' ? Music : FileText;
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-md text-gray-500">
          <Icon size={48}/>
          <p className="mt-2 text-sm">No visual preview</p>
        </div>
    );
  };

  if (!isOpen || !contentItem) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Edit Content</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
            disabled={isSaving}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-grow p-6 flex gap-6 overflow-y-auto">
          {/* Preview Section */}
          <div className="w-1/3 flex-shrink-0">
            <div className="aspect-square w-full">
              {renderPreview()}
            </div>
          </div>

          {/* Form Section */}
          <div className="w-2/3 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}

            <div>
              <span className="text-sm font-medium text-gray-500">Type: </span>
              <span className="text-sm font-semibold text-gray-800">{contentItem.type}</span>
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Winter Deals Promo"
              />
            </div>

            {/* Duration Input */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (seconds)
              </label>
              <input
                id="duration"
                type="number"
                min="0"
                value={duration}
                onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Artist Input (for audio files) */}
            {contentItem.type === 'AUDIO' && (
              <div>
                <label htmlFor="artist" className="block text-sm font-medium text-gray-700 mb-1">
                  Artist
                </label>
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

            {/* Album Input (for audio files) */}
            {contentItem.type === 'AUDIO' && (
              <div>
                <label htmlFor="album" className="block text-sm font-medium text-gray-700 mb-1">
                  Album
                </label>
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

            {/* Campaign ID */}
            <div>
              <label htmlFor="campaignId" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign ID (optional)
              </label>
              <input
                id="campaignId"
                type="number"
                min="0"
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., 12345"
              />
            </div>

            {/* Screen IDs */}
            <div>
              <label htmlFor="screenIds" className="block text-sm font-medium text-gray-700 mb-1">
                Screen IDs (comma separated)
              </label>
              <input
                id="screenIds"
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
                placeholder="e.g., 1, 2, 3"
              />
            </div>

            {/* Tags Section */}
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Metadata Tags</h3>
              <div className="space-y-3">
                {tagList.map((tag, index) => (
                  <div key={tag.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tag.key}
                      onChange={(e) => handleTagChange(tag.id, 'key', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder={`Key ${index + 1}`}
                    />
                    <input
                      type="text"
                      value={tag.value}
                      onChange={(e) => handleTagChange(tag.id, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      placeholder={`Value ${index + 1}`}
                    />
                    <button
                      onClick={() => handleRemoveTag(tag.id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-md"
                      title="Remove Tag"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddTag}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 border border-dashed rounded text-sm hover:bg-gray-100"
              >
                <Plus size={16} /> Add Tag
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end p-4 border-t gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-white border rounded-md hover:bg-gray-50"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`px-4 py-2 text-sm font-medium text-white border rounded-md ${
              isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};