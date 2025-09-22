'use client'

import {
  Header,
  HeroSection,
  SearchSection,
  FeaturedRecipes,
  StatsSection,
  Footer
} from "./components";

export default function Home() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header />
      <HeroSection />
      <SearchSection />
      <FeaturedRecipes />
      <StatsSection />
      <Footer />
    </div>
  );
}
