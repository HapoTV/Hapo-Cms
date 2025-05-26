import React, { useState, useCallback } from 'react';
import { Upload, X, Loader, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContentMetadataModal } from './ContentMetadataModal';
import { ALLOWED_CONTENT_TYPES } from '../constants';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'error' | 'success';
  error?: string;
  url?: string;
}

export const ContentUpload = () => {
  const navigate = useNavigate();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [currentFile, setCurrentFile] = useState<UploadingFile | null>(null);
  const [showMetadataModal, setShowMetadataModal] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadingFiles(prev => [...prev, ...newFiles]);
    
    // Simulate file upload
    newFiles.forEach(file => {
      setTimeout(() => {
        setUploadingFiles(prev => prev.map(f =>
          f.id === file.id ? { ...f, status: 'success', progress: 100 } : f
        ));
        setCurrentFile(file);
        setShowMetadataModal(true);
      }, 2000);
    });
  };

  const handleMetadataSave = async (metadata: any) => {
    setShowMetadataModal(false);
    setCurrentFile(null);
    navigate('..');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Content</h1>
        <p className="mt-2 text-gray-600">Drag and drop files or click to browse</p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">Drag and drop files here</p>
        <p className="text-sm text-gray-500 mb-4">or</p>
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
      </div>

      {uploadingFiles.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Uploading Files</h2>
          {uploadingFiles.map(file => (
            <div key={file.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 truncate">
                  {file.file.name}
                </span>
                {file.status === 'uploading' && (
                  <span className="text-sm text-blue-600">{file.progress}%</span>
                )}
                {file.status === 'success' && (
                  <span className="text-green-600">
                    <Check className="w-5 h-5" />
                  </span>
                )}
                {file.status === 'error' && (
                  <span className="text-red-600" title={file.error}>
                    <X className="w-5 h-5" />
                  </span>
                )}
              </div>
              {file.status === 'uploading' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showMetadataModal && currentFile && (
        <ContentMetadataModal
          isOpen={showMetadataModal}
          onClose={() => {
            setShowMetadataModal(false);
            setCurrentFile(null);
          }}
          onSave={handleMetadataSave}
          file={currentFile}
        />
      )}
    </div>
  );
};