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
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDontKnow}
              disabled={isAnimating}
              className="danger-action"
            >
              I don't know
            </button>
            
            <button
              onClick={handleKnow}
              disabled={isAnimating}
              className="success-action"
            >
              I know
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
