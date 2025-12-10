export interface ProcessedImage {
  originalUrl: string;
  processedUrl: string | null;
  status: 'idle' | 'processing' | 'success' | 'error';
  errorMessage?: string;
}

export interface ImageFile {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}
