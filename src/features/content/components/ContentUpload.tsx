import React, {useCallback} from 'react';
import {Check, Loader, Save, Upload} from 'lucide-react';
import {useUploadStore} from '../store/upload.store';

// --- Component-specific Imports ---
import {ContentMetadataModal} from './ContentMetadataModal';
import {ALLOWED_CONTENT_TYPES} from '../util/fileTypeUtils';
import {contentService} from '../../../services/content.service';
import {ContentItem} from '../../../types/models/ContentItem';

interface MetadataFormData { // Keep this interface
  title: string;
  duration?: number;
  artist?: string;
  album?: string;
  tags: Record<string, string>;
  campaignId?: number;
  screenIds?: number[]; // Add missing field
}

export const ContentUpload = () => {
  // Get the modal state and actions from the store
  const {
    uploadingFiles,
    addFiles,
    removeFile,
    fileForMetadata,
    setFileForMetadata,
    updateFileStatus
  } = useUploadStore();

  // handleFiles, handleDrop, handleFileSelect remain the same
  const handleFiles = useCallback((files: File[]) => {
    const validFiles = files.filter(file => ALLOWED_CONTENT_TYPES.includes(file.type));
    if (validFiles.length > 0) {
      addFiles(validFiles);
    }
  }, [addFiles]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  }, [handleFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
    e.target.value = ''; // Reset input to allow re-uploading the same file
  };
  /**
   * FULLY CORRECTED: This function is called when saving from the modal.
   * It now builds the exact payload your backend expects.
   */
  const handleMetadataSave = async (formData: MetadataFormData) => {
    if (!fileForMetadata || !fileForMetadata.url || !fileForMetadata.backendFileType) {
      console.error("Cannot save: Critical file information is missing.");
      return;
    }
    // Set status to 'saving' for UI feedback
    updateFileStatus(fileForMetadata.id, 'saving');

    // 1. Robustly determine the content name, using filename as a fallback.
    const contentName = formData.title?.trim() || fileForMetadata.file.name;

    // --- CONSTRUCT THE FINAL PAYLOAD ---
    // Note: I'm correcting the structure to match your target JSON example.

    // Create a ContentItem object directly
    const newContentPayload: ContentItem = {
      // Remove the id field to let the backend generate it
      name: contentName,
      type: fileForMetadata.backendFileType,
      url: fileForMetadata.url,
      // Pass the duration and tags object directly from the form data
      duration: formData.duration,
      // Keep tags as an object structure as expected by the backend
      tags: formData.tags || {},
      campaignId: formData.campaignId,
      screenIds: formData.screenIds,
      metadata: {
        // You could add other things here later, like format or bitrate
      },
    };

    // --- ADD ALL EXTRACTED METADATA TO THE METADATA OBJECT ---
    // First, add album art URL if it exists
    if (fileForMetadata.albumArtUrl) {
      newContentPayload.metadata.albumArtUrl = fileForMetadata.albumArtUrl;
    }

    // Add all extracted metadata from audio files
    if (fileForMetadata.extractedMetadata) {
      // Add each property from extractedMetadata to the metadata object
      if (fileForMetadata.extractedMetadata.title) {
        newContentPayload.metadata.title = fileForMetadata.extractedMetadata.title;
      }
      if (fileForMetadata.extractedMetadata.artist) {
        newContentPayload.metadata.artist = fileForMetadata.extractedMetadata.artist;
      }
      if (fileForMetadata.extractedMetadata.album) {
        newContentPayload.metadata.album = fileForMetadata.extractedMetadata.album;
      }
      if (fileForMetadata.extractedMetadata.duration) {
        newContentPayload.metadata.originalDuration = fileForMetadata.extractedMetadata.duration;
      }
    }

    // Add user-edited metadata from the form (overrides extracted metadata)
    if (formData.artist) {
      newContentPayload.metadata.artist = formData.artist;
    }
    if (formData.album) {
      newContentPayload.metadata.album = formData.album;
    }

    // Clean up a metadata object if it's empty
    if (Object.keys(newContentPayload.metadata).length === 0) {
      delete newContentPayload.metadata;
    }

    console.log("Sending this payload to the backend:", newContentPayload);

    try {
      // Cast the payload to the expected type for the service call
      const createdContent = await contentService.createContent(newContentPayload);
      console.log('Successfully created content:', createdContent);

      // On success, close the modal and remove the item from the upload list
      setFileForMetadata(null);
      removeFile(fileForMetadata.id);

      // Check if there are other completed files and open the next one
      const nextFile = uploadingFiles.find(f => f.status === 'success' && f.id !== fileForMetadata.id);
      if (nextFile) {
        setFileForMetadata(nextFile);
      }

    } catch (error) {
      console.error("Failed to save metadata:", error);
      // On error, revert status so the user can try again
      updateFileStatus(fileForMetadata.id, 'success');
      alert("Failed to save. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* --- Upload Dropzone UI --- */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">Drag & drop or</p>
        <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept={ALLOWED_CONTENT_TYPES.join(',')}
          />
          Browse Files
        </label>
        <p className="text-xs text-gray-500 mt-4">Supports: Video, Audio, Images, and Documents</p>
      </div>

      {/* --- Upload List UI --- */}
      {uploadingFiles.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Uploading Files</h2>
          {uploadingFiles.map(file => (
            <div key={file.id} className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
              <div className="flex-grow">
                {/* ... file name and progress bar ... */}
                {file.status === 'success' && <p className="text-sm text-green-600 mt-1">Ready for metadata.</p>}
                {file.status === 'saving' && <p className="text-sm text-yellow-600 mt-1">Saving metadata...</p>}
              </div>

              <div className="flex-shrink-0 flex items-center gap-2">
                {file.status === 'uploading' && <Loader className="w-5 h-5 text-blue-500 animate-spin"/>}
                {file.status === 'saving' && <Save className="w-5 h-5 text-yellow-500 animate-spin"/>}
                {/* The "Add Info" button is no longer needed as the modal opens automatically */}
                {file.status === 'success' && <Check className="w-5 h-5 text-green-600"/>}
                {/* ... error and cancel buttons ... */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* The Modal now reads its state from the store */}
      <ContentMetadataModal
          isOpen={!!fileForMetadata}
          onClose={() => setFileForMetadata(null)}
          onSave={handleMetadataSave}
          file={fileForMetadata}
      />
    </div>
  );
};
