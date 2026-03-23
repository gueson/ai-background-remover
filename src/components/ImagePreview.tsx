"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ImagePreviewProps {
  original: string;
  processed: string;
  onDownload: () => void;
  onReset: () => void;
}

export function ImagePreview({
  original,
  processed,
  onDownload,
  onReset,
}: ImagePreviewProps) {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-center">Original</h3>
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-64">
              <img
                src={original}
                alt="Original"
                className="max-w-full max-h-96 object-contain"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2 text-center">Processed</h3>
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-64">
              <img
                src={processed}
                alt="Background removed"
                className="max-w-full max-h-96 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" onClick={onReset}>
            Start Over
          </Button>
          <Button onClick={onDownload} className="bg-blue-500 hover:bg-blue-600">
            Download PNG
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}