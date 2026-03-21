import { useState, useEffect } from 'react'
import { trainingData } from '../data/trainingData'
import BackToTop from '../components/BackToTop'

const grouped = trainingData.glossary.reduce((acc, term) => {
  const letter = term.term[0].toUpperCase()
  if (!acc[letter]) acc[letter] = []
  acc[letter].push(term)
  return acc
}, {})
const letters = Object.keys(grouped).sort()

export default function Glossary() {
  const [activeL, setActiveL] = useState(letters[0] || '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setActiveL(e.target.id.replace('glossary-', ''))
      }),
      { rootMargin: '-20% 0px -70% 0px' }
    )
    letters.forEach(l => {
      const el = document.getElementById(`glossary-${l}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Mobile alpha nav */}
      <div className="flex md:hidden overflow-x-auto gap-1 pb-2 mb-4 sticky top-12.25 bg-gray-950 z-10">
        {letters.map(l => (
          <button
            key={l}
            onClick={() => document.getElementById(`glossary-${l}`)?.scrollIntoView({ behavior: 'smooth' })}
            className={`text-xs w-7 h-7 flex items-center justify-center rounded shrink-0 transition-colors ${
              activeL === l
                ? 'text-blue-400 font-bold bg-gray-800'
                : 'text-gray-500 hover:text-white hover:bg-gray-700'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="flex gap-8">
        {/* Terms */}
        <div className="flex-1">
          {letters.map(l => (
            <div key={l} id={`glossary-${l}`}>
              <h2 className="text-2xl font-bold text-blue-400 mb-3 mt-8">{l}</h2>
              <div className="space-y-3">
                {grouped[l].map(entry => (
                  <div
                    key={entry.id}
                    className="border-b border-gray-800 pb-3"
                  >
                    <p className="text-white font-semibold">{entry.term}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{entry.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop alpha nav */}
        <div className="hidden md:flex w-12 flex-col fixed right-6 top-1/2 -translate-y-1/2 gap-1">
          {letters.map(l => (
            <button
              key={l}
              onClick={() => document.getElementById(`glossary-${l}`)?.scrollIntoView({ behavior: 'smooth' })}
              className={`text-xs w-6 h-6 flex items-center justify-center rounded transition-colors ${
                activeL === l
                  ? 'text-blue-400 font-bold bg-gray-800'
                  : 'text-gray-500 hover:text-white hover:bg-gray-700'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <BackToTop />
    </div>
  )
}
