import React, { useState, useRef, useCallback } from 'react';
import { X, Camera } from 'lucide-react';
import { uploadImage } from '../../lib/api';

interface ImageUploadProps {
  onImageUploaded?: (imageUrl: string) => void;
  currentImage?: string;
  className?: string;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  disabled?: boolean;
  variant?: 'square' | 'circle' | 'rounded';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showRemoveButton?: boolean;
  placeholder?: string;
  title?: string;
  showTitle?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImage,
  className = '',
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  disabled = false,
  variant = 'circle',
  size = 'lg',
  showRemoveButton = false,
  placeholder = 'Chọn hoặc kéo thả ảnh vào đây',
  title = 'Profile Photo',
  showTitle = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>(currentImage || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const [lastUploadedFile, setLastUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  const variantClasses = {
    square: 'rounded-none',
    circle: 'rounded-full',
    rounded: 'rounded-lg'
  };

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Chỉ chấp nhận các định dạng: ${acceptedTypes.map(type => type.split('/')[1]).join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Kích thước ảnh không được vượt quá ${maxSize}MB`);
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server
      const imageUrl = await uploadImage(file);

      // Lưu file để có thể retry nếu cần
      setLastUploadedFile(file);

      // Call callback
      onImageUploaded?.(imageUrl);
    } catch (err: any) {
      console.error('Upload error details:', err);

      // Xử lý các loại lỗi khác nhau
      let errorMessage = 'Lỗi upload ảnh';

      if (err.message?.includes('ENOENT') || err.message?.includes('no such file or directory')) {
        errorMessage = 'Lỗi server: Thư mục uploads chưa được cấu hình. Vui lòng liên hệ admin.';
      } else if (err.message?.includes('413')) {
        errorMessage = 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn 5MB.';
      } else if (err.message?.includes('415')) {
        errorMessage = 'Định dạng ảnh không được hỗ trợ. Chỉ chấp nhận JPG, PNG, GIF, WebP.';
      } else if (err.message?.includes('401') || err.message?.includes('403')) {
        errorMessage = 'Không có quyền upload. Vui lòng đăng nhập lại.';
      } else if (err.message?.includes('500')) {
        errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setPreviewImage(currentImage || '');
    } finally {
      setIsUploading(false);
    }
  }, [acceptedTypes, maxSize, onImageUploaded, currentImage]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemove = useCallback(() => {
    setPreviewImage('');
    setError('');
    setLastUploadedFile(null);
    onImageUploaded?.('');
  }, [onImageUploaded]);

  // Hàm retry upload với file cuối cùng
  const handleRetryUpload = useCallback(async () => {
    if (lastUploadedFile) {
      setError('');
      await handleFileSelect(lastUploadedFile);
    } else {
      setError('');
    }
  }, [lastUploadedFile, handleFileSelect]);

  return (
    <div className={`relative ${className}`}>
      {showTitle && (
        <h3 className="text-center font-medium text-lg mb-2">{title}</h3>
      )}
      <div className="relative">
        <div
          className={`
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${isUploading ? 'pointer-events-none' : ''}
            flex flex-col items-center justify-center
            overflow-hidden
            transition-all duration-200
            relative
            mx-auto
            ${previewImage ? 'bg-white' : 'bg-gray-100'}
            shadow-lg
            outline-none
            border-0
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          {previewImage ? (
            <>
              <img
                src={previewImage}
                alt="Preview"
                className={`w-full h-full object-cover ${variantClasses[variant]}`}
                style={{ objectFit: 'cover' }}
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
              {showRemoveButton && !disabled && (
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-black transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-center">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mb-1"></div>
                  <p className="text-xs text-gray-600">Đang upload...</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-500" />
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Camera button overlay */}
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">⚠️ Lỗi upload ảnh</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
          {error.includes('Thư mục uploads chưa được cấu hình') && (
            <div className="mt-2 text-xs text-gray-600">
              <p className="font-medium">💡 Khắc phục:</p>
              <p>• Liên hệ admin để cấu hình thư mục uploads</p>
              <p>• Hoặc thử lại sau khi server được cập nhật</p>
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                onClick={handleRetryUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Đang thử...' : 'Thử lại'}
              </button>
            </div>
          )}
          {error.includes('kích thước') && (
            <div className="mt-2 text-xs text-gray-600">
              <p className="font-medium">💡 Khắc phục:</p>
              <p>• Chọn ảnh có kích thước nhỏ hơn {maxSize}MB</p>
              <p>• Nén ảnh trước khi upload</p>
            </div>
          )}
          {error.includes('Lỗi server nội bộ') && (
            <div className="mt-2 text-xs text-gray-600">
              <p className="font-medium">💡 Khắc phục:</p>
              <p>• Thử lại sau vài phút</p>
              <p>• Liên hệ admin nếu lỗi vẫn tiếp tục</p>
              <button
                type="button"
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                onClick={handleRetryUpload}
                disabled={isUploading}
              >
                {isUploading ? 'Đang thử...' : 'Thử lại'}
              </button>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  );
};
