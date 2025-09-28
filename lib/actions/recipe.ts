import { supabase } from '@/lib/supabase'
import type { Recipe } from '@/lib/supabase'
import type { CreateRecipeFormData } from '@/lib/validations/recipe'

// Upload image to Supabase Storage
export async function uploadRecipeImage(file: File, userId: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading image:', error)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

// Create a new recipe
export async function createRecipe(formData: CreateRecipeFormData, userId: string, imageFile?: File): Promise<Recipe | null> {
  try {
    let imageUrl: string | null = null

    // Upload image if provided
    if (imageFile) {
      imageUrl = await uploadRecipeImage(imageFile, userId)
      if (!imageUrl) {
        throw new Error('Failed to upload image')
      }
    }

    // Parse the text-based arrays into proper arrays
    const ingredients = formData.ingredients
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0)

    const steps = formData.steps
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0)

    const tags = formData.tags
      ? formData.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0)
      : []

    // Prepare recipe data
    const recipeData = {
      user_id: userId,
      title: formData.title,
      description: formData.description || '',
      image_url: imageUrl,
      ingredients,
      steps,
      category: formData.category,
      tags,
      prep_time: formData.prep_time,
      cook_time: formData.cook_time,
      servings: formData.servings,
      difficulty: formData.difficulty,
      is_public: formData.is_public ?? true
    }

    const { data, error } = await supabase
      .from('recipes')
      .insert([recipeData])
      .select()
      .single()

    if (error) {
      console.error('Error creating recipe:', error)
      // If image was uploaded but recipe creation failed, clean up the image
      if (imageUrl) {
        await deleteRecipeImage(imageUrl)
      }
      return null
    }

    return data as Recipe
  } catch (error) {
    console.error('Error creating recipe:', error)
    return null
  }
}

// Delete image from storage
export async function deleteRecipeImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl)
    const path = url.pathname.split('/').slice(-2).join('/')

    const { error } = await supabase.storage
      .from('recipe-images')
      .remove([path])

    if (error) {
      console.error('Error deleting image:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

// Get recipe by ID
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching recipe:', error)
      return null
    }

    return data as Recipe
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
}

// Get recipes by user ID
export async function getRecipesByUserId(userId: string): Promise<Recipe[]> {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user recipes:', error)
      return []
    }

    return data as Recipe[]
  } catch (error) {
    console.error('Error fetching user recipes:', error)
    return []
  }
}

// Get public recipes with pagination
export async function getPublicRecipes(
  limit = 10,
  offset = 0,
  category?: string,
  searchTerm?: string
): Promise<Recipe[]> {
  try {
    let query = supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true)

    if (category) {
      query = query.eq('category', category)
    }

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching public recipes:', error)
      return []
    }

    return data as Recipe[]
  } catch (error) {
    console.error('Error fetching public recipes:', error)
    return []
  }
}

// Delete recipe (and its image)
export async function deleteRecipe(id: string, userId: string): Promise<boolean> {
  try {
    // First get the recipe to check ownership and get image URL
    const recipe = await getRecipeById(id)
    if (!recipe || recipe.user_id !== userId) {
      return false
    }

    // Delete from database
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting recipe:', error)
      return false
    }

    // Delete image if it exists
    if (recipe.image_url) {
      await deleteRecipeImage(recipe.image_url)
    }

    return true
  } catch (error) {
    console.error('Error deleting recipe:', error)
    return false
  }
}