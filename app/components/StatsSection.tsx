export default function StatsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">1,234+</div>
            <div className="text-gray-600">Recipes Shared</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">5,678+</div>
            <div className="text-gray-600">Happy Cooks</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">89+</div>
            <div className="text-gray-600">Countries</div>
          </div>
        </div>
      </div>
    </section>
  );
} 