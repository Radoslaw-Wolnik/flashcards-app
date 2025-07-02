import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface Props {
  question: string
  answer: string
}

export const FlashcardRead: React.FC<Props> = ({ question, answer }) => {
  const [show, setShow] = useState(false)

  return (
    <div
      className="border rounded-2xl p-4 shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => setShow(s => !s)}
    >
      <p className="font-medium">{question}</p>
      {show && (
        // Wrap the markdown in a styled div
        <div className="p-4 bg-gray-50 rounded-lg mb-4 prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {answer}
          </ReactMarkdown>
        </div>
      )}
      <div className="mt-2 text-sm text-gray-400 italic">
        {show ? 'Click to hide answer' : 'Click to show answer'}
      </div>
    </div>
  )
}
