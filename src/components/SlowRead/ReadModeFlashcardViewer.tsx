// src/components/Flashcard/ReadModeFlashcardViewer.tsx
import React, { useCallback, useRef, useState, useEffect } from 'react'
import { FlashcardCarousel } from '../Flashcard/FlashcardCarousel'

// Icons
const ChevronLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

interface ReadModeFlashcardViewerProps {
  cards: Array<{
    id: string
    question: string
    answer: string
  }>
  initialIndex?: number
  onIndexChange?: (index: number) => void
  showNavigation?: boolean
  showProgress?: boolean
}

export const ReadModeFlashcardViewer: React.FC<ReadModeFlashcardViewerProps> = ({
  cards,
  initialIndex = 0,
  onIndexChange,
  showNavigation = true,
  showProgress = true
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isFlipped, setIsFlipped] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Touch/swipe handling
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const isSwiping = useRef(false)

  const currentCard = cards[currentIndex] || null

  const navigateWithAnimation = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating || cards.length === 0) return
    
    setIsAnimating(true)
    setSlideDirection(direction === 'next' ? 'left' : 'right')
    
    setTimeout(() => {
      const newIndex = direction === 'next' 
        ? (currentIndex + 1) % cards.length
        : (currentIndex - 1 + cards.length) % cards.length
      
      setCurrentIndex(newIndex)
      setIsFlipped(false)
      onIndexChange?.(newIndex)
      
      setTimeout(() => {
        setSlideDirection(null)
        setIsAnimating(false)
      }, 50)
    }, 300)
  }, [currentIndex, cards.length, isAnimating, onIndexChange])

  const handleNext = useCallback(() => navigateWithAnimation('next'), [navigateWithAnimation])
  const handlePrev = useCallback(() => navigateWithAnimation('prev'), [navigateWithAnimation])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwiping.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current || isAnimating) return
    
    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY
    
    const deltaX = Math.abs(touchX - touchStartX.current)
    const deltaY = Math.abs(touchY - touchStartY.current)
    
    if (deltaX > 10 && deltaX > deltaY * 1.5) {
      isSwiping.current = true
    }
  }, [isAnimating])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartX.current || isAnimating) return
    
    const touchEndX = e.changedTouches[0].clientX
    const deltaX = touchStartX.current - touchEndX
    const MIN_SWIPE = 50
    
    if (isSwiping.current && Math.abs(deltaX) > MIN_SWIPE) {
      if (deltaX > 0) handleNext()
      else if (deltaX < 0) handlePrev()
    }
    
    touchStartX.current = null
    touchStartY.current = null
    isSwiping.current = false
  }, [isAnimating, handleNext, handlePrev])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === 'ArrowRight') handleNext()
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNext, handlePrev])

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-4xl mb-4">📚</div>
        <p className="text-lg">No cards to display</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full">
      
      
      {/* Main Card Area */}
      <div 
        className="w-full flex items-center justify-center min-h-[500px] md:min-h-[600px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Desktop Navigation - Left */}
        {showNavigation && (
          <div className="hidden md:block mr-4">
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              className="p-4 bg-white rounded-full shadow-lg hover:shadow-2xl transition-shadow disabled:opacity-50"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Card Container */}
        <div className="flex-1 max-w-4xl">
          <FlashcardCarousel
            currentCard={currentCard}
            isFlipped={isFlipped}
            onFlip={setIsFlipped}
            slideDirection={slideDirection}
          />

          {/* Mobile Navigation & Swipe Hint */}
          {showNavigation && (
            <>
              <div className="md:hidden flex justify-center space-x-12 mt-6">
                <button
                  onClick={handlePrev}
                  disabled={isAnimating}
                  className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                  aria-label="Previous card"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50"
                  aria-label="Next card"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
              <div className="md:hidden mt-4 text-center text-sm text-gray-500">
                <div className="flex items-center justify-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  <span>Swipe to change cards</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Desktop Navigation - Right */}
        {showNavigation && (
          <div className="hidden md:block ml-4">
            <button
              onClick={handleNext}
              disabled={isAnimating}
              className="p-4 bg-white rounded-full shadow-lg hover:shadow-2xl transition-shadow disabled:opacity-50"
              aria-label="Next card"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}


        
      </div>

      {/* Progress Tracker */}
      {showProgress && cards.length > 0 && (
        <div className="w-full max-w-4xl mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span>{Math.round(((currentIndex + 1) / cards.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}