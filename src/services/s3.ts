import axios from 'axios'; // We still need axios for the direct S3 upload
import apiService from './api.service'; // Use our central API client

/**
 * @file This service handles all interactions with AWS S3,
 * using our backend as a proxy for generating pre-signed URLs and deletions.
 *
 * @path src/services/s3.service.ts
 */

// This interface is just for the pre-signed URL response from our backend.
interface PresignedUrlResponse {
  url: string;
}

/**
 * Uploads a file to AWS S3 using a pre-signed URL from our backend.
 * @param file The file to be uploaded.
 * @param onProgress Callback function to track upload progress (0-100).
 * @returns The final, clean URL of the uploaded file on S3.
 */
export const uploadFileToS3 = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // 1️⃣ Get pre-signed URL from OUR backend.
    // This call is authenticated and handled by apiService.
    const response = await apiService.post<PresignedUrlResponse>(
      `/s3/presigned-url`, // Assuming this is your backend endpoint
      null,
      { params: { fileName: file.name, contentType: file.type } }
    );

    const presignedUrl = response.url;

    // 2️⃣ Upload file directly to S3 using the pre-signed URL.
    // This uses a raw axios.put because it's a request to AWS S3, not our API.
    // It doesn't need our JWT token; authentication is handled by the URL's signature.
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    // 3️⃣ Return the base URL of the file, removing the temporary query parameters.
    return presignedUrl.split('?')[0];
  } catch (error) {
    console.error('Upload error:', error);
    // Provide a more specific error message if possible
    const errorMessage = error instanceof Error ? error.message : "Failed to upload file to S3";
    throw new Error(errorMessage);
  }
};

/**
 * Deletes a file from AWS S3 by making a request to our backend.
 * @param fileKey The file key (path in the bucket) to delete.
 */
export const deleteFileFromS3 = async (fileKey: string): Promise<void> => {
  try {
    // FIXED: Use apiService to ensure the request is authenticated.
    await apiService.delete(`/s3/delete-object`, {
      params: { fileKey },
    });
    console.log('File deleted successfully via backend.');
  } catch (error) {
    console.error('Delete error:', error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete file from S3";
    throw new Error(errorMessage);
  }
};