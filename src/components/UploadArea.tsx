'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import ImagePreview from '@/components/ImagePreview';
import { removeImageBackground } from '@/lib/backgroundRemoval';
import { getQuotaInfo, recordUsage, QuotaInfo } from '@/lib/quota';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function UploadArea() {
  const [isDragging, setIsDragging] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load quota info on mount
  useEffect(() => {
    getQuotaInfo().then(q => setQuota(q as any));
  }, []);

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

  const checkQuotaAndProcess = async (file: File): Promise<boolean> => {
    const quotaInfo = await getQuotaInfo();
    setQuota(quotaInfo as any);

    if (!quotaInfo.allowed) {
      setShowQuotaModal(true);
      return false;
    }

    return true;
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

    // Check quota first
    const canProcess = await checkQuotaAndProcess(file);
    if (!canProcess) return;

    setError(null);
    setProcessing(true);

    try {
      // Create preview URL for original image
      const originalUrl = URL.createObjectURL(file);
      setOriginalImage(originalUrl);

      let resultBlob: Blob;

      // Check if user is PRO - use backend AI processing
      const quotaInfo = await getQuotaInfo();
      if (quotaInfo?.type === 'registered' && quotaInfo.isPro) {
        // PRO user - call backend for AI processing
        const result = await processWithAI(file);
        resultBlob = result;
      } else {
        // Free/anonymous user - use Canvas API
        resultBlob = await removeImageBackground(file);
      }

      const processedUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(processedUrl);

      // Record usage
      await recordUsage(file.size);
      
      // Refresh quota info
      const newQuota = await getQuotaInfo();
      setQuota(newQuota as any);
    } catch (err) {
      console.error('Background removal failed:', err);
      setError('Failed to remove background. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Call backend AI processing for PRO users
  const processWithAI = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const token = localStorage.getItem('supabase_access_token');
          
          const response = await fetch(`${API_URL}/api/process`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ image: `data:${file.type};base64,${base64}` }),
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'AI processing failed');
          }

          const result = await response.json();
          // result.data.resultUrl is a data URL (data:image/png;base64,...)
          const binary = atob(result.data.resultUrl.split(',')[1]);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }
          resolve(new Blob([bytes], { type: 'image/png' }));
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
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

  const getQuotaDisplay = () => {
    if (!quota) return null;
    
    const { used, dailyLimit, remaining, isPro } = quota as any;
    const type = (quota as any).type || 'anonymous';
    const limit = dailyLimit ?? (isPro ? 50 : 5);
    
    return (
      <div className={`text-sm mb-4 px-3 py-2 rounded-lg ${
        remaining === 0 ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {type === 'anonymous' && <span>👤 Anonymous: </span>}
        {type === 'registered' && !isPro && <span>👤 Free account: </span>}
        {type === 'registered' && isPro && <span>⭐ PRO: </span>}
        <span>{remaining ?? '∞'} / {limit} daily uses remaining</span>
        {isPro && <span className="ml-2 text-xs">(AI quality)</span>}
      </div>
    );
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

  // Quota exceeded modal
  if (showQuotaModal) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Daily Quota Exceeded</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            You've used all your free daily background removal credits.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-amber-800 mb-2">💡 Upgrade to PRO</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>✓ 50 AI-powered background removals daily</li>
              <li>✓ Higher quality AI processing (not Canvas)</li>
              <li>✓ Unlimited access on all devices</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/pricing" className="flex-1">
              <Button className="w-full">View Plans</Button>
            </Link>
          </div>
          <button
            onClick={() => setShowQuotaModal(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Continue with limited features
          </button>
        </CardContent>
      </Card>
    );
  }

  // Show upload view
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>Upload Image</CardTitle>
      </CardHeader>
      <CardContent>
        {getQuotaDisplay()}
        
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
