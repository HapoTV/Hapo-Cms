// src/features/content/store/upload.store.ts

import {create} from 'zustand';
import {v4 as uuidv4} from 'uuid';
import * as mm from 'music-metadata-browser';
import {getBackendFileType} from '../util/fileTypeUtils';

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'queued' | 'uploading' | 'error' | 'success' | 'saving';
  error?: string;
    url?: string;           // Holds the final, permanent Supabase URL
    previewUrl?: string;    // Holds a temporary, local URL for instant previews
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
    addFiles: (files: File[]) => UploadingFile[];
  removeFile: (id: string) => void;
    updateFileStatus: (id: string, status: UploadingFile['status'], error?: string) => void;
    setFileUploadSuccess: (id: string, url: string) => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  uploadingFiles: [],
  fileForMetadata: null,
  setFileForMetadata: (file) => set({ fileForMetadata: file }),

    /**
     * Adds files to the queue, creates temporary preview URLs, and returns the
     * new file entries so the component can start processing them.
     */
    addFiles: (files) => {
    const newFiles: UploadingFile[] = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${uuidv4()}`,
      file,
      progress: 0,
      status: 'queued',
        previewUrl: URL.createObjectURL(file),
    }));
    set((state) => ({ uploadingFiles: [...state.uploadingFiles, ...newFiles] }));
        return newFiles;
  },

    /**
     * A generic action to update the status and optional error message of a file.
     */
    updateFileStatus: (id, status, error) => {
    set(state => ({
      uploadingFiles: state.uploadingFiles.map(f =>
          f.id === id ? {...f, status, error: error || f.error} : f
      )
    }));
  },

    /**
     * Called by the component when a Supabase upload is successful.
     * It updates the file's state to 'success', saves the permanent URL,
     * and extracts metadata.
     */
    setFileUploadSuccess: async (id, url) => {
        const fileToUpdate = get().uploadingFiles.find((f) => f.id === id);
        if (!fileToUpdate) return;

      let extractedMetadata: UploadingFile['extractedMetadata'] | undefined;
        if (fileToUpdate.file.type.startsWith('audio/')) {
            extractedMetadata = await extractMetadata(fileToUpdate.file);
      }
        const backendFileType = getBackendFileType(fileToUpdate.file.type);

        set(state => ({
            uploadingFiles: state.uploadingFiles.map(f =>
                    f.id === id ? {
                        ...f,
        status: 'success',
        progress: 100,
                        url, // The final, permanent Supabase URL
        backendFileType,
                        extractedMetadata
                    } : f
        )
      }));
  },

    /**
     * Removes a file from the queue and cleans up its temporary preview URL
     * to prevent memory leaks.
     */
    removeFile: (id) => {
    const file = get().uploadingFiles.find(f => f.id === id);
        if (file?.previewUrl) {
            URL.revokeObjectURL(file.previewUrl);
    }
    set((state) => ({
      uploadingFiles: state.uploadingFiles.filter((f) => f.id !== id),
        fileForMetadata: state.fileForMetadata?.id === id ? null : state.fileForMetadata,
    }));
  },
}));