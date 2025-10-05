'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createRecipeSchema, type CreateRecipeFormData, RECIPE_CATEGORIES, DIFFICULTY_LEVELS } from '@/lib/validations/recipe'
import { getRecipeById, updateRecipe } from '@/lib/actions/recipe'
import type { Recipe } from '@/lib/supabase'

interface EditRecipeFormProps {
  recipeId: string
  userId: string
}

export default function EditRecipeForm({ recipeId, userId }: EditRecipeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingRecipe, setIsFetchingRecipe] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateRecipeFormData>({
    resolver: zodResolver(createRecipeSchema),
  })

  // Fetch the recipe on mount
  useEffect(() => {
    async function fetchRecipe() {
      setIsFetchingRecipe(true)
      const fetchedRecipe = await getRecipeById(recipeId)

      if (!fetchedRecipe) {
        setError('Recipe not found')
        setIsFetchingRecipe(false)
        return
      }

      // Check ownership
      if (fetchedRecipe.user_id !== userId) {
        setError('You do not have permission to edit this recipe')
        setIsFetchingRecipe(false)
        return
      }

      setRecipe(fetchedRecipe)
      setImagePreview(fetchedRecipe.image_url || null)

      // Pre-fill form with existing data
      reset({
        title: fetchedRecipe.title,
        description: fetchedRecipe.description || '',
        category: fetchedRecipe.category,
        ingredients: fetchedRecipe.ingredients.join('\n'),
        steps: fetchedRecipe.steps.join('\n'),
        tags: fetchedRecipe.tags?.join(', ') || '',
        prep_time: fetchedRecipe.prep_time,
        cook_time: fetchedRecipe.cook_time,
        servings: fetchedRecipe.servings,
        difficulty: fetchedRecipe.difficulty,
        is_public: fetchedRecipe.is_public ?? true,
      })

      setIsFetchingRecipe(false)
    }

    fetchRecipe()
  }, [recipeId, userId, reset])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: CreateRecipeFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const updatedRecipe = await updateRecipe(recipeId, data, userId, selectedImage || undefined)
      if (updatedRecipe) {
        router.push('/dashboard')
      } else {
        setError('Failed to update recipe. Please try again.')
      }
    } catch (err) {
      console.error('Error updating recipe:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetchingRecipe) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !recipe) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Recipe</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Title *
              </label>
              <input
                {...register('title')}
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="Enter recipe title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register('category')}
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              >
                <option value="">Select a category</option>
                {RECIPE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="Describe your recipe..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Recipe Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="prep_time" className="block text-sm font-medium text-gray-700 mb-2">
                Prep Time (minutes)
              </label>
              <input
                {...register('prep_time', { valueAsNumber: true })}
                type="number"
                id="prep_time"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="30"
              />
              {errors.prep_time && (
                <p className="mt-1 text-sm text-red-600">{errors.prep_time.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="cook_time" className="block text-sm font-medium text-gray-700 mb-2">
                Cook Time (minutes)
              </label>
              <input
                {...register('cook_time', { valueAsNumber: true })}
                type="number"
                id="cook_time"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="45"
              />
              {errors.cook_time && (
                <p className="mt-1 text-sm text-red-600">{errors.cook_time.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
                Servings
              </label>
              <input
                {...register('servings', { valueAsNumber: true })}
                type="number"
                id="servings"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                placeholder="4"
              />
              {errors.servings && (
                <p className="mt-1 text-sm text-red-600">{errors.servings.message}</p>
              )}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              {...register('difficulty')}
              id="difficulty"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            >
              <option value="">Select difficulty</option>
              {Object.entries(DIFFICULTY_LEVELS).map(([key, { label, description }]) => (
                <option key={key} value={key}>
                  {label} - {description}
                </option>
              ))}
            </select>
            {errors.difficulty && (
              <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Image (leave empty to keep current image)
            </label>
            <input
              type="file"
              id="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
            {imagePreview && (
              <div className="mt-4">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-md border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients * (one per line)
            </label>
            <textarea
              {...register('ingredients')}
              id="ingredients"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="2 cups flour&#10;1 tsp salt&#10;3 eggs&#10;1 cup milk"
            />
            {errors.ingredients && (
              <p className="mt-1 text-sm text-red-600">{errors.ingredients.message}</p>
            )}
          </div>

          {/* Steps */}
          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-2">
              Instructions * (one step per line)
            </label>
            <textarea
              {...register('steps')}
              id="steps"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="Preheat oven to 350°F&#10;Mix dry ingredients in a bowl&#10;Add wet ingredients and stir&#10;Bake for 25 minutes"
            />
            {errors.steps && (
              <p className="mt-1 text-sm text-red-600">{errors.steps.message}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional, separate with commas)
            </label>
            <input
              {...register('tags')}
              type="text"
              id="tags"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              placeholder="vegetarian, quick, healthy"
            />
            {errors.tags && (
              <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
            )}
          </div>

          {/* Privacy Setting */}
          <div className="flex items-center">
            <input
              {...register('is_public')}
              type="checkbox"
              id="is_public"
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-700">
              Make this recipe public (others can view and bookmark it)
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating Recipe...' : 'Update Recipe'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
