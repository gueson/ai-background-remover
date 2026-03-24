'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import ImagePreview from '@/components/ImagePreview';
import { removeImageBackground } from '@/lib/backgroundRemoval';

export default function UploadArea() {
  const [isDragging, setIsDragging] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setError(null);
    setProcessing(true);

    try {
      // Create preview URL for original image
      const originalUrl = URL.createObjectURL(file);
      setOriginalImage(originalUrl);

      // Call background removal API
      const resultBlob = await removeImageBackground(file);
      const processedUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(processedUrl);
    } catch (err) {
      console.error('Background removal failed:', err);
      setError('Failed to remove background. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Show result view
  if (originalImage && processedImage) {
    return (
      <ImagePreview
        original={originalImage}
        processed={processedImage}
        onDownload={handleDownload}
        onReset={handleReset}
      />
    );
  }

  // Show upload view
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-all ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">
              📷
            </div>
            <h3 className="text-lg font-semibold mb-2">Drag image here</h3>
            <p className="text-gray-600 mb-4">or click to upload</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button onClick={() => document.getElementById('file-upload')?.click()}>
              Select File
            </Button>
          </div>
        </div>

        {processing && (
          <div className="mt-6">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Removing background...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
