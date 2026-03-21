import { useState } from 'react'
import { trainingData } from '../data/trainingData'
import FlashCard from '../components/Flashcard'
import BackToTop from '../components/BackToTop'

const salesSections = trainingData.sections
  .filter(s => s.salesStep !== null)
  .sort((a, b) => a.salesStep - b.salesStep)

const operationalSections = trainingData.sections
  .filter(s => s.salesStep === null)

const sectionsWithCards = [...salesSections, ...operationalSections]
  .filter(s => s.flashcards && s.flashcards.length > 0)

export default function Flashcards() {
  const [activeFilter, setActiveFilter] = useState('all')

  const visibleSections = activeFilter === 'all'
    ? sectionsWithCards
    : sectionsWithCards.filter(s => s.id === activeFilter)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveFilter('all')}
          className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          All
        </button>
        {sectionsWithCards.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveFilter(s.id)}
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              activeFilter === s.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {visibleSections.map((section, idx) => (
        <div key={section.id}>
          {idx > 0 && <hr className="border-gray-700 my-8" />}
          <h2 className="text-lg font-bold text-white mb-4">
            {section.title}
            <span className="text-gray-500 font-normal text-sm ml-2">
              ({section.flashcards.length} cards)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.flashcards.map(fc => (
              <FlashCard key={fc.id} card={fc} />
            ))}
          </div>
        </div>
      ))}
      <BackToTop />
    </div>
  )
}
