// src/components/ProgressTracker.tsx
import React from 'react'

interface ProgressTrackerProps {
  round: number
  correctCount: number
  incorrectCount: number
  totalCards?: number // Make optional
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  round,
  correctCount,
  incorrectCount,
  totalCards
}) => {
  const totalAnswered = correctCount + incorrectCount
  const sessionProgress = totalCards ? Math.round((totalAnswered / totalCards) * 100) : 0

  return (
    <div className="surface-card flex flex-col sm:flex-row items-center justify-between p-4">
      <div className="flex items-center space-x-6 mb-4 sm:mb-0">
        <div className="text-center">
          <div className="text-sm text-slate-500">Round</div>
          <div className="text-xl font-bold">{round}</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-slate-500">Correct</div>
          <div className="text-xl font-bold text-teal-700">{correctCount}</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-slate-500">Incorrect</div>
          <div className="text-xl font-bold text-red-600">{incorrectCount}</div>
        </div>
      </div>
      
      {totalCards && (
        <div className="text-center sm:text-right">
          <div className="text-sm text-slate-500">Session Progress</div>
          <div className="text-xl font-bold">{sessionProgress}%</div>
          <div className="text-xs text-slate-400">
            {totalAnswered} of {totalCards} cards
          </div>
        </div>
      )}
    </div>
  )
}
