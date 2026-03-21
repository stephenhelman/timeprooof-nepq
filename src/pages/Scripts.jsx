import { trainingData } from '../data/trainingData'
import ScriptCard from '../components/ScriptCard'
import BackToTop from '../components/BackToTop'

const salesSections = trainingData.sections
  .filter(s => s.salesStep !== null)
  .sort((a, b) => a.salesStep - b.salesStep)

const operationalSections = trainingData.sections
  .filter(s => s.salesStep === null)

const orderedSections = [...salesSections, ...operationalSections]
  .filter(s => s.scripts && s.scripts.length > 0)

export default function Scripts() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Jump nav */}
      <div className="flex flex-wrap gap-2 mb-8">
        {orderedSections.map(s => (
          <button
            key={s.id}
            onClick={() => document.getElementById(`scripts-${s.id}`)?.scrollIntoView({ behavior: 'smooth' })}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full transition-colors"
          >
            {s.title}
          </button>
        ))}
      </div>

      {orderedSections.map((section, idx) => (
        <div key={section.id} id={`scripts-${section.id}`}>
          {idx > 0 && <hr className="border-gray-700 my-10" />}
          <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
          {section.scripts.map(sc => (
            <ScriptCard key={sc.id} script={sc} />
          ))}
        </div>
      ))}
      <BackToTop />
    </div>
  )
}
