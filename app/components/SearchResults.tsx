'use client'

import { useEffect, useState } from 'react'
import Link from "next/link"
import RecipeCard from "./RecipeCard"
import { searchRecipes } from '@/lib/actions/recipe'
import type { Recipe } from '@/lib/supabase'

interface SearchResultsProps {
  searchQuery: string
  category: string
}

const RECIPES_PER_PAGE = 8

export default function SearchResults({ searchQuery, category }: SearchResultsProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  // Reset and fetch initial results when search query or category changes
  useEffect(() => {
    async function fetchRecipes() {
      setIsLoading(true)
      setOffset(0)
      setHasMore(true)
      // Fetch one extra to check if there are more results
      const results = await searchRecipes(searchQuery, category, RECIPES_PER_PAGE + 1, 0)

      // If we got more than RECIPES_PER_PAGE, there are more results
      if (results.length > RECIPES_PER_PAGE) {
        setRecipes(results.slice(0, RECIPES_PER_PAGE))
        setHasMore(true)
      } else {
        setRecipes(results)
        setHasMore(false)
      }

      setIsLoading(false)
      setHasSearched(true)
    }

    fetchRecipes()
  }, [searchQuery, category])

  // Load more recipes
  const handleLoadMore = async () => {
    setIsLoadingMore(true)
    const newOffset = offset + RECIPES_PER_PAGE
    // Fetch one extra to check if there are more results
    const moreResults = await searchRecipes(searchQuery, category, RECIPES_PER_PAGE + 1, newOffset)

    // If we got more than RECIPES_PER_PAGE, there are more results
    if (moreResults.length > RECIPES_PER_PAGE) {
      setRecipes(prev => [...prev, ...moreResults.slice(0, RECIPES_PER_PAGE)])
      setHasMore(true)
    } else {
      setRecipes(prev => [...prev, ...moreResults])
      setHasMore(false)
    }

    setOffset(newOffset)
    setIsLoadingMore(false)
  }

  // Show loading spinner
  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </section>
    )
  }

  // Show no results message
  if (hasSearched && recipes.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No recipes found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or browse all recipes</p>
            <Link
              href="/recipes/create"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Create New Recipe
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Show results
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Recipes'}
          </h2>
          <p className="mt-2 text-gray-600">
            Showing {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
            {category !== 'All' && ` in ${category}`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description || undefined}
              image_url={recipe.image_url || undefined}
              category={recipe.category}
              difficulty={recipe.difficulty}
              prep_time={recipe.prep_time}
              cook_time={recipe.cook_time}
            />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoadingMore ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                <>
                  Load More Recipes
                  <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
