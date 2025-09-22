'use client'

import { useState, useRef } from 'react'
import { uploadAvatar, deleteAvatar, type UploadResult } from '@/lib/avatar'

interface AvatarUploadProps {
  currentAvatarUrl?: string | undefined
  userId: string
  onUploadSuccess: (newAvatarUrl: string) => void
  onUploadError: (error: string) => void
}

export default function AvatarUpload({
  currentAvatarUrl,
  userId,
  onUploadSuccess,
  onUploadError
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Create preview
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)

    // Start upload
    setIsUploading(true)

    try {
      const result: UploadResult = await uploadAvatar(file, userId)

      if (result.success && result.url) {
        // Clean up preview
        URL.revokeObjectURL(preview)
        setPreviewUrl(null)

        // Delete old avatar if it exists
        if (currentAvatarUrl) {
          await deleteAvatar(currentAvatarUrl)
        }

        onUploadSuccess(result.url)
      } else {
        // Clean up preview on error
        URL.revokeObjectURL(preview)
        setPreviewUrl(null)
        onUploadError(result.error || 'Upload failed')
      }
    } catch (error) {
      // Clean up preview on error
      URL.revokeObjectURL(preview)
      setPreviewUrl(null)
      onUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const displayUrl = previewUrl || currentAvatarUrl

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        {displayUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayUrl}
              alt="Avatar"
              className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
            />
          </>
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload New Picture'}
        </button>
        <p className="mt-1 text-xs text-gray-500">
          JPEG, PNG, or WebP up to 5MB
        </p>
      </div>
    </div>
  )
}