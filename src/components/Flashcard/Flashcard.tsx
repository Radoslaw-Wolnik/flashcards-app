// src/components/Flashcard/Flashcard.tsx
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface Props {
  question: string
  answer: string
  isFlipped: boolean
  onFlip?: () => void
  disableFlip?: boolean
  aspectRatio?: 'traditional' | 'vertical' | 'square' | number
  maxWidth?: string
}

// Aspect ratio presets
/*
const ASPECT_RATIOS = {
  traditional: 5/3.5,
  vertical: 3/4,
  square: 1,
}
*/

// SVG components
const IconQuestion = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>
)

const IconArrow = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
)

const CardFooter: React.FC<{
  label: string
  accentClass: string
  children?: React.ReactNode
}> = ({ label, accentClass, children }) => (
  <div className="mt-4 md:mt-6 pt-4 border-t border-gray-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-2 h-6 rounded-full mr-3 ${accentClass}`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-xs text-gray-400 flex items-center gap-2">{children}</div>
    </div>
  </div>
)

const Flashcard: React.FC<Props> = ({ 
  question, 
  answer, 
  isFlipped,
  onFlip,
  disableFlip = false,
  maxWidth = '800px'
}) => {

  const handleClick = () => {
    if (!disableFlip && onFlip) {
      onFlip()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onFlip && !disableFlip) {
      e.preventDefault()
      onFlip()
    }
  }

  return (
    <div
      className="relative w-full mx-auto aspect-3/4 md:aspect-[10/7] @min-[1200px]:aspect-square"
      style={{ maxWidth }}
    >
      <div
        role={disableFlip ? undefined : "button"}
        aria-pressed={isFlipped}
        tabIndex={disableFlip ? undefined : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`absolute inset-0 ${disableFlip ? '' : 'cursor-pointer'} transition-all duration-300`}
        style={{ perspective: 1000 }}
      >
        <div
          className="relative w-full h-full transition-transform duration-300"
          style={{ 
            transformStyle: 'preserve-3d', 
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' 
          }}
        >
          {/* FRONT - Question */}
          <div
            className="absolute w-full h-full border rounded-2xl p-4 md:p-6 shadow-lg bg-white flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:bg-gray-50"
            style={{ 
              transform: 'rotateY(0deg)', 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden' 
            }}
          >
            <div className="flex-1 overflow-hidden min-h-0">
              <div className="h-full overflow-y-auto flex items-center justify-center p-2 md:p-4">
                <div className="w-full">
                  <p className="text-lg md:text-xl text-gray-800 leading-relaxed text-center font-semibold px-2">
                    {question}
                  </p>
                </div>
              </div>
            </div>

            <CardFooter label="QUESTION" accentClass="bg-blue-500">
              <IconQuestion />
              {!disableFlip && (
                <span className="hidden sm:inline text-xs">Click or press Space to flip</span>
              )}
            </CardFooter>
          </div>

          {/* BACK - Answer */}
          <div
            className="absolute w-full h-full border rounded-2xl p-4 md:p-6 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col border-blue-200"
            style={{ 
              transform: 'rotateY(180deg)', 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden' 
            }}
          >
            <div className="flex-1 overflow-hidden min-h-0">
              <div className="h-full overflow-y-auto pr-2 prose prose-sm max-w-none p-2 md:p-4">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]} 
                  rehypePlugins={[rehypeKatex]}
                >
                  {answer}
                </ReactMarkdown>
              </div>
            </div>

            <CardFooter label="ANSWER" accentClass="bg-green-500">
              <IconArrow />
              {!disableFlip && (
                <span className="hidden sm:inline text-xs">Click or press Space to flip back</span>
              )}
            </CardFooter>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcard