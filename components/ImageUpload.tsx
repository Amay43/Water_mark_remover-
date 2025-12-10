import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { processFile } from '../utils/fileUtils';
import { ImageFile } from '../types';

interface ImageUploadProps {
  onImageSelected: (image: ImageFile) => void;
  isProcessing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateAndProcess = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPEG, WEBP).');
      return;
    }
    // Limit size to ~5MB to avoid base64 performance issues handled poorly by some browsers
    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Please upload an image under 5MB.');
      return;
    }

    try {
      const processedImage = await processFile(file);
      onImageSelected(processedImage);
    } catch (err) {
      console.error(err);
      setError('Failed to process image. Please try again.');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await validateAndProcess(e.target.files[0]);
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ease-in-out
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-400 hover:bg-slate-50'}
          ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-300 bg-white'}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-indigo-200' : 'bg-indigo-50'}`}>
            {isDragging ? (
               <ImageIcon className="w-10 h-10 text-indigo-600" />
            ) : (
               <Upload className="w-10 h-10 text-indigo-600" />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {isDragging ? 'Drop image here' : 'Upload an image'}
            </h3>
            <p className="text-slate-500 text-sm">
              Drag and drop or click to browse
            </p>
          </div>
          
          <div className="flex gap-2 text-xs text-slate-400">
            <span className="bg-slate-100 px-2 py-1 rounded">PNG</span>
            <span className="bg-slate-100 px-2 py-1 rounded">JPG</span>
            <span className="bg-slate-100 px-2 py-1 rounded">WEBP</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
