// src/components/Training/TrainingSession.tsx
import React from 'react'
import type { SessionState } from '../../types/session'
import { ProgressTracker } from '../ProgressTracker'
import { TrainingFlashcardViewer } from './TrainingFlashcardViewer'

interface TrainingSessionProps {
  session: SessionState
  onSessionUpdate: (session: SessionState) => void
  onRoundComplete: () => void
  onEndSession?: () => void
}

export const TrainingSession: React.FC<TrainingSessionProps> = ({
  session,
  onSessionUpdate,
  onRoundComplete
}) => {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-full max-w-6xl">
        <ProgressTracker
          round={session.round}
          correctCount={session.correct.length}
          incorrectCount={session.incorrect.length}
          totalCards={session.originalCards.length}
        />
      </div>
      
      <TrainingFlashcardViewer
        session={session}
        onSessionUpdate={onSessionUpdate}
        onRoundComplete={onRoundComplete}
      >
        {(viewer) => (
          <>
            {viewer.currentCard && (
              <div className="grid w-full max-w-6xl items-center gap-3 lg:grid-cols-[9rem_minmax(0,1fr)_9rem]">
                <div className="study-action-rail">
                  <button
                    onClick={viewer.actions.handleDontKnow}
                    disabled={viewer.actions.isAnimating}
                    className="danger-action"
                  >
                    I don't know
                  </button>
                </div>

                <div className="min-w-0">
                  {viewer.carousel}
                </div>

                <div className="study-action-rail">
                  <button
                    onClick={viewer.actions.handleKnow}
                    disabled={viewer.actions.isAnimating}
                    className="success-action"
                  >
                    I know
                  </button>
                </div>

                <div className="study-mobile-actions">
                  <button
                    onClick={viewer.actions.handleDontKnow}
                    disabled={viewer.actions.isAnimating}
                    className="danger-action"
                  >
                    I don't know
                  </button>
                  <button
                    onClick={viewer.actions.handleKnow}
                    disabled={viewer.actions.isAnimating}
                    className="success-action"
                  >
                    I know
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </TrainingFlashcardViewer>
    </div>
  )
}
