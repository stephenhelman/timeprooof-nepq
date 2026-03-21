export default function SectionHeader({ section }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-2xl font-bold text-white">{section.title}</h2>
        {section.salesStep && (
          <span className="bg-blue-900 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full">
            Step {section.salesStep}
          </span>
        )}
      </div>
      {section.pages && (
        <p className="text-gray-500 text-xs mb-2">Pages {section.pages}</p>
      )}
      {section.summary && section.summary.length > 0 && (
        <ul className="list-disc ml-4 space-y-0.5">
          {section.summary.map((item, i) => (
            <li key={i} className="text-gray-400 text-sm">{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
