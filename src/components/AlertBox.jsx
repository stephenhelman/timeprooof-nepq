const styles = {
  note:    'border-l-4 border-red-500 bg-red-950/40 text-red-300',
  alert:   'border-l-4 border-yellow-400 bg-yellow-950/40 text-yellow-300',
  info:    'border-l-4 border-blue-500 bg-blue-950/40 text-blue-300',
  success: 'border-l-4 border-green-500 bg-green-950/40 text-green-300',
}

export default function AlertBox({ level = 'info', children }) {
  return (
    <div className={`${styles[level]} text-sm px-4 py-2 rounded-r mb-2`}>
      {children}
    </div>
  )
}
