import { trainingData } from '../data/trainingData'
import SectionHeader from '../components/SectionHeader'
import ScriptCard from '../components/ScriptCard'
import FlashCard from '../components/Flashcard'
import BackToTop from '../components/BackToTop'

const salesSections = trainingData.sections
  .filter(s => s.salesStep !== null)
  .sort((a, b) => a.salesStep - b.salesStep)

const operationalSections = trainingData.sections
  .filter(s => s.salesStep === null)

const orderedSections = [...salesSections, ...operationalSections]

export default function Overview() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {orderedSections.map((section, idx) => (
        <div key={section.id}>
          {idx > 0 && <hr className="border-gray-700 my-10" />}
          <SectionHeader section={section} />

          {section.scripts && section.scripts.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Scripts
              </h3>
              {section.scripts.map(sc => (
                <ScriptCard key={sc.id} script={sc} />
              ))}
            </div>
          )}

          {section.flashcards && section.flashcards.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Flashcards
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.flashcards.map(fc => (
                  <FlashCard key={fc.id} card={fc} />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      <BackToTop />
    </div>
  )
}
