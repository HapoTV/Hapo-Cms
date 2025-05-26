import React, { useState, useCallback, useRef } from 'react';
import { Search, MoreVertical, Plus, Edit, Trash2, ListPlus, ScreenShare, Copy, Move, Info, Upload, X, Loader, Check } from 'lucide-react';
import { uploadFileToS3, deleteFileFromS3 } from '../services/s3';
import ContentMetadataModal from '../components/ContentMetadataModal';
import { ALLOWED_CONTENT_TYPES, FILE_TYPE_CATEGORIES } from '../lib/constants';

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'error' | 'success';
  error?: string;
  url?: string;
}

const ContentLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [currentFile, setCurrentFile] = useState<UploadingFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockCampaigns = [
    { id: 1, name: 'Summer Campaign 2024' },
    { id: 2, name: 'Product Launch Q2' }
  ];

  const mockScreens = [
    { id: 'screen1', name: 'Lobby Display' },
    { id: 'screen2', name: 'Meeting Room A' },
    { id: 'screen3', name: 'Cafeteria Screen' }
  ];

  const validateFileType = (file: File): boolean => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    const isValidExtension = Object.values(FILE_TYPE_CATEGORIES)
      .flat()
      .includes(extension as string);

    const isAllowedType = file.type && ALLOWED_CONTENT_TYPES.includes(file.type as any);

    console.log('File validation details:', {
      fileName: file.name,
      fileType: file.type,
      extension,
      isValidExtension,
      isAllowedType
    });

    return isValidExtension || isAllowedType;
  };

  const getFileCategory = (file: File): string => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension) return 'unknown';

    for (const [category, extensions] of Object.entries(FILE_TYPE_CATEGORIES)) {
      if (extensions.includes(extension as any)) {
        return category;
      }
    }
    return 'unknown';
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    const newUploadingFiles: UploadingFile[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    setShowUploadModal(true);

    for (const [index, file] of files.entries()) {
      if (!validateFileType(file)) {
        setUploadingFiles(prev => prev.map(f =>
          f.id === newUploadingFiles[index].id
            ? { ...f, status: 'error', error: 'Invalid file type' }
            : f
        ));
        continue;
      }

      try {
        const fileUrl = await uploadFileToS3(file, (progress) => {
          setUploadingFiles(prev => prev.map(f =>
            f.id === newUploadingFiles[index].id
              ? { ...f, progress }
              : f
          ));
        });

        const updatedFile = {
          ...newUploadingFiles[index],
          status: 'success',
          url: fileUrl
        };

        setUploadingFiles(prev => prev.map(f =>
          f.id === updatedFile.id ? updatedFile : f
        ));

        setCurrentFile(updatedFile);
        setShowMetadataModal(true);

      } catch (error) {
        setUploadingFiles(prev => prev.map(f =>
          f.id === newUploadingFiles[index].id
            ? { ...f, status: 'error', error: 'Upload failed' }
            : f
        ));
      }
    }
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0 && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      files.forEach(file => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
      handleFileSelect({ target: { files: dataTransfer.files } } as any);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleSaveMetadata = async (metadata: any) => {
    try {
      setShowMetadataModal(false);
      setCurrentFile(null);
    } catch (error) {
      console.error('Failed to save metadata:', error);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Content Library</h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Upload className="w-5 h-5 mr-2" />
          Upload Content
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept={ALLOWED_CONTENT_TYPES.join(',')}
        />
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search content..."
            className="pl-10 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center"
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Drag and drop files here or click to browse</p>
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: MP4, AVI, MKV, MOV, FLV, WMV, WEBM, MP3, WAV, AAC, FLAC, OGG, WMA, M4A,
          JPEG, PNG, GIF, 
        </p>
      </div>

      {showUploadModal && uploadingFiles.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Uploading Files</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
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
          </div>
        </div>
      )}

      {showMetadataModal && currentFile && (
        <ContentMetadataModal
          isOpen={showMetadataModal}
          onClose={() => {
            setShowMetadataModal(false);
            setCurrentFile(null);
          }}
          onSave={handleSaveMetadata}
          initialData={{
            name: currentFile.file.name,
            type: currentFile.file.type,
            url: currentFile.url,
            size: currentFile.file.size,
            uploadDate: new Date(),
            tags: [],
            metadata: {},
            screens: []
          }}
          campaigns={mockCampaigns}
          screens={mockScreens}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modified</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentLibrary;