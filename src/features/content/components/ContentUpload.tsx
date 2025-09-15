// ContentUpload.tsx
import React, { useCallback } from 'react';
import { Check, Loader, Upload } from 'lucide-react';
import { useUploadStore } from '../store/upload.store';
import { ContentMetadataModal } from './ContentMetadataModal';
import { ALLOWED_CONTENT_TYPES } from '../util/fileTypeUtils';
import { contentService } from '../../../services/content.service';
import { ContentRequest } from '../../../types/models/ContentItem';

export const ContentUpload = () => {
  const {
    uploadingFiles,
    addFiles,
    removeFile,
    fileForMetadata,
    setFileForMetadata,
    updateFileStatus
  } = useUploadStore();

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
    e.target.value = '';
  };

  // THIS IS THE CRUCIAL HANDLER THAT CONNECTS THE MODAL TO THE UPLOAD PROCESS
  // ContentUpload.tsx
const handleMetadataSave = async (formData: {
  name: string;
  type: string;
  duration?: number;
  tags: Record<string, string>;
  metadata: Record<string, unknown>;
  campaignId?: number;
  screenIds?: number[];
}) => {
  if (!fileForMetadata) {
    console.error("No file selected for upload");
    return;
  }

  updateFileStatus(fileForMetadata.id, 'saving');

  try {
    // Create properly typed ContentRequest object
    const contentRequest: ContentRequest = {
      name: formData.name,
      type: formData.type,
      duration: formData.duration,
      tags: formData.tags,
      metadata: formData.metadata,
      campaignId: formData.campaignId,
      screenIds: formData.screenIds
    };


    // Upload to backend
    const response = await contentService.uploadContentWithFile(
      fileForMetadata.file,
      contentRequest
    );

    console.log('Upload successful:', response);
    setFileForMetadata(null);
    removeFile(fileForMetadata.id);

    const nextFile = uploadingFiles.find(f => 
      f.status === 'success' && f.id !== fileForMetadata.id
    );
    if (nextFile) setFileForMetadata(nextFile);

  } catch (error) {
    console.error("Upload failed:", error);
    updateFileStatus(fileForMetadata.id, 'error');
    throw error;
  }
};

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Upload dropzone UI */}
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
        <p className="text-xs text-gray-500 mt-4">Supports: Video, Audio, Images</p>
      </div>

      {/* Upload list */}
      {uploadingFiles.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Uploading Files</h2>
          {uploadingFiles.map(file => (
            <div key={file.id} className="bg-gray-50 p-4 rounded-lg flex items-center gap-4">
              <div className="flex-grow">
                <p className="font-medium">{file.file.name}</p>
                {file.status === 'success' && (
                  <p className="text-sm text-green-600 mt-1">Ready for metadata</p>
                )}
                {file.status === 'uploading' && (
                  <p className="text-sm text-blue-600 mt-1">Uploading...</p>
                )}
                {file.status === 'error' && (
                  <p className="text-sm text-red-600 mt-1">Upload failed</p>
                )}
                {file.status === 'saving' && (
                  <p className="text-sm text-yellow-600 mt-1">Saving metadata...</p>
                )}
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                {file.status === 'uploading' && <Loader className="w-5 h-5 text-blue-500 animate-spin"/>}
                {file.status === 'success' && <Check className="w-5 h-5 text-green-600"/>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metadata Modal */}
      <ContentMetadataModal
        isOpen={!!fileForMetadata}
        onClose={() => setFileForMetadata(null)}
        onSave={handleMetadataSave}
        file={fileForMetadata}
      />
    </div>
  );
};