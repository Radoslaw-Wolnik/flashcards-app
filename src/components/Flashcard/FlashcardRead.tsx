import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface Props {
  question: string
  answer: string
  height?: string // Optional fixed height
}

export const FlashcardRead: React.FC<Props> = ({ question, answer, height = '400px' }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setIsFlipped(!isFlipped)
    
    // Reset animation state after transition
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Card Container */}
      <div
        className={`absolute w-full h-full cursor-pointer transition-all duration-300 ${
          isAnimating ? 'pointer-events-none' : ''
        }`}
        onClick={handleClick}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        {/* Inner card that flips */}
        <div
          className="relative w-full h-full transition-transform duration-300"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Front of Card (Question) */}
          <div
            className="absolute w-full h-full backface-hidden border rounded-2xl p-6 shadow-lg bg-white flex flex-col 
transition-all duration-300 ease-in-out
hover:shadow-2xl hover:-translate-y-1 hover:bg-gray-50"
            style={{
              transform: 'rotateY(0deg)',
            }}
          >
            <div className="flex-1 overflow-hidden">
              
              <div className="h-full overflow-y-auto">
                <p className="text-lg text-gray-800 leading-relaxed text-center font-semibold">
                  {question}
                </p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-row">
                  <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-blue-600">QUESTION</span>
                </div>
                <div className="text-xs text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Back of Card (Answer) */}
          <div
            className="absolute w-full h-full backface-hidden border rounded-2xl p-6 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col border-blue-200"
            style={{
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="flex-1 overflow-hidden">
              
              <div className="h-full overflow-y-auto pr-2">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {answer}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex flex-row items-center">
                <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-green-600">ANSWER</span>
              </div>
                <div className="text-xs text-gray-400 flex flex-row gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>question</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}