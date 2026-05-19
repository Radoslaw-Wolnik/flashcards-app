import React from 'react'

interface PageHeaderProps {
  title: string
  eyebrow?: string
  description?: string
  actions?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  eyebrow,
  description,
  actions
}) => (
  <section className="page-header">
    <div>
      {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
      <h1 className="page-title">{title}</h1>
      {description && <p className="page-description">{description}</p>}
    </div>
    {actions && (
      <div className="flex flex-wrap items-center gap-3">
        {actions}
      </div>
    )}
  </section>
)
