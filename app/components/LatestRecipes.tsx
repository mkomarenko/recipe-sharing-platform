'use client'

import { useEffect, useState } from 'react'
import Link from "next/link"
import RecipeCard from "./RecipeCard"
import { getLatestRecipes } from '@/lib/actions/recipe'
import type { Recipe } from '@/lib/supabase'

export default function LatestRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecipes() {
      setIsLoading(true)
      const latestRecipes = await getLatestRecipes(8)
      setRecipes(latestRecipes)
      setIsLoading(false)
    }

    fetchRecipes()
  }, [])

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Recipes</h2>
          <p className="text-gray-600">Fresh recipes just added to our collection</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No recipes available yet. Be the first to share one!</p>
            <Link
              href="/recipes/create"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
            >
              Create Recipe
            </Link>
          </div>
        ) : (
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
        )}

        <div className="text-center mt-12">
          <Link
            href="/recipes"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
          >
            Browse All Recipes
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
