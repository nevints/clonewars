import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'info' | 'success';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[120] flex items-center gap-3 bg-[#1e1e1e] text-white px-5 py-3.5 rounded-lg shadow-2xl border border-neutral-700 animate-bounce duration-300">
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-[#e50914] shrink-0" />
      ) : (
        <Info className="w-5 h-5 text-blue-400 shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
