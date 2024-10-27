'use client';
// app/components/GifCreator.tsx
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/creategif/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/creategif/components/ui/card';

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
  const [progress, setProgress] = useState<number>(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files).sort((a, b) => a.name.localeCompare(b.name));

    if (!validateFiles(files)) {
      e.target.value = '';
      return;
    }

    setSelectedFiles(files);

    // 创建预览
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => {
      prev.forEach(url => URL.revokeObjectURL(url));
      return urls;
    });

    setResultGif(null);
    setError(null);
  };


  const validateFiles = (files: File[]): boolean => {
    if (files.length > maxFiles) {
      setError(`最多只能选择 ${maxFiles} 个文件`);
      return false;
    }

    for (const file of files) {
      // 只允许图片文件
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('只能选择 PNG, JPEG 或 WebP 图片');
        return false;
      }

      if (file.size > maxFileSize * 1024 * 1024) {
        setError(`文件大小不能超过 ${maxFileSize}MB`);
        return false;
      }
    }

    if (files.length < 2) {
      setError('请至少选择2张图片');
      return false;
    }

    setError(null);
    return true;
  };

  const createGif = async () => {
    if (selectedFiles.length === 0) {
      setError('请先选择图片');
      return;
    }

    if (selectedFiles.length < 2) {
      setError('请至少选择2张图片');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append('images', file);
        setProgress((index + 1) * 100 / selectedFiles.length);
      });

      const response = await fetch('/api/create-gif', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error details:', errorData);
        throw new Error(errorData.details || errorData.error || '生成GIF失败');
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error('生成的GIF为空');
      }

      const gifUrl = URL.createObjectURL(blob);
      setResultGif(gifUrl);

    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ?
        `生成GIF失败: ${err.message}` :
        '生成GIF时出错'
      );
    } finally {
      setLoading(false);
      setProgress(100);
    }
  };

  // 清理资源
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
          选择多个图片文件，将它们合成为一个 GIF 动画
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="image-upload"
            />
            <Button
              onClick={() => document.getElementById('image-upload')?.click()}
              variant="outline"
              disabled={loading}
            >
              选择图片
            </Button>
            <Button
              onClick={createGif}
              disabled={loading || selectedFiles.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  生成中...{progress}%
                </>
              ) : (
                '生成GIF'
              )}
            </Button>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {previewUrls.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">预览图片 ({previewUrls.length}张)</h4>
              <div className="grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <div className="absolute top-1 left-1 bg-black/50 text-white px-2 rounded text-sm">
                      {index + 1}
                    </div>
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

          {resultGif && !error && (
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
                  a.download = 'animated.gif';
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