import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Discover Amazing
          <span className="text-orange-600 block">Recipes</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join our community of food lovers. Share your favorite recipes, discover new dishes, 
          and connect with fellow cooking enthusiasts from around the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/recipes" 
            className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Browse Recipes
          </Link>
          <button
            disabled
            className="border-2 border-gray-400 text-gray-400 px-8 py-3 rounded-lg text-lg font-semibold cursor-not-allowed opacity-60"
          >
            Share Your Recipe
          </button>
        </div>
      </div>
    </section>
  );
} 