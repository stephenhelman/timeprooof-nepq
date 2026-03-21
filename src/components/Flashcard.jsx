import { useState } from 'react'

export default function FlashCard({ card }) {
  const [flipped, setFlipped] = useState(false)

  const ListTag = card.ordered ? 'ol' : 'ul'
  const listClass = card.ordered
    ? 'list-decimal ml-4 space-y-1 text-sm'
    : 'list-disc ml-4 space-y-1 text-sm'

  return (
    <div
      className="cursor-pointer bg-gray-800 rounded-xl p-6 min-h-50 relative"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        style={{
          transition: 'transform 0.5s',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : '',
          position: 'relative',
          minHeight: '152px',
        }}
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="flex flex-col justify-between h-full"
        >
          <p className="text-white font-semibold text-base">{card.question}</p>
          <p className="text-gray-500 text-xs mt-4">Click to flip</p>
        </div>

        {/* Back */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            inset: 0,
          }}
        >
          <ListTag className={listClass}>
            {card.answer.map((item, i) => (
              <li key={i}>
                {item.term ? (
                  <>
                    <span className="font-bold text-blue-300">{item.term}</span>
                    <span className="text-gray-300"> — {item.detail}</span>
                  </>
                ) : (
                  <span className="text-gray-300">{item.detail}</span>
                )}
              </li>
            ))}
          </ListTag>
        </div>
      </div>
    </div>
  )
}
