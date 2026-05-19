// src/components/Flashcard/TrainingFlashcardViewer.tsx
import React, { useCallback, useState } from 'react'
import { FlashcardCarousel } from '../Flashcard/FlashcardCarousel'
import type { SessionState } from '../../types/session'
import type { Flashcard } from '../../types/flashcard'
import { processNextCard } from '../../utils/sessionManager'

interface TrainingFlashcardViewerProps {
  session: SessionState
  onSessionUpdate: (session: SessionState) => void
  onRoundComplete?: () => void
  onSkip?: () => void
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

export const TrainingFlashcardViewer: React.FC<TrainingFlashcardViewerProps> = ({
  session,
  onSessionUpdate,
  onRoundComplete,
  children
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const currentCard = session.toReview[0] || null

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
      const updatedSession = { ...session }
      processNextCard(updatedSession, true)
      onSessionUpdate(updatedSession)
      
      if (updatedSession.toReview.length === 0) {
        onRoundComplete?.()
      }
    })
  }, [session, onSessionUpdate, onRoundComplete, performActionWithAnimation])

  const handleDontKnow = useCallback(() => {
    performActionWithAnimation(() => {
      const updatedSession = { ...session }
      processNextCard(updatedSession, false)
      onSessionUpdate(updatedSession)
      
      if (updatedSession.toReview.length === 0) {
        onRoundComplete?.()
      }
    })
  }, [session, onSessionUpdate, onRoundComplete, performActionWithAnimation])

  const carousel = (
    <FlashcardCarousel
      currentCard={currentCard}
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
          <div className="soft-panel p-6">
            <p className="text-center font-medium mb-6 text-slate-700">
              Rate your knowledge:
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleDontKnow}
                disabled={isAnimating}
                className="danger-action flex-1"
              >
                I don't know
              </button>
              
              <button
                onClick={handleKnow}
                disabled={isAnimating}
                className="success-action flex-1"
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
