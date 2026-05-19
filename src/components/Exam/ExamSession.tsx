import React, { useCallback, useState } from 'react'
import { FlashcardCarousel } from '../Flashcard/FlashcardCarousel'
//import { ProgressTracker } from '../ProgressTracker'
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
    <div className="flex flex-col items-center w-full">
      {/* Progress Tracker */}
      <div className="w-full max-w-4xl mb-6">
        <div className="surface-card flex flex-col sm:flex-row items-center justify-between p-4">
          <div className="flex items-center space-x-6 mb-4 sm:mb-0">
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
      </div>
      
      {/* Flashcard */}
      <div className="w-full">
        <FlashcardCarousel
          currentCard={currentCard ? {
            id: currentCard.id,
            question: currentCard.question,
            answer: currentCard.answer
          } : null}
          isFlipped={isFlipped}
          onFlip={setIsFlipped}
          slideDirection={slideDirection}
          maxWidth="700px"
        />
      </div>
      
      {/* Action Buttons */}
      {currentCard && (
        <div className="w-full max-w-2xl mt-8">
          <div className="soft-panel p-6">
            <p className="text-center font-medium mb-6 text-slate-700">
              Rate your knowledge for this question:
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
            
            <div className="mt-6 text-center text-sm text-slate-500">
              <p>Tip: Flip the card to check the answer before rating your knowledge.</p>
              <p className="mt-1">
                Questions in this round: One from each teacher ({totalCardsInRound} total)
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Exit Button */}
      <div className="mt-8">
        <button
          onClick={onEndExam}
          className="secondary-action"
        >
          End Exam
        </button>
      </div>
    </div>
  )
}
