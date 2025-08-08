import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-orange-600">
              RecipeShare
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/recipes" className="text-gray-700 hover:text-orange-600 transition-colors">
              Browse Recipes
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-orange-600 transition-colors">
              Categories
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-orange-600 transition-colors">
              Login
            </Link>
            <Link 
              href="/register" 
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 