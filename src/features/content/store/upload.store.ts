// src/features/content/store/upload.store.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import * as mm from 'music-metadata-browser';
import { getBackendFileType } from '../util/fileTypeUtils';

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'queued' | 'uploading' | 'error' | 'success' | 'saving';
  error?: string;
  url?: string;
  albumArtUrl?: string;
  backendFileType?: string | null;
  extractedMetadata?: {
    title: string;
    artist?: string;
    album?: string;
    duration: number;
  };
}

const extractMetadata = async (file: File): Promise<UploadingFile['extractedMetadata']> => {
  try {
    const metadata = await mm.parseBlob(file);
    return {
      title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
      artist: metadata.common.artist,
      album: metadata.common.album,
      duration: metadata.format.duration || 0,
    };
  } catch (error) {
    console.warn("Could not parse music metadata, using fallback.", error);
    return {
      title: file.name.replace(/\.[^/.]+$/, ""),
      duration: 0,
    };
  }
};

interface UploadState {
  uploadingFiles: UploadingFile[];
  fileForMetadata: UploadingFile | null;
  setFileForMetadata: (file: UploadingFile | null) => void;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  updateFileStatus: (id: string, status: UploadingFile['status']) => void;
  retryUpload: (id: string) => void;
  _triggerUpload: (id: string) => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  uploadingFiles: [],
  fileForMetadata: null,
  setFileForMetadata: (file) => set({ fileForMetadata: file }),

  addFiles: (files: File[]) => {
    const newFiles: UploadingFile[] = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${uuidv4()}`,
      file,
      progress: 0,
      status: 'queued',
    }));
    set((state) => ({ uploadingFiles: [...state.uploadingFiles, ...newFiles] }));
    newFiles.forEach((file) => get()._triggerUpload(file.id));
  },

  updateFileStatus: (id, status) => {
    set(state => ({
      uploadingFiles: state.uploadingFiles.map(f =>
        f.id === id ? { ...f, status } : f
      )
    }));
  },

  _triggerUpload: async (id: string) => {
    const fileToUpload = get().uploadingFiles.find((f) => f.id === id);
    if (!fileToUpload || fileToUpload.status === 'uploading') return;

    set((state) => ({
      uploadingFiles: state.uploadingFiles.map((f) =>
        f.id === id ? { ...f, status: 'uploading', progress: 0 } : f
      ),
    }));

    try {
      // Extract metadata for audio files
      let extractedMetadata: UploadingFile['extractedMetadata'] | undefined;
      if (fileToUpload.file.type.startsWith('audio/')) {
        extractedMetadata = await extractMetadata(fileToUpload.file);
      }

      const backendFileType = getBackendFileType(fileToUpload.file.type);

      // Create temporary object with basic info
      const uploadedFile: UploadingFile = {
        ...fileToUpload,
        status: 'success',
        progress: 100,
        backendFileType,
        extractedMetadata,
        // Generate a preview URL for the file
        url: URL.createObjectURL(fileToUpload.file)
      };

      // Update the store
      set(state => ({
        uploadingFiles: state.uploadingFiles.map(f => 
          f.id === id ? uploadedFile : f
        )
      }));

      // Open metadata modal if no other modal is open
      if (!get().fileForMetadata) {
        get().setFileForMetadata(uploadedFile);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      set((state) => ({
        uploadingFiles: state.uploadingFiles.map((f) =>
          f.id === id ? { ...f, status: 'error', error: errorMessage } : f
        ),
      }));
    }
  },

  retryUpload: (id: string) => {
    get()._triggerUpload(id);
  },

  removeFile: (id: string) => {
    // Clean up object URLs if they exist
    const file = get().uploadingFiles.find(f => f.id === id);
    if (file?.url) {
      URL.revokeObjectURL(file.url);
    }
    
    set((state) => ({
      uploadingFiles: state.uploadingFiles.filter((f) => f.id !== id),
    }));
  },
}));