'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { toggleBookmark, isRecipeBookmarked, getBookmarkCount } from '@/lib/actions/bookmark'
import { useRouter } from 'next/navigation'

interface BookmarkButtonProps {
  recipeId: string
}

export default function BookmarkButton({ recipeId }: BookmarkButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch initial bookmark state and count
  useEffect(() => {
    async function fetchBookmarkData() {
      setIsLoading(true)

      // Get bookmark count
      const count = await getBookmarkCount(recipeId)
      setBookmarkCount(count)

      // Check if user has bookmarked (only if logged in)
      if (user) {
        const bookmarked = await isRecipeBookmarked(user.id, recipeId)
        setIsBookmarked(bookmarked)
      }

      setIsLoading(false)
    }

    fetchBookmarkData()
  }, [recipeId, user])

  const handleToggleBookmark = async () => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Optimistic UI update
    const previousIsBookmarked = isBookmarked
    const previousCount = bookmarkCount

    setIsBookmarked(!isBookmarked)
    setBookmarkCount(isBookmarked ? bookmarkCount - 1 : bookmarkCount + 1)

    // Attempt to toggle bookmark
    const success = await toggleBookmark(user.id, recipeId)

    // Revert if failed
    if (!success) {
      setIsBookmarked(previousIsBookmarked)
      setBookmarkCount(previousCount)
      alert('Failed to update bookmark. Please try again.')
    }
  }

  return (
    <button
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isBookmarked
          ? 'bg-orange-600 text-white hover:bg-orange-700'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isBookmarked ? (
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M5 5c0-1.1.9-2 2-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      )}
      <span>
        {isBookmarked ? 'Bookmarked' : 'Bookmark'} ({bookmarkCount})
      </span>
    </button>
  )
}
