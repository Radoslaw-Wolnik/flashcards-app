import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface Props {
  question: string
  answer: string
  showAnswer: boolean
}

export const FlashcardTraining: React.FC<Props> = ({
  question, answer, showAnswer
}) => (
  <div className="flex flex-col h-full border-2 border-blue-300 rounded-2xl p-6 shadow-lg">
    <div className="flex-grow overflow-auto">
      <div className="text-lg font-medium text-center mb-6">
        {question}
      </div>
      {showAnswer && (
        // Again, wrap for styling
        <div className="p-4 bg-gray-50 rounded-lg prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {answer}
          </ReactMarkdown>
        </div>
      )}
    </div>
  </div>
)
