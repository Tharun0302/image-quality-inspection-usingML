import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

export default function Upload({ onFileSelect }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  return (
    <div 
      {...getRootProps()} 
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300
        ${isDragActive ? 'border-primary bg-primary/20 flex-col items-center justify-center' : 'border-secondary bg-white/40 hover:bg-white/60 hover:border-accent shadow-sm hover:shadow-md'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-primary/20 text-primary' : 'bg-secondary/40 text-accent group-hover:bg-accent/20'}`}>
          {isDragActive ? (
            <UploadCloud className="w-12 h-12 animate-bounce" />
          ) : (
            <ImageIcon className="w-12 h-12" />
          )}
        </div>
        <div>
          <p className="text-xl font-bold tracking-wide">
            {isDragActive ? 'Drop your image here' : 'Drag & drop an image here'}
          </p>
          <p className="text-sm mt-2 font-medium opacity-80">
            or <span className="text-primary hover:underline">browse files</span> (JPG, PNG, WEBP up to 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
