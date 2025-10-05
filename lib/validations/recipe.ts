import { z } from 'zod'

// Recipe creation form validation schema
export const createRecipeSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  description: z
    .string()
    .optional(),
  category: z
    .string()
    .min(1, 'Please select a category'),
  ingredients: z
    .string()
    .min(10, 'Please enter at least one ingredient'),
  steps: z
    .string()
    .min(10, 'Please enter at least one step'),
  prep_time: z
    .number()
    .min(0, 'Prep time must be 0 or greater')
    .max(1440, 'Prep time must be less than 24 hours')
    .optional(),
  cook_time: z
    .number()
    .min(0, 'Cook time must be 0 or greater')
    .max(1440, 'Cook time must be less than 24 hours')
    .optional(),
  servings: z
    .number()
    .min(1, 'Servings must be at least 1')
    .max(100, 'Servings must be less than 100')
    .optional(),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .optional(),
  tags: z
    .string()
    .optional(),
  is_public: z
    .boolean()
    .optional()
})

// Type for the form data
export type CreateRecipeFormData = z.infer<typeof createRecipeSchema>

// Recipe update schema (similar but all fields optional except id)
export const updateRecipeSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim()
    .optional(),
  category: z
    .string()
    .min(1, 'Please select a category')
    .optional(),
  ingredients: z
    .array(z.string().min(1, 'Ingredient cannot be empty'))
    .min(1, 'At least one ingredient is required')
    .max(50, 'Maximum 50 ingredients allowed')
    .optional(),
  steps: z
    .array(z.string().min(1, 'Step cannot be empty'))
    .min(1, 'At least one step is required')
    .max(30, 'Maximum 30 steps allowed')
    .optional(),
  prep_time: z
    .number()
    .min(0, 'Prep time must be 0 or greater')
    .max(1440, 'Prep time must be less than 24 hours')
    .optional(),
  cook_time: z
    .number()
    .min(0, 'Cook time must be 0 or greater')
    .max(1440, 'Cook time must be less than 24 hours')
    .optional(),
  servings: z
    .number()
    .min(1, 'Servings must be at least 1')
    .max(100, 'Servings must be less than 100')
    .optional(),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .optional(),
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty'))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  is_public: z
    .boolean()
    .optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Image must be less than 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Image must be in JPEG, PNG, or WebP format'
    )
    .optional()
})

export type UpdateRecipeFormData = z.infer<typeof updateRecipeSchema>

// Common recipe categories
export const RECIPE_CATEGORIES = [
  'Appetizer',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Dessert',
  'Snack',
  'Beverage',
  'Main Course',
  'Side Dish',
  'Soup',
  'Salad',
  'Bread',
  'Pasta',
  'Seafood',
  'Vegetarian',
  'Vegan'
] as const

// Common difficulty levels with descriptions
export const DIFFICULTY_LEVELS = {
  easy: { label: 'Easy', description: 'Simple recipes for beginners' },
  medium: { label: 'Medium', description: 'Intermediate cooking skills required' },
  hard: { label: 'Hard', description: 'Advanced techniques and skills needed' }
} as const