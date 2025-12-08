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
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow">
          <div className="flex items-center space-x-6 mb-4 sm:mb-0">
            <div className="text-center">
              <div className="text-sm text-purple-600 font-semibold">Round</div>
              <div className="text-xl font-bold">
                {currentRound} <span className="text-gray-400 text-sm">/ {totalRounds}</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-purple-600 font-semibold">Correct</div>
              <div className="text-xl font-bold text-green-600">{correctCount}</div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-purple-600 font-semibold">Incorrect</div>
              <div className="text-xl font-bold text-red-600">{incorrectCount}</div>
            </div>
          </div>
          
          <div className="text-center sm:text-right">
            <div className="text-sm text-purple-600 font-semibold">Current Round</div>
            <div className="text-xl font-bold">
              {cardIndex + 1} <span className="text-gray-400 text-sm">/ {totalCardsInRound}</span>
            </div>
            <div className="text-xs text-gray-400">
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
            
            <div className="mt-6 text-center text-sm text-gray-500">
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
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          End Exam
        </button>
      </div>
    </div>
  )
}