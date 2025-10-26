'use client'

import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { useState } from "react";
import SignOutButton from "./SignOutButton";

export default function Header() {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Show loading state only for a reasonable amount of time
  const showLoading = loading && !user;

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
            {/* Temporarily Hidden - Categories */}
            {/* <Link href="/categories" className="text-gray-700 hover:text-orange-600 transition-colors">
              Categories
            </Link> */}

            {showLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link href="/recipes/create" className="text-gray-700 hover:text-orange-600 transition-colors">
                  Create Recipe
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-medium text-sm">
                        {user.profile?.full_name?.charAt(0) || (loading ? '...' : user.email?.charAt(0) || 'U')}
                      </span>
                    </div>
                    <span className="hidden lg:block">
                      {user.profile?.full_name || (loading ? 'Loading...' : user.email || 'User')}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <SignOutButton
                        onSignOut={() => setIsMenuOpen(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sign Out
                      </SignOutButton>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-orange-600 transition-colors">
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 