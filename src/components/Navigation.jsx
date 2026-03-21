import { NavLink } from 'react-router-dom'

export default function Navigation() {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto">
        <span className="text-white font-bold text-sm whitespace-nowrap py-3 pr-4 border-r border-gray-700 mr-2">
          TIMEPROOF Training
        </span>
        {[
          { to: '/',            label: 'Overview'   },
          { to: '/section',     label: 'By Section' },
          { to: '/scripts',     label: 'Scripts'    },
          { to: '/flashcards',  label: 'Flashcards' },
          { to: '/glossary',    label: 'Glossary'   },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
