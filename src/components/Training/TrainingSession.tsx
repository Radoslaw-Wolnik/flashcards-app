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
                <div className="soft-panel p-6">
                  <p className="text-center font-medium mb-6 text-slate-700">
                    Rate your knowledge:
                  </p>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={viewer.actions.handleDontKnow}
                      disabled={viewer.actions.isAnimating}
                      className="danger-action flex-1"
                    >
                      I don't know
                    </button>
                    
                    <button
                      onClick={viewer.actions.handleKnow}
                      disabled={viewer.actions.isAnimating}
                      className="success-action flex-1"
                    >
                      I know
                    </button>
                    
                  </div>
                  
                  <div className="mt-6 text-center text-sm text-slate-500">
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
          className="secondary-action"
        >
          End Training Session
        </button>
      </div>
    </div>
  )
}
