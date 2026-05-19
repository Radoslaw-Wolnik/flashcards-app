// src/components/Training/TrainingConfigPanel.tsx
import React, { useMemo, useRef, useCallback } from 'react'
import { Play, Target } from 'lucide-react'
import type { Subject, Teacher } from '../../types/flashcard'

interface TrainingConfig {
  categoryId: 'maths' | 'cs' | ''
  teacherId: string
  subjectIds: string[]
  count: number | 'all'
}

interface TrainingConfigPanelProps {
  config: TrainingConfig
  availableSubjects: Subject[]
  availableTeachers: Teacher[]
  allCardsCount: Record<string, number> // subjectId -> card count
  availableCardsCount: number
  onConfigChange: (config: TrainingConfig) => void
  onStart: () => void
}

export const TrainingConfigPanel: React.FC<TrainingConfigPanelProps> = ({
  config,
  availableSubjects,
  availableTeachers,
  allCardsCount,
  availableCardsCount,
  onConfigChange,
  onStart
}) => {
  const selectAllRef = useRef<HTMLInputElement>(null)

  const toggleSubject = useCallback((id: string) => {
    const newSubjectIds = config.subjectIds.includes(id)
      ? config.subjectIds.filter(x => x !== id)
      : [...config.subjectIds, id]

    onConfigChange({ ...config, subjectIds: newSubjectIds })
  }, [config, onConfigChange])

  const handleSelectAll = useCallback(() => {
    if (availableSubjects.length === 0) return

    const allIds = availableSubjects.map(s => s.id)
    const isAllSelected = config.subjectIds.length === availableSubjects.length

    const newSubjectIds = isAllSelected ? [] : allIds
    onConfigChange({ ...config, subjectIds: newSubjectIds })
  }, [availableSubjects, config, onConfigChange])


  const questionCountOptions = useMemo(() => {
    const options = [5, 10, 20, 30, 50]
    return options.filter(option => option <= availableCardsCount)
  }, [availableCardsCount])

  const getStartButtonText = () => {
    if (config.count === 'all') {
      return `Start Training with ${availableCardsCount} cards`
    }
    return `Start Training with ${config.count} cards`
  }

  const isStartDisabled = availableSubjects.length === 0 || 
                         config.subjectIds.length === 0 || 
                         availableCardsCount === 0

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Ready to Train Header */}
      <div className="surface-card p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Target className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-950">Ready to Train?</h2>
        <p className="text-slate-600">
          Customize your training session below
        </p>
      </div>

      {/* Category & Teacher Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Category</label>
          <select
            className="select-input"
            value={config.categoryId}
            onChange={e => onConfigChange({ 
              ...config, 
              categoryId: e.target.value as 'maths' | 'cs' | '' 
            })}
          >
            <option value="">All Categories</option>
            <option value="maths">Maths</option>
            <option value="cs">Computer Science</option>
          </select>
        </div>
        
        <div>
          <label className="field-label">Teacher</label>
          <select
            className="select-input"
            value={config.teacherId}
            onChange={e => onConfigChange({ ...config, teacherId: e.target.value })}
          >
            <option value="">All Teachers</option>
            {availableTeachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject Selection */}
      {availableSubjects.length > 0 && (
        <div className="surface-card p-5">
          <label className="inline-flex items-center font-medium mb-4">
            <input
              type="checkbox"
              ref={selectAllRef}
              className="h-5 w-5 accent-blue-600"
              checked={config.subjectIds.length === availableSubjects.length}
              onChange={handleSelectAll}
            />
            <span className="ml-2 text-lg">
              {config.teacherId 
                ? `Select all subjects taught by ${availableTeachers.find(t => t.id === config.teacherId)?.name || 'selected teacher'}`
                : "Select All"
              }
            </span>
          </label>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-2">
            {availableSubjects.map(subject => (
              <label 
                key={subject.id} 
                className="inline-flex items-center p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-blue-600"
                  checked={config.subjectIds.includes(subject.id)}
                  onChange={() => toggleSubject(subject.id)}
                />
                <span className="ml-3 font-medium">{subject.name}</span>
                <span className="ml-2 text-sm text-slate-500">
                  ({allCardsCount[subject.id] || 0})
                </span>
              </label>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-slate-500">
            {config.subjectIds.length} of {availableSubjects.length} subjects selected
            {config.subjectIds.length > 0 && (
              <span className="ml-2 font-medium">
                • {availableCardsCount} cards available
              </span>
            )}
          </div>
        </div>
      )}

      {/* Number of Questions */}
      <div className="surface-card p-5">
        <label className="block mb-3 font-semibold text-lg text-slate-800">Number of Questions</label>
        
        {availableCardsCount > 0 ? (
          <>
            <div className="flex flex-wrap gap-3 mb-4">
              {questionCountOptions.map(num => (
                <button
                  key={num}
                  onClick={() => onConfigChange({ ...config, count: num })}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    config.count === num 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {num} questions
                </button>
              ))}
              
              <button
                onClick={() => onConfigChange({ ...config, count: 'all' })}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  config.count === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({availableCardsCount})
              </button>
            </div>
            
            <div className="mt-4 text-sm text-slate-500">
              {config.count === 'all' 
                ? `Training with all ${availableCardsCount} available cards` 
                : `Training with ${config.count} randomly selected cards`}
            </div>
          </>
        ) : (
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <p className="text-slate-500">
              {availableSubjects.length === 0
                ? "No subjects available for current filters"
                : config.subjectIds.length === 0 
                ? "Select subjects to see available cards" 
                : "No cards available for selected subjects"}
            </p>
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="text-center pt-6">
        <button
          onClick={onStart}
          disabled={isStartDisabled}
          className="primary-action flex-col px-8 py-4 text-lg"
        >
          <span className="flex items-center gap-2 font-bold">
            <Play className="h-5 w-5" aria-hidden="true" />
            {getStartButtonText()}
          </span>
          <div className="text-sm opacity-90 mt-1">
            {config.subjectIds.length} subject{config.subjectIds.length !== 1 ? 's' : ''}
            {config.teacherId && (
              <span> • Teacher: {availableTeachers.find(t => t.id === config.teacherId)?.name}</span>
            )}
          </div>
        </button>
        
        {availableSubjects.length === 0 && (
          <p className="mt-3 text-amber-600 text-sm">
            Please adjust your category or teacher selection to see available subjects.
          </p>
        )}
        
        {availableSubjects.length > 0 && config.subjectIds.length === 0 && (
          <p className="mt-3 text-amber-600 text-sm">
            Please select at least one subject to train.
          </p>
        )}
        
        {config.subjectIds.length > 0 && availableCardsCount === 0 && (
          <p className="mt-3 text-amber-600 text-sm">
            No flashcards available for selected subjects.
          </p>
        )}
      </div>
    </div>
  )
}
