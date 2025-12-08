import React from 'react'

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
      <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm">
        <div className="text-5xl mb-4">📝</div>
        <h2 className="text-2xl font-bold mb-2">Ready for Your Exam?</h2>
        <p className="text-gray-600 mb-6">
          Test your knowledge across all teachers. Each round includes one question from each teacher.
        </p>
      </div>

      {/* Exam Configuration */}
      <div className="border rounded-xl p-5 bg-white shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-700">Exam Structure</h3>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-700">
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
                className={`px-4 py-4 rounded-xl transition-all ${
                  config.rounds === option.value 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform -translate-y-1' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow'
                }`}
              >
                <div className="font-bold text-lg">{option.value}</div>
                <div className="text-sm opacity-90">round{option.value > 1 ? 's' : ''}</div>
              </button>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            {config.rounds === 1
              ? 'Taking 1 round exam'
              : `Total: ${config.rounds * availableTeachersCount} questions across ${config.rounds} rounds`
            }
            {config.rounds > 1 && (
              <span className="block mt-1 text-purple-600 font-medium">
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
          className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          <span className="font-bold">{getStartButtonText()}</span>
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