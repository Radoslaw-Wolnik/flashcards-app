import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Reading' },
  { to: '/training', label: 'Training' },
  { to: '/exam', label: 'Exam' },
  { to: '/slow-read', label: 'Slow Read' }
]

export const Header: React.FC = () => {
  const { pathname } = useLocation()
  return (
    <header className="bg-white shadow mb-6">
      <nav className="container mx-auto px-4 py-3 flex space-x-6">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`hover:underline ${
              pathname === l.to ? 'font-semibold text-blue-600' : 'text-gray-700'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
