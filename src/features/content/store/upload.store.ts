// src/features/content/store/upload.store.ts
import {create} from 'zustand';
import {v4 as uuidv4} from 'uuid';
import * as mm from 'music-metadata-browser';
import {uploadFileToS3} from '../../../services/s3';
import {getBackendFileType, getCategoryFromMime} from '../util/fileTypeUtils';

// ... (keep UploadingFile interface, adding metadata from music-metadata)
export interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'queued' | 'uploading' | 'error' | 'success' | 'saving';
  error?: string;
  url?: string;
  albumArtUrl?: string;
  backendFileType?: string | null;
  // NEW: Add fields extracted from music-metadata
  extractedMetadata?: {
    title: string;
    artist?: string;
    album?: string;
    duration: number;
  }
}

// ... (keep the extractAndUploadAlbumArt helper function, BUT add prefixing)
// Modify it to accept a prefix for where to store the album art.
const extractAndUploadAlbumArt = async (file: File): Promise<{
  artUrl?: string,
  metadata?: UploadingFile['extractedMetadata']
}> => {
  try {
    const metadata = await mm.parseBlob(file);
    const picture = metadata.common.picture?.[0];
    let artUrl: string | undefined;

    if (picture) {
      const blob = new Blob([picture.data], {type: picture.format});
      const fileExtension = picture.format.split('/')[1] || 'jpg';
      const albumArtFile = new File([blob], `album-art-${uuidv4()}.${fileExtension}`, {type: picture.format});
      // Store album art in a dedicated 'album-art/' folder
      artUrl = await uploadFileToS3(albumArtFile, 'album-art/');
    }

    const extractedMetadata = {
      title: metadata.common.title || file.name.replace(/\.[^/.]+$/, ""),
      artist: metadata.common.artist,
      album: metadata.common.album,
      duration: metadata.format.duration || 0,
    }

    return {artUrl, metadata: extractedMetadata};

  } catch (error) {
    console.warn("Could not parse music metadata, using fallback.", error);
    const fallbackMetadata = {
      title: file.name.replace(/\.[^/.]+$/, ""),
      duration: 0,
    }
    return {artUrl: undefined, metadata: fallbackMetadata};
  }
};


interface UploadState {
  uploadingFiles: UploadingFile[];
  // NEW: The file currently being edited in the modal
  fileForMetadata: UploadingFile | null;
  setFileForMetadata: (file: UploadingFile | null) => void;
  // ---
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  updateFileStatus: (id: string, status: UploadingFile['status']) => void;
  retryUpload: (id: string) => void;
  _triggerUpload: (id: string) => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  uploadingFiles: [],
  fileForMetadata: null,
  setFileForMetadata: (file) => set({fileForMetadata: file}),

  addFiles: (files: File[]) => {
    const newFiles: UploadingFile[] = files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${uuidv4()}`,
      file,
      progress: 0,
      status: 'queued',
    }));
    set((state) => ({uploadingFiles: [...state.uploadingFiles, ...newFiles]}));
    newFiles.forEach((file) => get()._triggerUpload(file.id));
  },

  updateFileStatus: (id, status) => {
    set(state => ({
      uploadingFiles: state.uploadingFiles.map(f =>
          f.id === id ? {...f, status} : f
      )
    }));
  },

  // --- THE CORE LOGIC CHANGE ---
  _triggerUpload: async (id: string) => {
    const fileToUpload = get().uploadingFiles.find((f) => f.id === id);
    if (!fileToUpload || fileToUpload.status === 'uploading') return;

    set((state) => ({
      uploadingFiles: state.uploadingFiles.map((f) =>
        f.id === id ? { ...f, status: 'uploading', progress: 0 } : f
      ),
    }));

    try {
      // Get the category to use as the S3 prefix
      const fileCategory = getCategoryFromMime(fileToUpload.file.type) || 'other';
      const s3Prefix = `${fileCategory.toLowerCase()}/`;

      const mainFileUrl = await uploadFileToS3(
          fileToUpload.file,
          s3Prefix,
          (progress) => {
            set((state) => ({
              uploadingFiles: state.uploadingFiles.map((f) =>
                  f.id === id ? {...f, progress} : f
              ),
            }));
          }
      );

      let albumArtUrl: string | undefined;
      let extractedMetadata: UploadingFile['extractedMetadata'] | undefined;

      // Check if it's audio to extract metadata
      if (fileCategory === 'AUDIO') {
        const result = await extractAndUploadAlbumArt(fileToUpload.file);
        albumArtUrl = result.artUrl;
        extractedMetadata = result.metadata;
      }

      const backendFileType = getBackendFileType(fileToUpload.file.type);

      // Create the final file object for the modal
      const successFile: UploadingFile = {
        ...fileToUpload,
        status: 'success',
        progress: 100,
        url: mainFileUrl,
        albumArtUrl,
        backendFileType,
        extractedMetadata
      };

      // Update the list
      set(state => ({
        uploadingFiles: state.uploadingFiles.map(f => (f.id === id ? successFile : f))
      }));

      // Automatically open the modal if no other modal is already open.
      if (!get().fileForMetadata) {
        get().setFileForMetadata(successFile);
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
    set((state) => ({
      uploadingFiles: state.uploadingFiles.filter((f) => f.id !== id),
    }));
  },
}));