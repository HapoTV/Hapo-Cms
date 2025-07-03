import axios from 'axios'; // We still need axios for the direct S3 upload
import apiService from './api.service'; // Use our central API client

/**
 * @file This service handles all interactions with AWS S3,
 * using our backend as a proxy for generating pre-signed URLs and deletions.
 *
 * @path src/services/s3.service.ts
 */

/**
 * Uploads a file to AWS S3 using a pre-signed URL from our backend.
 * @param file The file to be uploaded.
 * @param prefix The S3 folder/prefix to store the file in (e.g., 'audio/').
 * @param onProgress Callback function to track upload progress (0-100).
 * @returns The final, clean URL of the uploaded file on S3.
 */
export const uploadFileToS3 = async (
  file: File,
  prefix: string = 'uploads/', // Default prefix if none is provided
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    // We construct the full file name including the prefix.
    const fullFileName = `${prefix}${file.name}`;

    // 1️⃣ Get pre-signed URL from OUR backend, now with the full file name.
    const response = await apiService.post<{ url: string }>(
        `/s3/presigned-url`,
      null,
        // The backend will generate a URL for the path 'prefix/fileName.ext'
        {params: {fileName: fullFileName, contentType: file.type}}
    );

    const presignedUrl = response.url;

    // 2️⃣ Upload file directly to S3 using the pre-signed URL.
    await axios.put(presignedUrl, file, {
      headers: {'Content-Type': file.type},
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    // 3️⃣ Return the base URL of the file.
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
    // 1. Get the presigned DELETE URL from our backend
    console.log(`Requesting presigned DELETE URL for key: ${fileKey}`);
    const response = await apiService.post<{ url: string }>(
        '/s3/presigned-delete-url', // This matches your Spring Boot @PostMapping
        null, // No body needed for this POST request
        {params: {fileKey}}
    );

    const presignedDeleteUrl = response.url;
    console.log(`Received presigned DELETE URL. Deleting from S3...`);

    // 2. Use the received URL to perform the DELETE operation directly on S3
    await axios.delete(presignedDeleteUrl);

    console.log(`Successfully deleted ${fileKey} from S3.`);
  } catch (error) {
    console.error(`Failed to delete file from S3 with key: ${fileKey}`, error);
    // Re-throw the error so the calling function in the store knows the operation failed.
    throw new Error('Failed to delete file from S3.');
  }
};

