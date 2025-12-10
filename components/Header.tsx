import React from 'react';
import { Eraser } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Eraser className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">ClearView AI</span>
        </div>
        <nav>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
                How it works
            </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
