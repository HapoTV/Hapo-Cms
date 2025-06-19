// src/features/content/store/upload.store.ts
import { create } from 'zustand';
import { uploadFileToS3 } from '../../../services/s3.ts';
import { getBackendFileType } from '../util/fileUtils.ts'; // Import the new utility

export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'queued' | 'uploading' | 'error' | 'success';
  error?: string;
  url?: string; // The final S3 URL
  backendFileType?: string | null; // The type for our backend (e.g., 'MP4')
}

interface UploadState {
  uploadingFiles: UploadingFile[];
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  retryUpload: (id: string) => void;
  _triggerUpload: (id: string) => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  uploadingFiles: [],

  addFiles: (files: File[]) => {
    const newFiles: UploadingFile[] = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      progress: 0,
      status: 'queued',
    }));

    set((state) => ({
      uploadingFiles: [...state.uploadingFiles, ...newFiles],
    }));

    newFiles.forEach((file) => get()._triggerUpload(file.id));
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
      const onProgress = (progress: number) => {
        set((state) => ({
          uploadingFiles: state.uploadingFiles.map((f) =>
            f.id === id ? { ...f, progress } : f
          ),
        }));
      };

      const url = await uploadFileToS3(fileToUpload.file, onProgress);

      // *** NEW: Get the mapped backend file type ***
      const backendFileType = getBackendFileType(fileToUpload.file.type);

      set((state) => ({
        uploadingFiles: state.uploadingFiles.map((f) =>
          f.id === id
            ? { ...f, status: 'success', progress: 100, url, backendFileType } // <-- Store it
            : f
        ),
      }));
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
    set((state) => ({
      uploadingFiles: state.uploadingFiles.filter((f) => f.id !== id),
    }));
  },
}));