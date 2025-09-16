// src/features/content/components/ContentMetadataModal.tsx

import {useEffect, useState} from 'react';
import {FileText, Music, Plus, Trash2} from 'lucide-react';
import {UploadingFile} from '../store/upload.store';
import {getCategoryFromMime} from '../util/fileTypeUtils';
import {ContentRequest} from '../../../types/models/ContentItem';
import {useTheme} from '../../../contexts/ThemeContext';
// CHANGED: Imported all necessary UI components
import {Modal, ModalFooter} from '../../../components/ui/Modal';
import {Button} from '../../../components/ui/Button';
import {Input} from '../../../components/ui/Input';
import {Alert} from '../../../components/ui/Alert';

// The onSave prop now uses a more specific type, excluding fields the component doesn't know about.
interface ContentMetadataModalProps {
  isOpen: boolean;
  onClose: () => void;
    onSave: (data: Omit<ContentRequest, 'url' | 'type'> & { type: string }) => Promise<void>;
  file: UploadingFile | null;
}

type TagItem = {
  id: string;
  key: string;
  value: string;
};

export const ContentMetadataModal = ({ isOpen, onClose, onSave, file }: ContentMetadataModalProps) => {
    const {currentTheme} = useTheme();
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
    if (isOpen && file) {
        setName(file.extractedMetadata?.title || file.file.name.replace(/\.[^/.]+$/, ""));
        setDuration(file.extractedMetadata?.duration ? Math.round(file.extractedMetadata.duration) : '');
        setArtist(file.extractedMetadata?.artist || '');
        setAlbum(file.extractedMetadata?.album || '');
        setTagList([{id: Date.now().toString(), key: '', value: ''}]);
      setScreenIds([]);
      setCampaignId('');
      setError(null);
    }
  }, [isOpen, file]);

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

    if (!file || !file.backendFileType) {
      setError('File information is missing');
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

    const metadata: Record<string, unknown> = {
      ...(file.extractedMetadata && {
        originalTitle: file.extractedMetadata.title,
        artist: file.extractedMetadata.artist,
        album: file.extractedMetadata.album,
        duration: file.extractedMetadata.duration
      })
    };

    // Only include artist/album in metadata if they were edited
    if (artist.trim()) metadata.artist = artist.trim();
    if (album.trim()) metadata.album = album.trim();

      // This is the data object passed to the onSave prop.
      const formData = {
      name: name.trim(),
      type: file.backendFileType,
      duration: Number(duration) || undefined,
      tags: finalTags,
      screenIds: screenIds.length > 0 ? screenIds : undefined,
      campaignId: campaignId ? Number(campaignId) : undefined,
      metadata
    };

    try {
      setIsSaving(true);
      setError(null);
      await onSave(formData);
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save content. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreview = () => {
    if (!file) return null;

      // This logic now seamlessly uses the local preview URL while uploading,
      // and the final Supabase URL once the upload is complete.
      const displayUrl = file.url || file.previewUrl;
    const fileCategory = getCategoryFromMime(file.file.type);

      if (!displayUrl) {
          return (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md text-gray-500">
                  <p>Preview Unavailable</p>
              </div>
          );
      }

    if (fileCategory === 'IMAGE' || (fileCategory === 'AUDIO' && file.albumArtUrl)) {
        return <img src={file.albumArtUrl || displayUrl} alt="Content Preview"
                  className="w-full h-full object-cover rounded-md bg-gray-100"/>;
    }
    if (fileCategory === 'VIDEO') {
        return <video src={displayUrl} controls className="w-full h-full object-contain rounded-md bg-black"/>;
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

    if (!isOpen || !file) return null;

  return (
      <Modal
          isOpen={isOpen}
          onClose={onClose}
          title="Content Metadata"
          size="xl">
          <div className="flex gap-6">
          {/* Preview Section */}
          <div className="w-1/3 flex-shrink-0">
              <div className="aspect-square w-full rounded-md overflow-hidden"
                   style={{backgroundColor: currentTheme.colors.background.secondary}}>
              {renderPreview()}
            </div>
          </div>

          {/* Form Section */}
              <div className="w-2/3 space-y-4">
                  {error && <Alert variant="error">{error}</Alert>}

            <div>
            <span
                className="text-sm font-medium"
                style={{color: currentTheme.colors.text.secondary}}>
                File:
            </span>
                <span
                    className="text-sm font-semibold break-all"
                    style={{color: currentTheme.colors.text.primary}}>
                {file.file.name}
            </span>
            </div>

                  <Input
                      label="Name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Winter Deals Promo"
                      required
              />
                  <Input
                      label="Duration (seconds)"
                id="duration"
                type="number"
                min="0"
                value={duration}
                onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
              />
            {getCategoryFromMime(file.file.type) === 'AUDIO' && (
                <>
                    <Input label="Artist" id="artist" value={artist} onChange={(e) => setArtist(e.target.value)}/>
                    <Input label="Album" id="album" value={album} onChange={(e) => setAlbum(e.target.value)}/>
                </>
            )}
                  <Input
                      label="Campaign ID (optional)"
                id="campaignId"
                type="number"
                min="0"
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value === '' ? '' : Number(e.target.value))}
              />
                  <Input
                      label="Screen IDs (comma separated)"
                id="screenIds"
                value={screenIds.join(', ')}
                      onChange={(e) => setScreenIds(e.target.value.split(',').map(id => Number(id.trim())).filter(Boolean))}
                placeholder="e.g., 1, 2, 3"
              />

            {/* Tags Section */}
            <div>
                <h3 className="text-md font-medium mb-2"
                    style={{color: currentTheme.colors.text.primary}}>
                    Metadata Tags
                </h3>
              <div className="space-y-3">
                {tagList.map((tag, index) => (
                  <div key={tag.id} className="flex items-center gap-2">
                      <Input
                      value={tag.key}
                      onChange={(e) => handleTagChange(tag.id, 'key', e.target.value)}
                      placeholder={`Key ${index + 1}`}
                    />
                      <Input
                      value={tag.value}
                      onChange={(e) => handleTagChange(tag.id, 'value', e.target.value)}
                      placeholder={`Value ${index + 1}`}
                    />
                      <Button
                          variant="ghost"
                          size="sm"
                      onClick={() => handleRemoveTag(tag.id)}
                          title="Remove Tag">
                      <Trash2 size={18} />
                      </Button>
                  </div>
                ))}
              </div>
                <Button
                    variant="outline"
                    size="sm"
                onClick={handleAddTag}
                    leftIcon={<Plus size={16}/>}
                    className="mt-3"
              >
                    Add Tag
                </Button>
            </div>
              </div>
          </div>
          <ModalFooter>
              <Button
                  variant="secondary"
            onClick={onClose}
                  disabled={isSaving}>
            Cancel
              </Button>
              <Button
            onClick={handleSave}
            loading={isSaving}>
                  Save Content
              </Button>
          </ModalFooter>
      </Modal>
  );
};