import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import ResultView from './components/ResultView';
import { ImageFile, ProcessedImage } from './types';
import { removeWatermark } from './services/geminiService';

const App: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<ImageFile | null>(null);
  const [result, setResult] = useState<ProcessedImage>({
    originalUrl: '',
    processedUrl: null,
    status: 'idle',
  });

  const processImage = async (image: ImageFile) => {
    setResult({
      originalUrl: image.previewUrl,
      processedUrl: null,
      status: 'processing'
    });

    try {
      const cleanedBase64 = await removeWatermark(image.base64, image.mimeType);
      
      setResult(prev => ({
        ...prev,
        processedUrl: cleanedBase64,
        status: 'success'
      }));
    } catch (error) {
      console.error(error);
      let message = "An unexpected error occurred.";
      if (error instanceof Error) {
        // Handle common safety block errors gracefully
        if (error.message.includes("Candidate was blocked due to safety")) {
            message = "The AI could not process this image due to safety guidelines. Please try a different image.";
        } else {
            message = error.message;
        }
      }
      
      setResult(prev => ({
        ...prev,
        status: 'error',
        errorMessage: message
      }));
    }
  };

  const handleImageSelected = useCallback((image: ImageFile) => {
    setCurrentImage(image);
    processImage(image);
  }, []);

  const handleReset = () => {
    setCurrentImage(null);
    setResult({
      originalUrl: '',
      processedUrl: null,
      status: 'idle'
    });
  };

  const handleRetry = () => {
    if (currentImage) {
      processImage(currentImage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        
        {result.status === 'idle' ? (
          <>
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                Remove Watermarks <span className="text-indigo-600">Magically</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Upload any image with watermarks, logos, or text overlays. Our AI will reconstruct the background to give you a clean, professional image in seconds.
              </p>
            </div>

            <div className="w-full max-w-4xl animate-fade-in-up">
              <ImageUpload 
                onImageSelected={handleImageSelected} 
                isProcessing={false} 
              />
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full">
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
                <p className="text-slate-500">Powered by Gemini Flash 2.5, get results in seconds rather than minutes.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">AI Reconstruction</h3>
                <p className="text-slate-500">Doesn't just blur; it intelligently reconstructs the background behind the text.</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Private & Secure</h3>
                <p className="text-slate-500">Your images are processed securely and aren't stored on our servers.</p>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full animate-fade-in">
             <ResultView 
                originalImage={currentImage!} 
                processedImageUrl={result.processedUrl}
                status={result.status}
                errorMessage={result.errorMessage}
                onReset={handleReset}
                onRetry={handleRetry}
             />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} ClearView AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
