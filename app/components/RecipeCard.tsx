import Image from 'next/image'
import Link from 'next/link'

interface RecipeCardProps {
  id: string;
  title: string;
  description?: string | undefined;
  image_url?: string | undefined;
  category: string;
  difficulty?: string | undefined;
  prep_time?: number | undefined;
  cook_time?: number | undefined;
}

export default function RecipeCard({
  id,
  title,
  description,
  image_url,
  category,
  difficulty,
  prep_time,
  cook_time
}: RecipeCardProps) {
  const totalTime = (prep_time || 0) + (cook_time || 0)
  const timeDisplay = totalTime > 0 ? `${totalTime} min` : 'N/A'

  return (
    <Link href={`/recipes/${id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {image_url ? (
          <div className="relative h-48 w-full">
            <Image
              src={image_url}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-sm text-gray-500">No Image</p>
            </div>
          </div>
        )}

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              {category}
            </span>
            <span className="text-xs text-gray-500">{timeDisplay}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center justify-between mt-auto">
            {difficulty && (
              <span className="text-xs text-gray-500 capitalize">Difficulty: {difficulty}</span>
            )}
            <span className="text-orange-600 hover:text-orange-700 text-sm font-medium">
              View Recipe →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 