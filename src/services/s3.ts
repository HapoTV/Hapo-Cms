import axios from "axios";

const API_BASE_URL = "http://localhost:8080/s3"; // Update with your backend URL

/**
 * Uploads a file to AWS S3 using a pre-signed URL.
 * @param file The file to be uploaded.
 * @param onProgress Callback function to track upload progress.
 * @returns The uploaded file URL.
 */
export const uploadFileToS3 = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<string> => {
    try {
        // 1️⃣ Get pre-signed URL from the backend
        const { data } = await axios.post(`${API_BASE_URL}/presigned-url`, null, {
            params: { fileName: file.name, contentType: file.type },
        });

        const presignedUrl = data.url;

        // 2️⃣ Upload file to S3 using the pre-signed URL
        await axios.put(presignedUrl, file, {
            headers: {
                "Content-Type": file.type,
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

        // 3️⃣ Return the file URL for storage in the database
        return presignedUrl.split("?")[0]; // Remove query params from URL
    } catch (error) {
        console.error("Upload error:", error);
        throw new Error("Failed to upload file to S3");
    }
};

/**
 * Deletes a file from AWS S3 via the backend.
 * @param fileKey The file key (path) to delete.
 */
export const deleteFileFromS3 = async (fileKey: string): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/delete-object`, {
            params: { fileKey },
        });
        console.log("File deleted successfully");
    } catch (error) {
        console.error("Delete error:", error);
        throw new Error("Failed to delete file from S3");
    }
};
