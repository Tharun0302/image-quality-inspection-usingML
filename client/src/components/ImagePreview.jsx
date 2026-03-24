import React from 'react';

export default function ImagePreview({ file, previewUrl }) {
  if (!file && !previewUrl) return null;

  const url = previewUrl || (file ? URL.createObjectURL(file) : null);

  return (
    <div className="w-full h-auto rounded-2xl overflow-hidden border border-secondary bg-white/40 shadow-xl group transition-all duration-300 hover:border-accent p-2">
      <img 
        src={url} 
        alt="Preview" 
        className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-md"
      />
      {file && (
        <div className="mt-4 px-4 pb-2 flex justify-between items-center text-sm">
          <span className="truncate pr-4 font-bold">{file.name}</span>
          <span className="whitespace-nowrap bg-secondary/30 text-foreground px-3 py-1 rounded-lg font-mono font-bold">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      )}
    </div>
  );
}
