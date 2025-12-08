// src/components/Training/TrainingSession.tsx
import React from 'react'
import type { SessionState } from '../../types/session'
// import type { Flashcard } from '../../types/flashcard'
import { ProgressTracker } from '../ProgressTracker'
import { TrainingFlashcardViewer } from './TrainingFlashcardViewer'

interface TrainingSessionProps {
  session: SessionState
  onSessionUpdate: (session: SessionState) => void
  onRoundComplete: () => void
  onEndSession: () => void
}

export const TrainingSession: React.FC<TrainingSessionProps> = ({
  session,
  onSessionUpdate,
  onRoundComplete,
  onEndSession
}) => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Progress Tracker */}
      <div className="w-full max-w-4xl mb-6">
        <ProgressTracker
          round={session.round}
          correctCount={session.correct.length}
          incorrectCount={session.incorrect.length}
          totalCards={session.originalCards.length}
        />
      </div>
      
      {/* Training Flashcard Viewer */}
      <TrainingFlashcardViewer
        session={session}
        onSessionUpdate={onSessionUpdate}
        onRoundComplete={onRoundComplete}
      >
        {(viewer) => (
          <>
            <div className="w-full">
              {viewer.carousel}
            </div>
            
            {/* Action Buttons */}
            {viewer.currentCard && (
              <div className="w-full max-w-2xl mt-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-center font-medium mb-6 text-gray-700">
                    Rate your knowledge:
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={viewer.actions.handleDontKnow}
                      disabled={viewer.actions.isAnimating}
                      className="px-6 py-3 flex-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      I don't know
                    </button>
                    
                    <button
                      onClick={viewer.actions.handleKnow}
                      disabled={viewer.actions.isAnimating}
                      className="px-6 py-3 flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      I know
                    </button>
                    
                  </div>
                  
                  <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Tip: You can flip the card to check the answer before rating, or rate immediately.</p>
                    <p className="mt-1">
                      {session.toReview.length - 1} card(s) remaining in this round
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </TrainingFlashcardViewer>
      
      {/* Exit Button */}
      <div className="mt-8">
        <button
          onClick={onEndSession}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          End Training Session
        </button>
      </div>
    </div>
  )
}