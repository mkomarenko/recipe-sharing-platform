# Search Bar Implementation Plan

## Overview
Implement search functionality for recipes that allows searching by:
- Recipe title
- Tags
- Ingredients

## Tasks

### 1. Backend: Create search function
- [ ] Add `searchRecipes()` function to `lib/actions/recipe.ts`
- [ ] Implement full-text search for title
- [ ] Implement array search for tags
- [ ] Implement JSON array search for ingredients
- [ ] Handle empty search query (return all recipes)
- [ ] Add pagination support

### 2. Frontend: Update SearchSection component
- [ ] Add state management for search query
- [ ] Add onChange handler for search input
- [ ] Add debounce for search input (avoid excessive API calls)
- [ ] Add state management for selected category filter
- [ ] Add onClick handlers for category buttons
- [ ] Implement active state styling for category buttons

### 3. Frontend: Create SearchResults component
- [ ] Create new component to display search results
- [ ] Show loading state during search
- [ ] Display recipe cards in grid layout
- [ ] Show "no results" message when applicable
- [ ] Add pagination or "load more" functionality

### 4. Frontend: Update homepage to show search results
- [ ] Update homepage to show search results below SearchSection
- [ ] Integrate SearchSection with results display
- [ ] Handle URL query parameters for shareable search links
- [ ] Show search results or latest/featured recipes based on search state

### 5. Testing
- [ ] Test search by title
- [ ] Test search by tags
- [ ] Test search by description
- [ ] Test category filtering
- [ ] Test combination of search + category filter
- [ ] Test empty results
- [ ] Test pagination
- [ ] Run linting and type-check

## Implementation Notes
- Keep each change simple and minimal
- Use existing patterns from the codebase (like LatestRecipes, FeaturedRecipes)
- Reuse RecipeCard component for consistency
- Follow existing code style and conventions
- Use TypeScript strict typing
- Implement debounce to avoid excessive API calls during typing
