import React, { useCallback, useState } from 'react'
import { FlashcardCarousel } from '../Flashcard/FlashcardCarousel'
import type { Flashcard } from '../../types/flashcard'

interface ExamSessionProps {
  currentRound: number
  totalRounds: number
  currentCard: Flashcard | null
  cardIndex: number
  totalCardsInRound: number
  correctCount: number
  incorrectCount: number
  onAnswer: (isCorrect: boolean) => void
  onEndExam: () => void
}

export const ExamSession: React.FC<ExamSessionProps> = ({
  currentRound,
  totalRounds,
  currentCard,
  cardIndex,
  totalCardsInRound,
  correctCount,
  incorrectCount,
  onAnswer,
  onEndExam
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

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="flex w-full max-w-6xl flex-col gap-3 md:flex-row md:items-center">
        <div className="surface-card flex min-w-0 flex-1 flex-col sm:flex-row items-center justify-between p-4">
          <div className="flex items-center space-x-6 mb-3 sm:mb-0">
            <div className="text-center">
              <div className="text-sm text-amber-700 font-semibold">Round</div>
              <div className="text-xl font-bold">
                {currentRound} <span className="text-slate-400 text-sm">/ {totalRounds}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-amber-700 font-semibold">Correct</div>
              <div className="text-xl font-bold text-teal-700">{correctCount}</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-amber-700 font-semibold">Incorrect</div>
              <div className="text-xl font-bold text-red-600">{incorrectCount}</div>
            </div>
          </div>
          
          <div className="text-center sm:text-right">
            <div className="text-sm text-amber-700 font-semibold">Current Round</div>
            <div className="text-xl font-bold">
              {cardIndex + 1} <span className="text-slate-400 text-sm">/ {totalCardsInRound}</span>
            </div>
            <div className="text-xs text-slate-400">
              {totalCardsInRound - cardIndex - 1} question(s) remaining
            </div>
          </div>
        </div>

        <button
          onClick={onEndExam}
          className="secondary-action shrink-0"
        >
          End Exam
        </button>
      </div>
      
      {currentCard && (
        <div className="grid w-full max-w-6xl items-center gap-3 lg:grid-cols-[9rem_minmax(0,1fr)_9rem]">
          <div className="study-action-rail">
            <button
              onClick={handleDontKnow}
              disabled={isAnimating}
              className="danger-action"
            >
              I don't know
            </button>
          </div>

          <div className="min-w-0">
            <FlashcardCarousel
              currentCard={{
                id: currentCard.id,
                question: currentCard.question,
                answer: currentCard.answer
              }}
              isFlipped={isFlipped}
              onFlip={setIsFlipped}
              slideDirection={slideDirection}
              maxWidth="700px"
            />
          </div>

          <div className="study-action-rail">
            <button
              onClick={handleKnow}
              disabled={isAnimating}
              className="success-action"
            >
              I know
            </button>
          </div>

          <div className="study-mobile-actions">
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
