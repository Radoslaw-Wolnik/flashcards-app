import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2'
  const styles = variant === 'primary'
    ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
    : 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 focus:ring-blue-500'

  return (
    <button
      className={`${base} ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
