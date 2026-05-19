import React from 'react'
import { ClipboardCheck, Play } from 'lucide-react'

interface ExamConfig {
  rounds: 1 | 3 | 5 | 10
}

interface ExamConfigPanelProps {
  config: ExamConfig
  onConfigChange: (config: ExamConfig) => void
  onStart: () => void
  availableTeachersCount: number
}

export const ExamConfigPanel: React.FC<ExamConfigPanelProps> = ({
  config,
  onConfigChange,
  onStart,
  availableTeachersCount
}) => {
  const roundOptions: { value: 1 | 3 | 5 | 10; label: string }[] = [
    { value: 1, label: '1 Round' },
    { value: 3, label: '3 Rounds' },
    { value: 5, label: '5 Rounds' },
    { value: 10, label: '10 Rounds' }
  ]

  const getStartButtonText = () => {
    return `Start Exam - ${config.rounds} Round${config.rounds > 1 ? 's' : ''}`
  }

  const isStartDisabled = availableTeachersCount === 0

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Exam Header */}
      <div className="surface-card p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
          <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-950">Ready for Your Exam?</h2>
        <p className="text-slate-600">
          Test your knowledge across all teachers. Each round includes one question from each teacher.
        </p>
      </div>

      {/* Exam Configuration */}
      <div className="surface-card p-5">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-amber-700">Exam Structure</h3>
          <div className="soft-panel p-4">
            <p className="text-slate-700">
              <span className="font-semibold">How it works:</span> Each round will include exactly{' '}
              <span className="font-bold">{availableTeachersCount}</span> questions - one from each teacher.
            </p>
          </div>
        </div>

        {/* Number of Rounds */}
        <div>
          <label className="block mb-3 font-medium text-lg">Number of Rounds</label>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {roundOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onConfigChange({ ...config, rounds: option.value })}
                className={`px-4 py-4 rounded-lg transition-all ${
                  config.rounds === option.value 
                    ? 'bg-amber-600 text-white shadow-sm transform -translate-y-1' 
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow'
                }`}
              >
                <div className="font-bold text-lg">{option.value}</div>
                <div className="text-sm opacity-90">round{option.value > 1 ? 's' : ''}</div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-slate-500">
            {config.rounds === 1
              ? 'Taking 1 round exam'
              : `Total: ${config.rounds * availableTeachersCount} questions across ${config.rounds} rounds`
            }
            {config.rounds > 1 && (
              <span className="block mt-1 text-amber-700 font-medium">
                • {availableTeachersCount} questions per round
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center pt-6">
        <button
          onClick={onStart}
          disabled={isStartDisabled}
          className="primary-action flex-col bg-amber-600 px-8 py-4 text-lg hover:bg-amber-700 focus:ring-amber-500"
        >
          <span className="flex items-center gap-2 font-bold">
            <Play className="h-5 w-5" aria-hidden="true" />
            {getStartButtonText()}
          </span>
          <div className="text-sm opacity-90 mt-1">
            {availableTeachersCount} teacher{availableTeachersCount !== 1 ? 's' : ''}
            {config.rounds > 1 && (
              <span> • {config.rounds * availableTeachersCount} total questions</span>
            )}
          </div>
        </button>
        
        {availableTeachersCount === 0 && (
          <p className="mt-3 text-amber-600 text-sm">
            No teachers with available questions found.
          </p>
        )}
      </div>
    </div>
  )
}
