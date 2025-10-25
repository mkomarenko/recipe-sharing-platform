import { supabase } from '@/lib/supabase'

// Get bookmark count for a recipe
export async function getBookmarkCount(recipeId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('recipe_id', recipeId)

    if (error) {
      console.error('Error fetching bookmark count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error fetching bookmark count:', error)
    return 0
  }
}

// Get user's total bookmark count
export async function getUserBookmarkCount(userId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user bookmark count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error fetching user bookmark count:', error)
    return 0
  }
}

// Check if a recipe is bookmarked by a user
export async function isRecipeBookmarked(userId: string, recipeId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
      .single()

    if (error) {
      // No bookmark found is not an error
      return false
    }

    return !!data
  } catch (error) {
    return false
  }
}

// Toggle bookmark (add if not exists, remove if exists)
export async function toggleBookmark(userId: string, recipeId: string): Promise<boolean> {
  try {
    // Check if bookmark exists
    const isBookmarked = await isRecipeBookmarked(userId, recipeId)

    if (isBookmarked) {
      // Remove bookmark
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('recipe_id', recipeId)

      if (error) {
        console.error('Error removing bookmark:', error)
        return false
      }

      return true
    } else {
      // Add bookmark
      const { error } = await supabase
        .from('bookmarks')
        .insert([{ user_id: userId, recipe_id: recipeId }])

      if (error) {
        console.error('Error adding bookmark:', error)
        return false
      }

      return true
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error)
    return false
  }
}

// Get recipe with author profile information
export async function getRecipeWithAuthor(recipeId: string) {
  try {
    // First, get the recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single()

    if (recipeError || !recipe) {
      console.error('Error fetching recipe:', recipeError)
      return null
    }

    // Then, get the author profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .eq('id', recipe.user_id)
      .single()

    if (profileError || !profile) {
      console.error('Error fetching profile:', profileError)
      return null
    }

    // Combine the data
    return {
      ...recipe,
      profiles: profile
    }
  } catch (error) {
    console.error('Error fetching recipe with author:', error)
    return null
  }
}

// Get all bookmarked recipes for a user
export async function getBookmarkedRecipes(userId: string) {
  try {
    const { data: bookmarks, error: bookmarksError } = await supabase
      .from('bookmarks')
      .select('recipe_id')
      .eq('user_id', userId)

    if (bookmarksError || !bookmarks) {
      console.error('Error fetching bookmarks:', bookmarksError)
      return []
    }

    if (bookmarks.length === 0) {
      return []
    }

    const recipeIds = bookmarks.map(b => b.recipe_id)

    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .in('id', recipeIds)

    if (recipesError || !recipes) {
      console.error('Error fetching bookmarked recipes:', recipesError)
      return []
    }

    return recipes
  } catch (error) {
    console.error('Error fetching bookmarked recipes:', error)
    return []
  }
}
