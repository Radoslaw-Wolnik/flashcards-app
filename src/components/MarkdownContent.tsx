import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { normalizeMarkdown } from '../utils/markdown'

type MarkdownVariant = 'answer' | 'question' | 'compact'

interface MarkdownContentProps {
  children: string
  className?: string
  variant?: MarkdownVariant
}

const variantClass: Record<MarkdownVariant, string> = {
  answer: 'markdown-content markdown-content-answer',
  question: 'markdown-content markdown-content-question',
  compact: 'markdown-content markdown-content-compact'
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({
  children,
  className = '',
  variant = 'answer'
}) => {
  const normalized = useMemo(() => normalizeMarkdown(children), [children])

  return (
    <ReactMarkdown
      className={`${variantClass[variant]} ${className}`.trim()}
      remarkPlugins={[
        remarkGfm,
        [remarkMath, { singleDollarTextMath: true }]
      ]}
      rehypePlugins={[
        [rehypeKatex, {
          output: 'html',
          strict: false,
          throwOnError: false
        }]
      ]}
    >
      {normalized}
    </ReactMarkdown>
  )
}
