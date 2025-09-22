import { supabase } from './supabase'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export const uploadAvatar = async (file: File, userId: string): Promise<UploadResult> => {
  try {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Please upload a valid image file (JPEG, PNG, or WebP)'
      }
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File size must be less than 5MB'
      }
    }

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${userId}-${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return {
      success: true,
      url: publicUrl
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

export const deleteAvatar = async (avatarUrl: string): Promise<boolean> => {
  try {
    const url = new URL(avatarUrl)
    const pathParts = url.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]

    if (!fileName) {
      return false
    }

    const { error } = await supabase.storage
      .from('avatars')
      .remove([fileName])

    return !error
  } catch (error) {
    return false
  }
}