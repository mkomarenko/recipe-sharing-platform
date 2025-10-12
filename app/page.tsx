'use client'

import { useState } from 'react'
import {
  Header,
  HeroSection,
  SearchSection,
  FeaturedRecipes,
  LatestRecipes,
  StatsSection,
  Footer
} from "./components";
import SearchResults from './components/SearchResults'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState('All')
  const [isSearchActive, setIsSearchActive] = useState(false)

  const handleSearch = (query: string, category: string) => {
    setSearchQuery(query)
    setSearchCategory(category)
    setIsSearchActive(query.trim() !== '' || category !== 'All')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <HeroSection />
      <SearchSection onSearch={handleSearch} />

      {isSearchActive ? (
        <SearchResults searchQuery={searchQuery} category={searchCategory} />
      ) : (
        <>
          <FeaturedRecipes />
          <LatestRecipes />
        </>
      )}

      <StatsSection />
      <Footer />
    </div>
  );
}
