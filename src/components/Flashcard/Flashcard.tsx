// src/components/Flashcard/Flashcard.tsx
import React, { useCallback, useRef, useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface Props {
  question: string
  answer: string
  /** Optional callback when user flips the card */
  onFlip?: (isFlipped: boolean) => void
  /** For controlled mode (if parent wants to control flip state) */
  isFlipped?: boolean
  /** If true, disables flipping (for special cases) */
  disableFlip?: boolean
  /** Custom aspect ratio, defaults to responsive based on screen size */
  aspectRatio?: 'traditional' | 'vertical' | 'square' | number
  /** Maximum width of the card */
  maxWidth?: string
}

// Aspect ratio presets
const ASPECT_RATIOS = {
  traditional: 5/3.5, // ~1.43:1 (traditional flashcard)
  vertical: 3/4,      // 0.75:1 (more vertical for mobile)
  square: 1,          // 1:1 (square)
}

// Small SVG components
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

// Reusable footer
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
  onFlip,
  isFlipped: externalIsFlipped,
  disableFlip = false,
  aspectRatio: customAspectRatio,
  maxWidth = '800px'
}) => {
  // Internal state for uncontrolled usage
  const [internalIsFlipped, setInternalIsFlipped] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const innerRef = useRef<HTMLDivElement | null>(null)
  
  // Responsive aspect ratio based on screen size
  const [responsiveAspectRatio, setResponsiveAspectRatio] = useState(ASPECT_RATIOS.traditional)
  const [windowWidth, setWindowWidth] = useState(0)

  // Track window size for responsive aspect ratio
  useEffect(() => {
    const updateWindowSize = () => {
      setWindowWidth(window.innerWidth)
      
      // Set aspect ratio based on screen size
      if (window.innerWidth < 640) { // Mobile
        setResponsiveAspectRatio(ASPECT_RATIOS.vertical)
      } else if (window.innerWidth >= 1536) { // Very large screens
        setResponsiveAspectRatio(ASPECT_RATIOS.square)
      } else { // Medium to large screens
        setResponsiveAspectRatio(ASPECT_RATIOS.traditional)
      }
    }
    
    updateWindowSize()
    window.addEventListener('resize', updateWindowSize)
    return () => window.removeEventListener('resize', updateWindowSize)
  }, [])

  // Calculate final aspect ratio
  const finalAspectRatio = customAspectRatio 
    ? (typeof customAspectRatio === 'string' ? ASPECT_RATIOS[customAspectRatio] : customAspectRatio)
    : responsiveAspectRatio

  // Calculate padding-bottom for aspect ratio
  const aspectRatioPercentage = `${(1 / finalAspectRatio) * 100}%`

  // Use external state if provided, otherwise internal
  const isControlled = externalIsFlipped !== undefined
  const isFlipped = isControlled ? externalIsFlipped : internalIsFlipped

  // Handle swipe gestures for mobile
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const isSwiping = useRef(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disableFlip) return
    
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwiping.current = false
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current || disableFlip) return
    
    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY
    
    const deltaX = Math.abs(touchX - touchStartX.current)
    const deltaY = Math.abs(touchY - touchStartY.current)
    
    // If horizontal movement is more significant than vertical, it's a swipe
    if (deltaX > 10 && deltaX > deltaY * 1.5) {
      isSwiping.current = true
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (disableFlip || !touchStartX.current || isAnimating) return
    
    const touchEndX = e.changedTouches[0].clientX
    const deltaX = touchStartX.current - touchEndX
    
    // If it was a swipe gesture, don't flip the card
    if (isSwiping.current && Math.abs(deltaX) > 20) {
      return
    }
    
    // Otherwise, treat it as a tap to flip the card
    handleFlip()
    
    touchStartX.current = null
    touchStartY.current = null
    isSwiping.current = false
  }

  const handleFlip = useCallback(() => {
    if (isAnimating || disableFlip) return
    
    setIsAnimating(true)
    const newFlippedState = !isFlipped
    
    // Update state
    if (!isControlled) {
      setInternalIsFlipped(newFlippedState)
    }
    
    // Call callback if provided
    if (onFlip) {
      onFlip(newFlippedState)
    }
  }, [isAnimating, disableFlip, isFlipped, isControlled, onFlip])

  const handleTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === 'transform') setIsAnimating(false)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleFlip()
      }
    },
    [handleFlip]
  )

  // Mobile swipe hint text
  const getSwipeHint = () => {
    if (windowWidth < 640) {
      return "Swipe left/right to change cards"
    }
    return "Click or press Space to flip"
  }

  return (
    <div 
      className="relative w-full mx-auto"
      style={{ 
        maxWidth,
        // Create aspect ratio container using padding-bottom technique
        paddingBottom: aspectRatioPercentage,
        height: 0
      }}
    >
      <div
        role={disableFlip ? undefined : "button"}
        aria-pressed={disableFlip ? undefined : isFlipped}
        tabIndex={disableFlip ? undefined : 0}
        onClick={disableFlip ? undefined : handleFlip}
        onKeyDown={disableFlip ? undefined : handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`absolute inset-0 ${disableFlip ? '' : 'cursor-pointer select-none'} transition-all duration-300 ${isAnimating ? 'pointer-events-none' : ''}`}
        style={{ perspective: 1000 }}
      >
        <div
          ref={innerRef}
          onTransitionEnd={handleTransitionEnd}
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
              <span className="hidden sm:inline text-xs">{getSwipeHint()}</span>
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
              <span className="hidden sm:inline text-xs">Click or press Space to flip back</span>
            </CardFooter>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcard