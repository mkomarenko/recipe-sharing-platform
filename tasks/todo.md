# Recipe Detail Page Implementation Plan (3.5)

## Overview
Implement a detailed recipe view page that displays full recipe information with bookmark functionality for logged-in users.

## Requirements from PRD (3.5)
- Display full recipe (image, description, ingredients, steps, author)
- Show number of bookmarks / likes
- Allow logged-in users to bookmark recipe

## Implementation Tasks

### 1. Backend/Data Layer
- [ ] Create bookmark action functions in `lib/actions/bookmark.ts`
  - [ ] `getBookmarkCount(recipeId)` - Get total bookmarks for a recipe
  - [ ] `isRecipeBookmarked(userId, recipeId)` - Check if user bookmarked recipe
  - [ ] `toggleBookmark(userId, recipeId)` - Add/remove bookmark
  - [ ] `getRecipeWithAuthor(recipeId)` - Get recipe with author profile info

### 2. Recipe Detail Page
- [ ] Create `app/recipes/[id]/page.tsx` - Main recipe detail page
  - [ ] Fetch recipe data using `getRecipeById()`
  - [ ] Fetch author profile data
  - [ ] Display recipe image (or placeholder if none)
  - [ ] Display recipe title, category, tags
  - [ ] Display prep time, cook time, servings, difficulty
  - [ ] Display description
  - [ ] Display ingredients list
  - [ ] Display step-by-step instructions
  - [ ] Display author information (name, avatar)
  - [ ] Display bookmark count
  - [ ] Show edit/delete buttons if user owns recipe

### 3. Bookmark Component
- [ ] Create `app/components/BookmarkButton.tsx` - Reusable bookmark toggle
  - [ ] Display bookmark icon (filled if bookmarked, outline if not)
  - [ ] Show bookmark count
  - [ ] Handle bookmark toggle on click
  - [ ] Show login prompt if user not authenticated
  - [ ] Optimistic UI updates
  - [ ] Handle loading and error states

### 4. Author Info Component
- [ ] Create `app/components/RecipeAuthor.tsx` - Display recipe author
  - [ ] Show avatar
  - [ ] Show author name
  - [ ] Show "Posted on {date}"
  - [ ] Link to author profile (if we have profile pages)

### 5. Testing & Polish
- [ ] Test recipe detail page loads correctly
- [ ] Test bookmark functionality (logged in/out)
- [ ] Test edit/delete buttons show only for recipe owner
- [ ] Test responsive design (mobile/tablet/desktop)
- [ ] Test with recipes that have no image
- [ ] Test navigation from RecipeCard to detail page
- [ ] Run `npm run lint && npm run type-check && npm run build`

## Technical Notes
- Recipe detail page will be at `/recipes/[id]`
- RecipeCard already links to this route (line 29 in RecipeCard.tsx)
- Database already has `bookmarks` table with RLS policies
- Auth context available for checking logged-in user
- Keep components simple and focused
- Use existing color scheme and design patterns from the site

## Success Criteria
- Users can view full recipe details
- Bookmark functionality works for authenticated users
- Page is responsive and matches existing design
- All linting and type checks pass
- Recipe author information is displayed

---

# Bookmarks Feature - Dashboard View (3.6 - Remaining)

## Overview
Implement viewing bookmarked recipes in the dashboard. The bookmark/unbookmark functionality is already implemented in Recipe Detail Page.

## Remaining Tasks

### 1. Backend/Data Layer
- [ ] Create `getBookmarkedRecipes(userId)` function in `lib/actions/bookmark.ts`
  - Fetch all recipes bookmarked by the user
  - Include recipe details (title, image, description, category, etc.)
  - Return array of recipes

### 2. Dashboard Page Updates
- [ ] Update `app/dashboard/page.tsx` to display bookmarked recipes
  - Fetch bookmarked recipes using the new function
  - Add state for bookmarked recipes list
  - Create a "Bookmarked Recipes" section below "My Recipes"
  - Display bookmarked recipes using same card layout
  - Handle empty state (no bookmarks yet)

### 3. Testing & Quality Assurance
- [ ] Test fetching bookmarked recipes
- [ ] Test empty state display
- [ ] Test clicking on bookmarked recipe cards
- [ ] Run `npm run lint && npm run type-check && npm run build`

## Technical Notes
- Reuse existing recipe card UI patterns from dashboard
- Keep implementation simple - add new section below "My Recipes"
- Fetch both user recipes and bookmarked recipes in parallel
- Already have `getUserBookmarkCount` implemented for the stats card

## Success Criteria
- Users can see all their bookmarked recipes in the dashboard
- Clicking on a bookmarked recipe navigates to the detail page
- Empty state is shown when user has no bookmarks
- All linting and type checks pass
