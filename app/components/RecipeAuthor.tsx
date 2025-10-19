import Image from 'next/image'

interface RecipeAuthorProps {
  authorId: string
  authorName: string
  authorAvatar?: string | undefined
  createdAt: string
}

export default function RecipeAuthor({
  authorId,
  authorName,
  authorAvatar,
  createdAt
}: RecipeAuthorProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        {authorAvatar ? (
          <Image
            src={authorAvatar}
            alt={authorName}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {authorName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div>
        <p className="font-medium text-gray-900">
          {authorName}
        </p>
        <p className="text-sm text-gray-500">Posted on {formattedDate}</p>
      </div>
    </div>
  )
}
