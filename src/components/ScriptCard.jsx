import ScriptBlock from './ScriptBlock'

export default function ScriptCard({ script }) {
  return (
    <div className="bg-gray-800 rounded-xl p-5 mb-4">
      <span className="bg-blue-900 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
        {script.title}
      </span>
      {script.alert && (
        <ScriptBlock block={{ type: 'alert', text: typeof script.alert === 'string' ? script.alert : script.alert.text }} />
      )}
      {script.content.map((block, i) => (
        <ScriptBlock key={i} block={block} />
      ))}
    </div>
  )
}
