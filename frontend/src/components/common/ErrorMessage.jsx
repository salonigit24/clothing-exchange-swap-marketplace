import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 my-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium px-3 py-1 rounded-lg transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
