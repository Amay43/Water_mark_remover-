import { ImageFile } from '../types';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data:image/xxx;base64, prefix to get raw base64
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const processFile = async (file: File): Promise<ImageFile> => {
  const base64 = await fileToBase64(file);
  const previewUrl = URL.createObjectURL(file);
  
  return {
    file,
    previewUrl,
    base64,
    mimeType: file.type,
  };
};
