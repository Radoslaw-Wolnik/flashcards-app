// src/pages/SlowReadPage.tsx

import React, { useState, useEffect } from 'react'
import { getAllFlashcards } from '../utils/dataUtils'
import { SubjectFilter } from '../components/FilterControls/SubjectFilter'
import { FlashcardRead } from '../components/Flashcard/FlashcardRead'
import type { Flashcard } from '../types/flashcard'

const SlowReadPage: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string>('')
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  // Load and filter cards whenever subject changes
  useEffect(() => {
    const all = getAllFlashcards()
    const filtered = subjectId
      ? all.filter(c => c.subjectId === subjectId)
      : []
    setCards(filtered)
    setCurrentIndex(0)
  }, [subjectId])

  const handlePrev = () => {
    if (isAnimating || cards.length === 0) return
    
    setIsAnimating(true)
    setSlideDirection('right')
    
    const newIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1
    
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setSlideDirection(null)
      setIsAnimating(false)
    }, 300)
  }

  const handleNext = () => {
    if (isAnimating || cards.length === 0) return
    
    setIsAnimating(true)
    setSlideDirection('left')
    
    const newIndex = currentIndex === cards.length - 1 ? 0 : currentIndex + 1
    
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setSlideDirection(null)
      setIsAnimating(false)
    }, 300)
  }

  // Handle touch events for swipe on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    
    // Minimum swipe distance
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - go next
        handleNext()
      } else {
        // Swipe right - go prev
        handlePrev()
      }
    }
    
    setTouchStartX(null)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        handleNext()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, isAnimating, cards.length])

  return (
    <div className="container mx-auto px-4 flex flex-col items-center">
      {/* Subject dropdown */}
      <div className="w-full max-w-md my-4">
        <SubjectFilter
          value={subjectId}
          onChange={setSubjectId}
        />
      </div>

      {cards.length > 0 ? (
        <>
          <div
            className="w-full flex items-center justify-between"
            style={{ height: '70vh' }}
          >
            {/* Previous button */}
            <button
              onClick={handlePrev}
              disabled={isAnimating}
              aria-label="Previous"
              className={
                "group p-4 bg-white rounded-full shadow-lg transform " +
                "transition-all duration-300 ease-in-out " +
                "hover:-translate-y-1 hover:shadow-2xl " +
                "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 " +
                "disabled:opacity-50 disabled:cursor-not-allowed " +
                "active:scale-95"
              }
            >
              <span className="inline-block text-3xl leading-none transform transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-600">
                ←
              </span>
            </button>

            {/* Card container with swipe animation */}
            <div 
              className="flex-1 flex items-center justify-center overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="w-full max-w-3xl relative">
                {/* Card with slide animation */}
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    slideDirection === 'left' 
                      ? 'opacity-0 transform translate-x-full' 
                      : slideDirection === 'right' 
                      ? 'opacity-0 transform -translate-x-full'
                      : 'opacity-100 transform translate-x-0'
                  }`}
                  style={{ height: '400px' }}
                >
                  <FlashcardRead
                    question={cards[currentIndex].question}
                    answer={cards[currentIndex].answer}
                    height="100%"
                  />
                </div>
                
                {/* Swipe hint */}
                <div className="mt-4 text-center text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Swipe or use arrow keys
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={isAnimating}
              aria-label="Next"
              className={
                "group p-4 bg-white rounded-full shadow-lg transform " +
                "transition-all duration-300 ease-in-out " +
                "hover:-translate-y-1 hover:shadow-2xl " +
                "focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 " +
                "disabled:opacity-50 disabled:cursor-not-allowed " +
                "active:scale-95"
              }
            >
              <span className="inline-block text-3xl leading-none transform transition-transform duration-300 group-hover:scale-110 group-hover:text-indigo-600">
                →
              </span>
            </button>
          </div>

          {/* Counter with progress bar */}
          <div className="mt-6 w-full max-w-2xl">
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              ></div>
            </div>
            
            {/* Counter and navigation buttons */}
            <div className="flex items-center justify-between">
              <div className="text-gray-600">
                <span className="font-semibold text-lg">{currentIndex + 1}</span>
                <span className="text-gray-400"> / {cards.length}</span>
              </div>
              
              {/* Quick navigation buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (isAnimating) return
                    setCurrentIndex(0)
                    setSlideDirection('right')
                    setTimeout(() => setSlideDirection(null), 300)
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isAnimating}
                >
                  First
                </button>
                <button
                  onClick={() => {
                    if (isAnimating) return
                    setCurrentIndex(Math.floor(cards.length / 2))
                    setSlideDirection('left')
                    setTimeout(() => setSlideDirection(null), 300)
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isAnimating}
                >
                  Middle
                </button>
                <button
                  onClick={() => {
                    if (isAnimating) return
                    setCurrentIndex(cards.length - 1)
                    setSlideDirection('left')
                    setTimeout(() => setSlideDirection(null), 300)
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={isAnimating}
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-gray-500 mt-8 text-center">
          <div className="text-2xl mb-2">📚</div>
          <p className="mb-2">Please select a subject to begin.</p>
          <p className="text-sm text-gray-400">Cards will appear here once a subject is selected.</p>
        </div>
      )}
    </div>
  )
}

export default SlowReadPage