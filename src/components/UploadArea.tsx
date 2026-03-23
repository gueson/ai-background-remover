"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBackgroundRemoval } from "@/hooks/useBackgroundRemoval";
import ImagePreview from "./ImagePreview";

interface UploadAreaProps {
  onResult: (result: any) => void;
}

export function UploadArea({ onResult }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { status, result, error, removeBackground } = useBackgroundRemoval();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        removeBackground(file);
      }
    }
  }, [removeBackground]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      removeBackground(file);
    }
  }, [removeBackground]);

  // Pass result to parent component
  React.useEffect(() => {
    if (result) {
      onResult(result);
    }
  }, [result, onResult]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Upload Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center justify-center">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold mb-2">
              Drag & drop your image here
            </h3>
            <p className="text-gray-600 mb-6">or click to select a file</p>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button size="lg" className="cursor-pointer">
                Choose Image
              </Button>
            </label>

            {status === "loading" && (
              <div className="mt-6 text-blue-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Processing image...</p>
              </div>
            )}

            {error && (
              <div className="mt-6 text-red-600">
                <p>Error: {error.message}</p>
              </div>
            )}

            {previewUrl && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <img
                  src={previewUrl}
                  alt="Upload preview"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}