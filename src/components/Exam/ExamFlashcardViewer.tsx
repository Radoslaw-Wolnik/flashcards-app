import React, { useCallback, useState } from 'react'
import { FlashcardCarousel } from '../Flashcard/FlashcardCarousel'
import type { Flashcard } from '../../types/flashcard'

interface ExamFlashcardViewerProps {
  currentCard: Flashcard | null
  onAnswer: (isCorrect: boolean) => void
  children?: (props: {
    carousel: React.ReactNode
    actions: {
      handleKnow: () => void
      handleDontKnow: () => void
      isAnimating: boolean
    }
    currentCard: Flashcard | null
  }) => React.ReactNode
}

export const ExamFlashcardViewer: React.FC<ExamFlashcardViewerProps> = ({
  currentCard,
  onAnswer,
  children
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const performActionWithAnimation = useCallback((action: () => void) => {
    if (isAnimating || !currentCard) return
    
    setIsAnimating(true)
    setSlideDirection('left')
    
    setTimeout(() => {
      action()
      setIsFlipped(false)
      
      setTimeout(() => {
        setSlideDirection(null)
        setIsAnimating(false)
      }, 50)
    }, 300)
  }, [isAnimating, currentCard])

  const handleKnow = useCallback(() => {
    performActionWithAnimation(() => {
      onAnswer(true)
    })
  }, [performActionWithAnimation, onAnswer])

  const handleDontKnow = useCallback(() => {
    performActionWithAnimation(() => {
      onAnswer(false)
    })
  }, [performActionWithAnimation, onAnswer])

  const carousel = (
    <FlashcardCarousel
      currentCard={currentCard ? {
        id: currentCard.id,
        question: currentCard.question,
        answer: currentCard.answer
      } : null}
      isFlipped={isFlipped}
      onFlip={setIsFlipped}
      slideDirection={slideDirection}
    />
  )

  if (children) {
    return children({
      carousel,
      actions: {
        handleKnow,
        handleDontKnow,
        isAnimating
      },
      currentCard
    })
  }

  return (
    <div className="w-full">
      {carousel}
      {currentCard && (
        <div className="w-full max-w-2xl mt-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-center font-medium mb-6 text-gray-700">
              Rate your knowledge for this question:
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleDontKnow}
                disabled={isAnimating}
                className="px-6 py-3 flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                I don't know
              </button>
              
              <button
                onClick={handleKnow}
                disabled={isAnimating}
                className="px-6 py-3 flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                I know
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}