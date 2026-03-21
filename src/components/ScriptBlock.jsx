export default function ScriptBlock({ block }) {
  if (block.type === 'dialogue') {
    return (
      <div className="bg-gray-900 text-emerald-400 font-mono rounded-lg px-4 py-3 mb-2">
        {block.lines.map((line, i) => (
          <p key={i} className="py-0.5">{line}</p>
        ))}
      </div>
    )
  }

  if (block.type === 'cue') {
    return (
      <p className="text-white font-bold text-base uppercase tracking-wide mt-4 mb-1">
        {block.text}
      </p>
    )
  }

  if (block.type === 'note') {
    return (
      <div className="border-l-4 border-red-500 bg-red-950/40 text-red-300 text-sm px-4 py-2 rounded-r mb-2">
        ⚠ {block.text}
      </div>
    )
  }

  if (block.type === 'alert') {
    return (
      <div className="border-l-4 border-yellow-400 bg-yellow-950/40 text-yellow-300 text-sm px-4 py-2 rounded-r mb-2">
        ★ {block.text}
      </div>
    )
  }

  return null
}
