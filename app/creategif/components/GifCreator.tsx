'use client';
// components/GifCreator.tsx
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/creategif/components/ui/Button';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/creategif/components/ui/Card';

interface GifCreatorProps {
  maxFileSize?: number;
  maxFiles?: number;
}

const GifCreator: React.FC<GifCreatorProps> = ({
  maxFileSize = 5,
  maxFiles = 10
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [resultGif, setResultGif] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: File[]): boolean => {
    if (files.length > maxFiles) {
      setError(`最多只能选择 ${maxFiles} 个文件`);
      return false;
    }

    for (const file of files) {
      if (!file.type.includes('png')) {
        setError('只能选择 PNG 格式的图片');
        return false;
      }

      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`文件大小不能超过 ${maxFileSize}MB`);
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    
    if (!validateFiles(files)) {
      e.target.value = '';
      return;
    }

    setSelectedFiles(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => {
      prev.forEach(url => URL.revokeObjectURL(url));
      return urls;
    });
    setResultGif(null);
  };

  const createGif = async () => {
    if (selectedFiles.length === 0) {
      setError('请先选择图片');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch('/api/create-gif', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const gifUrl = URL.createObjectURL(blob);
      setResultGif(gifUrl);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : '生成GIF时出错');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      if (resultGif) URL.revokeObjectURL(resultGif);
    };
  }, [previewUrls, resultGif]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>PNG 转 GIF 工具</CardTitle>
        <CardDescription>
          选择多个 PNG 图片，将它们合成为一个 GIF 动画
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/png"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <Button
              onClick={() => document.getElementById('image-upload')?.click()}
              variant="outline"
            >
              选择PNG图片
            </Button>
            <Button
              onClick={createGif}
              disabled={loading || selectedFiles.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                '生成GIF'
              )}
            </Button>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}

          {previewUrls.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">预览图片</h4>
              <div className="grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {resultGif && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">生成的GIF</h4>
              <img
                src={resultGif}
                alt="Generated GIF"
                className="w-full rounded-lg"
              />
              <Button
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = resultGif;
                  a.download = 'result.gif';
                  a.click();
                }}
              >
                下载GIF
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GifCreator;