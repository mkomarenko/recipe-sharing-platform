'use client'

import { Header } from '@/app/components'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { getRecipesByUserId, deleteRecipe } from '@/lib/actions/recipe'
import { getUserBookmarkCount } from '@/lib/actions/bookmark'
import type { Recipe } from '@/lib/supabase'
import Image from 'next/image'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [bookmarkCount, setBookmarkCount] = useState(0)

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        router.push('/auth/login?redirectTo=/dashboard')
      }
    }, 15000) // 15 second timeout

    // If not loading and no user, redirect to login
    if (!loading && !user) {
      clearTimeout(timeout)
      router.push('/auth/login?redirectTo=/dashboard')
    }

    return () => clearTimeout(timeout)
  }, [user, loading, router])

  // Fetch user's recipes and bookmarks
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return

      setIsLoadingRecipes(true)

      // Fetch recipes and bookmark count in parallel
      const [userRecipes, userBookmarks] = await Promise.all([
        getRecipesByUserId(user.id),
        getUserBookmarkCount(user.id)
      ])

      setRecipes(userRecipes)
      setBookmarkCount(userBookmarks)
      setIsLoadingRecipes(false)
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!user?.id) return

    const success = await deleteRecipe(recipeId, user.id)
    if (success) {
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId))
      setDeleteConfirmId(null)
    } else {
      alert('Failed to delete recipe. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h1>
            <p className="text-gray-600">Please wait while we redirect you to login.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.profile?.full_name || user.user_metadata?.full_name || user.email}!
          </h1>
          <p className="text-gray-600">Manage your recipes and discover new favorites.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Recipes</h3>
                <p className="text-gray-600">{recipes.length} recipes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Bookmarked</h3>
                <p className="text-gray-600">{bookmarkCount} {bookmarkCount === 1 ? 'recipe' : 'recipes'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Views</h3>
                <p className="text-gray-600">0 views</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/recipes/create"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
            >
              <div className="p-2 rounded-full bg-orange-100 text-orange-600 mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Create Recipe</h3>
                <p className="text-sm text-gray-600">Share your favorite recipe</p>
              </div>
            </Link>

            <Link
              href="/recipes"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors"
            >
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Browse Recipes</h3>
                <p className="text-sm text-gray-600">Discover new favorites</p>
              </div>
            </Link>
          </div>
        </div>

        {/* My Recipes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">My Recipes</h2>
          </div>

          {isLoadingRecipes ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recipes yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first recipe.</p>
              <div className="mt-6">
                <Link
                  href="/recipes/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Recipe
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  {recipe.image_url ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={recipe.image_url}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{recipe.title}</h3>
                      {!recipe.is_public && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">Private</span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{recipe.description}</p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded">{recipe.category}</span>
                      {recipe.difficulty && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded capitalize">{recipe.difficulty}</span>
                      )}
                    </div>

                    <div className="mt-auto">
                      {deleteConfirmId === recipe.id ? (
                        <div className="space-y-2">
                          <p className="text-sm text-red-600 font-medium">Delete this recipe?</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteRecipe(recipe.id)}
                              className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Link
                            href={`/recipes/edit/${recipe.id}`}
                            className="flex-1 px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 text-center"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteConfirmId(recipe.id)}
                            className="flex-1 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
