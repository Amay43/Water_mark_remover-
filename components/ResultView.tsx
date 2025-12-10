import React, { useState } from 'react';
import { Download, RefreshCw, AlertTriangle, Wand2, X } from 'lucide-react';
import { ImageFile } from '../types';

interface ResultViewProps {
  originalImage: ImageFile;
  processedImageUrl: string | null;
  status: 'idle' | 'processing' | 'success' | 'error';
  errorMessage?: string;
  onReset: () => void;
  onRetry: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ 
  originalImage, 
  processedImageUrl, 
  status, 
  errorMessage,
  onReset,
  onRetry
}) => {
  const [activeTab, setActiveTab] = useState<'original' | 'result'>('result');

  const handleDownload = () => {
    if (processedImageUrl) {
      const link = document.createElement('a');
      link.href = processedImageUrl;
      link.download = `clearview-cleaned-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-slate-100 p-4 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
            <button
                onClick={onReset}
                className="text-slate-500 hover:text-slate-700 p-2 rounded-full hover:bg-slate-200 transition-colors"
                title="Start Over"
            >
                <X className="w-5 h-5" />
            </button>
            <h2 className="font-semibold text-slate-800">Result</h2>
        </div>
        
        {status === 'success' && (
            <div className="flex bg-slate-200 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('original')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                        activeTab === 'original' 
                        ? 'bg-white text-slate-900 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Original
                </button>
                <button
                    onClick={() => setActiveTab('result')}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                        activeTab === 'result' 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    Result
                </button>
            </div>
        )}

        <div className="w-10"></div> {/* Spacer for balance */}
      </div>

      {/* Content Area */}
      <div className="relative min-h-[400px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50">
        
        {/* Processing State */}
        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center p-8 z-10">
             <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Wand2 className="w-6 h-6 text-indigo-600 animate-pulse" />
                </div>
             </div>
             <p className="mt-6 text-lg font-medium text-slate-800">Removing watermark...</p>
             <p className="text-slate-500 text-sm mt-1">This uses complex AI and may take up to 30 seconds.</p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="text-center p-8 max-w-md">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Processing Failed</h3>
            <p className="text-slate-500 mb-6">{errorMessage || 'Something went wrong while processing the image.'}</p>
            <div className="flex gap-3 justify-center">
                <button 
                    onClick={onReset}
                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                >
                    Try another image
                </button>
                <button 
                    onClick={onRetry}
                    className="px-4 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
                >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                </button>
            </div>
          </div>
        )}

        {/* Image Display */}
        {(status === 'success' || (status === 'processing' && activeTab === 'original')) && (
          <div className="relative w-full h-full p-4 flex items-center justify-center">
             {activeTab === 'original' ? (
                <img 
                    src={originalImage.previewUrl} 
                    alt="Original" 
                    className="max-h-[600px] w-auto object-contain rounded-lg shadow-sm border border-slate-200"
                />
             ) : (
                processedImageUrl && (
                    <img 
                        src={processedImageUrl} 
                        alt="Cleaned" 
                        className="max-h-[600px] w-auto object-contain rounded-lg shadow-lg border border-indigo-100"
                    />
                )
             )}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      {status === 'success' && (
        <div className="border-t border-slate-100 p-6 bg-white flex justify-between items-center">
             <div className="text-sm text-slate-500">
                <span className="font-medium text-indigo-600">Tip:</span> If the result isn't perfect, try running it again.
             </div>
             <div className="flex gap-3">
                <button
                    onClick={onRetry}
                    className="px-5 py-2.5 text-slate-700 font-medium hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 transition-all"
                >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                </button>
                <button
                    onClick={handleDownload}
                    className="px-5 py-2.5 bg-indigo-600 text-white font-medium hover:bg-indigo-700 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5"
                >
                    <Download className="w-4 h-4" />
                    Download HD
                </button>
             </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;
