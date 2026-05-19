import React from 'react'
import { NavLink } from 'react-router-dom'
import { BookOpenCheck, ClipboardCheck, LibraryBig, ScanLine, TimerReset } from 'lucide-react'

const links = [
  { to: '/', label: 'Reading', icon: LibraryBig },
  { to: '/training', label: 'Training', icon: TimerReset },
  { to: '/exam', label: 'Exam', icon: ClipboardCheck },
  { to: '/slow-read', label: 'Slow Read', icon: ScanLine }
]

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/92 shadow-sm backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <NavLink to="/" className="flex items-center gap-3 text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
            <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold leading-none text-teal-700">Licencjat</span>
            <span className="block text-lg font-bold leading-tight">Flashcards</span>
          </span>
        </NavLink>

        <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-950'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}
