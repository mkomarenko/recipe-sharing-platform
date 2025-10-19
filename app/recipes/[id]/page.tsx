'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { getRecipeWithAuthor } from '@/lib/actions/bookmark'
import { deleteRecipe } from '@/lib/actions/recipe'
import RecipeAuthor from '@/app/components/RecipeAuthor'
import BookmarkButton from '@/app/components/BookmarkButton'
import Header from '@/app/components/Header'
import type { Recipe } from '@/lib/supabase'

interface RecipeWithAuthor extends Recipe {
  profiles: {
    id: string
    username: string
    full_name: string
    avatar_url?: string
  }
}

export default function RecipeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState<RecipeWithAuthor | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const recipeId = params.id as string

  useEffect(() => {
    async function fetchRecipe() {
      setIsLoading(true)
      const data = await getRecipeWithAuthor(recipeId)
      setRecipe(data as RecipeWithAuthor)
      setIsLoading(false)
    }

    if (recipeId) {
      fetchRecipe()
    }
  }, [recipeId])

  const handleDelete = async () => {
    if (!user || !recipe) return

    const confirmed = confirm('Are you sure you want to delete this recipe? This action cannot be undone.')
    if (!confirmed) return

    setIsDeleting(true)
    const success = await deleteRecipe(recipeId, user.id)

    if (success) {
      router.push('/dashboard')
    } else {
      alert('Failed to delete recipe. Please try again.')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h1>
          <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === recipe.user_id
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />

      {/* Recipe Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Recipe Image */}
          {recipe.image_url ? (
            <div className="relative h-96 w-full">
              <Image
                src={recipe.image_url}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="h-96 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-gray-500">No Image</p>
              </div>
            </div>
          )}

          {/* Recipe Header */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                    {recipe.category}
                  </span>
                  {recipe.difficulty && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                      {recipe.difficulty}
                    </span>
                  )}
                </div>
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {recipe.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <BookmarkButton recipeId={recipeId} />
            </div>

            {/* Recipe Meta Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-4 border-y border-gray-200 mb-6">
              <RecipeAuthor
                authorId={recipe.profiles.id}
                authorName={recipe.profiles.full_name}
                authorAvatar={recipe.profiles.avatar_url}
                createdAt={recipe.created_at}
              />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                {recipe.prep_time && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Prep: {recipe.prep_time}m</span>
                  </div>
                )}
                {recipe.cook_time && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <span>Cook: {recipe.cook_time}m</span>
                  </div>
                )}
                {totalTime > 0 && (
                  <div className="flex items-center font-medium">
                    <span>Total: {totalTime}m</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Serves: {recipe.servings}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {recipe.description && (
              <div className="mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">{recipe.description}</p>
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-200">
                <Link
                  href={`/recipes/edit/${recipeId}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Recipe
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {isDeleting ? 'Deleting...' : 'Delete Recipe'}
                </button>
              </div>
            )}

            {/* Ingredients */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Recipes
          </Link>
        </div>
      </main>
    </div>
  )
}
