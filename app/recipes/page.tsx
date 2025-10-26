'use client'

import { useState } from 'react'
import { Header, Footer } from "../components"
import SearchSection from '../components/SearchSection'
import SearchResults from '../components/SearchResults'

export default function BrowseRecipesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState('All')

  const handleSearch = (query: string, category: string) => {
    setSearchQuery(query)
    setSearchCategory(category)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />

      {/* Page Title */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Browse All Recipes</h1>
          <p className="mt-2 text-gray-600">
            Discover delicious recipes from our community
          </p>
        </div>
      </section>

      {/* Search Section */}
      <SearchSection onSearch={handleSearch} />

      {/* Results Section */}
      <SearchResults searchQuery={searchQuery} category={searchCategory} />

      <Footer />
    </div>
  )
}
