import React from 'react'

interface ProgressTrackerProps {
  round: number
  correctCount: number
  incorrectCount: number
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  round, correctCount, incorrectCount,
}) => (
  <div className="flex items-center space-x-4 p-2 bg-gray-50 rounded-2xl shadow">
    <span>Round: <strong>{round}</strong></span>
    <span>✔️ <strong>{correctCount}</strong></span>
    <span>❌ <strong>{incorrectCount}</strong></span>
  </div>
)
