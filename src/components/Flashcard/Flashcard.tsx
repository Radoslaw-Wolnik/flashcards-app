// src/components/Flashcard/Flashcard.tsx
import React from 'react'
import { HelpCircle, RotateCcw } from 'lucide-react'
import { MarkdownContent } from '../MarkdownContent'

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

const CardFooter: React.FC<{
  label: string
  accentClass: string
  children?: React.ReactNode
}> = ({ label, accentClass, children }) => (
  <div className="mt-4 md:mt-6 pt-4 border-t border-slate-200">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-2 h-6 rounded-full mr-3 ${accentClass}`} />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <div className="text-xs text-slate-400 flex items-center gap-2">{children}</div>
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
      className="study-card-frame relative w-full mx-auto"
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
            className="absolute w-full h-full border border-slate-200 rounded-lg p-4 md:p-6 shadow-study bg-study-paper flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-blue-200"
            style={{ 
              transform: 'rotateY(0deg)', 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden' 
            }}
          >
            <div className="flex-1 overflow-hidden min-h-0">
              <div className="h-full overflow-y-auto flex items-center justify-center p-2 md:p-4">
                <div className="w-full">
                  <MarkdownContent
                    variant="question"
                    className="text-center text-lg md:text-xl font-semibold"
                  >
                    {question}
                  </MarkdownContent>
                </div>
              </div>
            </div>

            <CardFooter label="QUESTION" accentClass="bg-blue-500">
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
              {!disableFlip && (
                <span className="hidden sm:inline text-xs">Click or press Space to flip</span>
              )}
            </CardFooter>
          </div>

          {/* BACK - Answer */}
          <div
            className="absolute w-full h-full border border-blue-100 rounded-lg p-4 md:p-6 shadow-study bg-white flex flex-col"
            style={{ 
              transform: 'rotateY(180deg)', 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden' 
            }}
          >
            <div className="flex-1 overflow-hidden min-h-0">
              <div className="h-full overflow-y-auto pr-2 p-2 md:p-4">
                <MarkdownContent variant="answer">
                  {answer}
                </MarkdownContent>
              </div>
            </div>

            <CardFooter label="ANSWER" accentClass="bg-green-500">
              <RotateCcw className="w-5 h-5" aria-hidden="true" />
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
