import Link from "next/link";
import RecipeCard from "./RecipeCard";

// Mock data for featured recipes
const featuredRecipes = [
  {
    id: 1,
    title: "Classic Margherita Pizza",
    author: "Chef Maria",
    image: "/pizza-placeholder.jpg",
    cookTime: "30 min",
    difficulty: "Easy",
    category: "Italian"
  },
  {
    id: 2,
    title: "Chocolate Chip Cookies",
    author: "Baker John",
    image: "/cookies-placeholder.jpg",
    cookTime: "25 min",
    difficulty: "Easy",
    category: "Dessert"
  },
  {
    id: 3,
    title: "Grilled Salmon with Herbs",
    author: "Chef Sarah",
    image: "/salmon-placeholder.jpg",
    cookTime: "45 min",
    difficulty: "Medium",
    category: "Seafood"
  },
  {
    id: 4,
    title: "Vegetarian Buddha Bowl",
    author: "Chef Alex",
    image: "/bowl-placeholder.jpg",
    cookTime: "20 min",
    difficulty: "Easy",
    category: "Vegetarian"
  }
];

export default function FeaturedRecipes() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Recipes</h2>
          <p className="text-gray-600">Discover the most popular recipes from our community</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              author={recipe.author}
              image={recipe.image}
              cookTime={recipe.cookTime}
              difficulty={recipe.difficulty}
              category={recipe.category}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/recipes" 
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
          >
            View All Recipes
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 