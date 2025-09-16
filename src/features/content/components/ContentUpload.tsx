// src/features/content/components/ContentUpload.tsx

// FINAL CODE

import React, {useCallback, useEffect, useState} from 'react';
import {Check, Loader, RefreshCw, Upload, XCircle} from 'lucide-react';
import {useUploadStore} from '../store/upload.store';
import {ContentMetadataModal} from './ContentMetadataModal';
import {ALLOWED_CONTENT_TYPES} from '../util/fileTypeUtils';
import {contentService} from '../../../services/content.service';
import {ContentRequest} from '../../../types/models/ContentItem';
import {supabase} from '../../../utils/supabase'; // 👈 Ensure this path is correct
import {User} from '@supabase/supabase-js';

export const ContentUpload = () => {
    const [user, setUser] = useState<User | null>(null);

  const {
      uploadingFiles, addFiles, removeFile, fileForMetadata,
      setFileForMetadata, updateFileStatus, setFileUploadSuccess,
  } = useUploadStore();

    useEffect(() => {
        const fetchUser = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (fileForMetadata) return;
        const nextFileToProcess = uploadingFiles.find(f => f.status === 'success');
        if (nextFileToProcess) {
            setFileForMetadata(nextFileToProcess);
        }
    }, [uploadingFiles, fileForMetadata, setFileForMetadata]);

    const uploadFileToSupabase = useCallback(async (fileId: string) => {
        if (!user) {
            updateFileStatus(fileId, 'error', "User not authenticated");
            return;
        }
        const fileToUpload = useUploadStore.getState().uploadingFiles.find(f => f.id === fileId);
        if (!fileToUpload) return;

        updateFileStatus(fileId, 'uploading');
        try {
            const filePath = `${user.id}/${fileToUpload.file.name}`;

            const {error: uploadError} = await supabase.storage
                .from('content') // 👈 **REPLACE 'content' with your Supabase bucket name**
                .upload(filePath, fileToUpload.file, {upsert: true});
            if (uploadError) throw uploadError;

            const {data: {publicUrl}} = supabase.storage
                .from('content') // 👈 **REPLACE 'content' with your Supabase bucket name**
                .getPublicUrl(filePath);

            setFileUploadSuccess(fileId, publicUrl);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown upload error";
            updateFileStatus(fileId, 'error', errorMessage);
        }
    }, [user, updateFileStatus, setFileUploadSuccess]);

  const handleFiles = useCallback((files: File[]) => {
    const validFiles = files.filter(file => ALLOWED_CONTENT_TYPES.includes(file.type));
    if (validFiles.length > 0) {
        const newFileEntries = addFiles(validFiles);
        newFileEntries.forEach(file => uploadFileToSupabase(file.id));
    }
  }, [addFiles, uploadFileToSupabase]);

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

    const handleMetadataSave = async (formData: Omit<ContentRequest, 'url' | 'type'> & { type: string }) => {
        if (!fileForMetadata || !fileForMetadata.url) {
            console.error("No file or file URL available for saving metadata.");
    return;
  }

  updateFileStatus(fileForMetadata.id, 'saving');

  try {
    // Create properly typed ContentRequest object
    const contentRequest: ContentRequest = {
        ...formData,
        url: fileForMetadata.url, // Add the crucial Supabase URL
    };

      await contentService.saveContentMetadata(contentRequest);

    setFileForMetadata(null);
    removeFile(fileForMetadata.id);
  } catch (error) {
      updateFileStatus(fileForMetadata.id, 'error', 'Failed to save metadata');
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
            <input type="file" multiple className="hidden" onChange={handleFileSelect}
                   accept={ALLOWED_CONTENT_TYPES.join(',')}/>
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
                  {file.status === 'success' && <p className="text-sm text-green-600 mt-1">Ready for metadata</p>}
                  {file.status === 'uploading' && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                  {file.status === 'saving' && <p className="text-sm text-yellow-600 mt-1">Saving metadata...</p>}
                  {file.status === 'error' && <p className="text-sm text-red-600 mt-1">Error: {file.error}</p>}
                  {file.status === 'queued' && <p className="text-sm text-gray-500 mt-1">Waiting...</p>}
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                {file.status === 'uploading' && <Loader className="w-5 h-5 text-blue-500 animate-spin"/>}
                {file.status === 'success' && <Check className="w-5 h-5 text-green-600"/>}
                  {file.status === 'saving' && <Loader className="w-5 h-5 text-yellow-500 animate-spin"/>}
                  {file.status === 'error' && (
                      <button onClick={() => uploadFileToSupabase(file.id)} title="Retry Upload">
                          <RefreshCw className="w-5 h-5 text-gray-600 hover:text-blue-600"/>
                      </button>
                  )}
                  <button onClick={() => removeFile(file.id)} title="Cancel Upload">
                      <XCircle className="w-5 h-5 text-gray-500 hover:text-red-600"/>
                  </button>
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