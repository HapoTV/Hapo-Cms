// This file is part of the Media Management System project.
// src/features/content/components/ContentUpload.tsx
import React, { useState, useCallback } from 'react';
import { Upload, X, Loader, Check, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Key Imports ---
import { contentService } from '../../../services/content.service';
import { ContentItem,  } from '../../../types/models/ContentItem';
import { useUploadStore, UploadingFile } from '../store/upload.store';

// --- Component-specific Imports ---
import { ContentMetadataModal } from './ContentMetadataModal';
import { ALLOWED_CONTENT_TYPES } from '../constants';

// CORRECTED: Define the shape of data we expect from the metadata modal
// to match the final backend JSON structure.
interface MetadataFormData {
  title: string;
  duration?: number;
  tags: Record<string, string>; // The modal must provide an object of key-value pairs
  campaignId?: number;
}

export const ContentUpload = () => {
  // @ts-ignore
  const navigate = useNavigate();
  const { uploadingFiles, addFiles, removeFile, retryUpload } = useUploadStore();
  const [fileForMetadata, setFileForMetadata] = useState<UploadingFile | null>(null);

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

  const handleProceedWithFile = (file: UploadingFile) => {
    if (file.status === 'success') {
      setFileForMetadata(file);
    }
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

    // 1. Robustly determine the content name, using filename as a fallback.
    const contentName = formData.title?.trim() || fileForMetadata.file.name;

    // 2. Construct the final payload to match the `ContentItem` interface and backend JSON.
    const newContent: ContentItem = {
      name: contentName,
      type: fileForMetadata.backendFileType,
      url: fileForMetadata.url,
      // Pass the duration and tags object directly from the form data
      duration: formData.duration,
      tags: formData.tags || {}, // Ensure tags is an object, even if empty
    };

    console.log("Sending this payload to the backend:", newContent);

    try {
      // 3. Call the createContent service with the correctly structured payload.
      const createdContent = await contentService.createContent(newContent);
      console.log('Successfully created content:', createdContent);

      // 4. On success, clean up the UI.
      setFileForMetadata(null); // Close the modal
      removeFile(fileForMetadata.id); // Remove the completed item from the list

      // Optional: Navigate to the new content's detail page
      if (createdContent.id) {
        // navigate(`/content/${createdContent.id}`);
      }

    } catch (error) {
      console.error("Failed to save content metadata:", error);
      // IMPORTANT: Keep the modal open on error so the user can fix input and retry.
      // You can pass an error state to your modal to display a message.
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
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 truncate" title={file.file.name}>{file.file.name}</span>
                  {file.status === 'uploading' && <span className="text-sm text-blue-600">{file.progress}%</span>}
                </div>
                {(file.status === 'queued' || file.status === 'uploading') && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${file.progress}%` }} />
                  </div>
                )}
                {file.status === 'error' && <p className="text-sm text-red-500 mt-1">Error: {file.error}</p>}
                {file.status === 'success' && <p className="text-sm text-green-600 mt-1">Ready for metadata.</p>}
              </div>

              <div className="flex-shrink-0 flex items-center gap-2">
                {file.status === 'uploading' && <Loader className="w-5 h-5 text-blue-500 animate-spin" />}
                {file.status === 'success' && (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <button onClick={() => handleProceedWithFile(file)} className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                      Add Info
                    </button>
                  </>
                )}
                {file.status === 'error' && (
                  <button onClick={() => retryUpload(file.id)} title="Retry Upload" className="p-1 text-gray-500 hover:text-gray-800">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
                <button onClick={() => removeFile(file.id)} title="Cancel" className="p-1 text-gray-500 hover:text-red-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- The Modal --- */}
      {fileForMetadata && (
        <ContentMetadataModal
          isOpen={!!fileForMetadata}
          onClose={() => setFileForMetadata(null)}
          onSave={handleMetadataSave}
          file={fileForMetadata}
        />
      )}
    </div>
  );
};