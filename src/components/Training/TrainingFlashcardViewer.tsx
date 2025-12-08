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
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-center font-medium mb-6 text-gray-700">
              Rate your knowledge:
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