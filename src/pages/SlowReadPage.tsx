// src/pages/SlowReadPage.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAllFlashcards } from '../utils/dataUtils'
import { SubjectFilter } from '../components/FilterControls/SubjectFilter'
import Flashcard from '../components/Flashcard/Flashcard'
import type { Flashcard as FlashcardType } from '../types/flashcard'

// --- Constants ---
// const TRANSITION_MS = 300

// --- Small presentational SVGs ---
const ChevronLeft = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

// --- Reusable UI parts ---
const NavButton: React.FC<{
  onClick: () => void
  disabled?: boolean
  'aria-label': string
  children: React.ReactNode
  className?: string
}> = ({ onClick, disabled, children, className = '', ...rest }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`group p-4 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${className}`}
    {...rest}
  >
    <span className="inline-block text-3xl leading-none transform transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-600">
      {children}
    </span>
  </button>
)

const ProgressBar: React.FC<{ value: number; total: number }> = ({ value, total }) => {
  const percent = total === 0 ? 0 : Math.round(((value + 1) / total) * 100)
  return (
    <div className="mt-6 w-full max-w-2xl">
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-gray-600">
          <span className="font-semibold text-lg">{value + 1}</span>
          <span className="text-gray-400"> / {total}</span>
        </div>
        <div className="text-sm text-gray-500">
          {percent}% complete
        </div>
      </div>
    </div>
  )
}

// --- Hook that manages carousel state and animation lifecycle ---
function useCarousel(length: number, initialIndex = 0) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false) // Track if current card is flipped

  // refs to avoid stale closures
  const currentIndexRef = useRef(currentIndex)
  const pendingIndexRef = useRef<number | null>(null)

  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  const clampIndex = useCallback((idx: number) => {
    if (length === 0) return 0
    // ensure positive modulo
    const mod = ((idx % length) + length) % length
    return mod
  }, [length])

  const goTo = useCallback((targetIndex: number, direction: 'left' | 'right') => {
    if (isAnimating || length === 0) return
    pendingIndexRef.current = clampIndex(targetIndex)
    setSlideDirection(direction)
    setIsAnimating(true)
    // Reset flip state when changing cards
    setIsFlipped(false)
  }, [isAnimating, length, clampIndex])

  const next = useCallback(() => {
    if (length === 0) return
    goTo(currentIndexRef.current + 1, 'left')
  }, [goTo, length])

  const prev = useCallback(() => {
    if (length === 0) return
    goTo(currentIndexRef.current - 1, 'right')
  }, [goTo, length])

  // commit pending index (called after transition)
  const commitPending = useCallback(() => {
    const pending = pendingIndexRef.current
    if (pending === null) return
    setCurrentIndex(pending)
    pendingIndexRef.current = null
    setSlideDirection(null)
    setIsAnimating(false)
  }, [])

  // reset when length changes (e.g. subject changed)
  useEffect(() => {
    setCurrentIndex((i) => (i >= length ? 0 : i))
    pendingIndexRef.current = null
    setSlideDirection(null)
    setIsAnimating(false)
    setIsFlipped(false)
  }, [length])

  return {
    currentIndex,
    slideDirection,
    isAnimating,
    isFlipped,
    setIsFlipped,
    next,
    prev,
    goTo,
    commitPending,
    setCurrentIndex,
  }
}

// --- Main page component ---
const SlowReadPage: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string>('')
  const [cards, setCards] = useState<FlashcardType[]>([])

  // Load/filter cards when subject changes
  useEffect(() => {
    const all = getAllFlashcards()
    const filtered = subjectId ? all.filter((c) => c.subjectId === subjectId) : []
    setCards(filtered)
  }, [subjectId])

  const carousel = useCarousel(cards.length, 0)

  // swipe handling
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const isSwiping = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwiping.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return
    
    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY
    
    const deltaX = Math.abs(touchX - touchStartX.current)
    const deltaY = Math.abs(touchY - touchStartY.current)
    
    // If horizontal movement is more significant than vertical, it's a swipe
    if (deltaX > 20 && deltaX > deltaY * 1.5) {
      isSwiping.current = true
    }
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || carousel.isAnimating) return
    
    const touchEndX = e.changedTouches[0].clientX
    const deltaX = touchStartX.current - touchEndX
    const MIN_SWIPE = 50
    
    if (isSwiping.current && Math.abs(deltaX) > MIN_SWIPE) {
      if (deltaX > 0) carousel.next()
      else carousel.prev()
    }
    
    touchStartX.current = null
    touchStartY.current = null
    isSwiping.current = false
  }, [carousel])

  // keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') carousel.prev()
      else if (e.key === 'ArrowRight' || e.key === ' ') carousel.next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [carousel])

  // computed values
  const currentCard = useMemo(() => cards[carousel.currentIndex], [cards, carousel.currentIndex])

  // references for transition end on the sliding element
  const slidingRef = useRef<HTMLDivElement | null>(null)

  // When the sliding element finishes its transform/opacity transition we commit
  const onTransitionEnd = useCallback(() => {
    carousel.commitPending()
  }, [carousel])

  // Handle card flip
  const handleCardFlip = useCallback((isFlipped: boolean) => {
    carousel.setIsFlipped(isFlipped)
  }, [carousel])

  // quick navigation helpers
  const handleQuick = useCallback((targetIndex: number, direction: 'left' | 'right') => {
    if (carousel.isAnimating) return
    carousel.goTo(targetIndex, direction)
  }, [carousel])

  return (
    <div className="container mx-auto px-4 flex flex-col items-center min-h-screen py-6">
      <div className="w-full max-w-md mb-6">
        <SubjectFilter value={subjectId} onChange={setSubjectId} />
      </div>

      {cards.length > 0 ? (
        <>
          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Desktop Navigation - Left */}
            <div className="hidden md:flex">
              <NavButton onClick={carousel.prev} disabled={carousel.isAnimating} aria-label="Previous">
                <ChevronLeft />
              </NavButton>
            </div>

            {/* Main Card Area */}
            <div 
              className="w-full max-w-4xl flex-1 flex items-center justify-center min-h-[500px]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="w-full relative">
                <div
                  ref={slidingRef}
                  onTransitionEnd={onTransitionEnd}
                  className={`transition-all duration-300 ease-in-out ${
                    carousel.slideDirection === 'left'
                      ? 'opacity-0 transform translate-x-full'
                      : carousel.slideDirection === 'right'
                      ? 'opacity-0 transform -translate-x-full'
                      : 'opacity-100 transform translate-x-0'
                  }`}
                >
                  {currentCard ? (
                    <Flashcard
                      key={currentCard.id} // Reset flip state when card changes
                      question={currentCard.question}
                      answer={currentCard.answer}
                      isFlipped={carousel.isFlipped}
                      onFlip={handleCardFlip}
                      maxWidth="700px"
                    />
                  ) : null}
                </div>

                {/* Mobile Swipe Hint */}
                <div className="md:hidden mt-6 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Swipe to change cards</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Desktop Navigation Hint */}
                <div className="hidden md:block mt-6 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Use arrow keys or click buttons to navigate</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation - Right */}
            <div className="hidden md:flex">
              <NavButton onClick={carousel.next} disabled={carousel.isAnimating} aria-label="Next">
                <ChevronRight />
              </NavButton>
            </div>

            {/* Mobile Navigation Buttons */}
            <div className="md:hidden flex justify-center space-x-12 mt-6">
              <NavButton 
                onClick={carousel.prev} 
                disabled={carousel.isAnimating} 
                aria-label="Previous"
                className="p-3"
              >
                <ChevronLeft className="w-6 h-6" />
              </NavButton>
              <NavButton 
                onClick={carousel.next} 
                disabled={carousel.isAnimating} 
                aria-label="Next"
                className="p-3"
              >
                <ChevronRight className="w-6 h-6" />
              </NavButton>
            </div>
          </div>

          <ProgressBar value={carousel.currentIndex} total={cards.length} />

          {/* Quick Navigation */}
          <div className="mt-6 w-full max-w-2xl flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => handleQuick(0, 'right')}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
              disabled={carousel.isAnimating}
            >
              First
            </button>

            <button
              onClick={() => handleQuick(Math.floor(cards.length / 2), 'left')}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
              disabled={carousel.isAnimating}
            >
              Middle
            </button>

            <button
              onClick={() => handleQuick(cards.length - 1, 'left')}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
              disabled={carousel.isAnimating}
            >
              Last
            </button>

            <button
              onClick={() => handleQuick(Math.floor(Math.random() * cards.length), 'left')}
              className="px-4 py-2 text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors shadow-sm"
              disabled={carousel.isAnimating}
            >
              Random
            </button>
          </div>
        </>
      ) : (
        <div className="text-gray-500 mt-12 text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-xl mb-2">No flashcards found</p>
          <p className="text-gray-400">Select a subject to begin, or add flashcards to the database.</p>
        </div>
      )}
    </div>
  )
}

export default SlowReadPage