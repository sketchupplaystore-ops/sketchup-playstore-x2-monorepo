/**
 * Uploads a file to a presigned URL (S3/Wasabi compatible)
 * 
 * @param url - The presigned URL to upload to
 * @param file - The file or blob to upload
 * @param contentType - The content type of the file
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns A promise that resolves when the upload is complete
 * @throws Error with status and statusText if upload fails
 */
export async function putPresigned(
  url: string, 
  file: File | Blob, 
  contentType: string, 
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Create XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();
    
    // Set up progress tracking
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          // Calculate percentage (0-100)
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      });
    }
    
    // Set up completion handler
    xhr.addEventListener('load', () => {
      // S3/Wasabi returns 200 or 204 on success
      if (xhr.status === 200 || xhr.status === 204) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });
    
    // Set up error handler
    xhr.addEventListener('error', () => {
      reject(new Error(`Upload failed: Network error`));
    });
    
    // Set up abort handler
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });
    
    // Open the request (PUT method for S3/Wasabi)
    xhr.open('PUT', url);
    
    // Set content type header
    xhr.setRequestHeader('Content-Type', contentType);
    
    // Send the file
    xhr.send(file);
  });
}
