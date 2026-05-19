import React, { useMemo } from 'react'
import { X } from 'lucide-react'
import type { Subject } from '../../types/flashcard'
import subjectsData from '../../data/subjects.json'
import teachersData from '../../data/teachers.json'

interface ReadingFilterPanelProps {
  categoryId: 'maths' | 'cs' | ''
  teacherId: string
  subjectId: string
  flashcardType: 'memorize' | 'understand' | ''
  onCategoryChange: (value: 'maths' | 'cs' | '') => void
  onTeacherChange: (value: string) => void
  onSubjectChange: (value: string) => void
  onTypeChange: (value: 'memorize' | 'understand' | '') => void
  onClearAll: () => void
  cardCounts: Record<string, number>
  visibleSubjectsCount: number
  totalCardsCount: number
}

export const ReadingFilterPanel: React.FC<ReadingFilterPanelProps> = ({
  categoryId,
  teacherId,
  subjectId,
  flashcardType,
  onCategoryChange,
  onTeacherChange,
  onSubjectChange,
  onTypeChange,
  onClearAll,
  cardCounts,
  visibleSubjectsCount,
  totalCardsCount
}) => {
  const subjects = subjectsData as Subject[]

  // Memoize filtered subjects for dropdown
  const filteredSubjects = useMemo(() => {
    let result = subjects
    if (categoryId) {
      result = result.filter(s => s.categoryId === categoryId)
    }
    if (teacherId) {
      result = result.filter(s => s.teacherId === teacherId)
    }
    return result
  }, [categoryId, teacherId, subjects])

  // Available teachers
  const availableTeachers = useMemo(() => {
    const teacherLookup = new Map(teachersData.map(teacher => [teacher.id, teacher.name]))
    const teacherMap = new Map<string, { id: string; name: string }>()
    subjects.forEach(subject => {
      if (subject.teacherId && !teacherMap.has(subject.teacherId)) {
        teacherMap.set(subject.teacherId, {
          id: subject.teacherId,
          name: teacherLookup.get(subject.teacherId) || subject.teacherId
        })
      }
    })
    
    if (teacherMap.size === 0 && teachersData.length > 0) {
      teachersData.forEach(teacher => {
        if (teacher.id) {
          teacherMap.set(teacher.id, teacher)
        }
      })
    }
    
    return Array.from(teacherMap.values())
  }, [subjects])

  // Filter badge components
  const FilterBadge: React.FC<{
    label: string
    onRemove: () => void
    colorClass: string
  }> = ({ label, onRemove, colorClass }) => (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${colorClass}`}>
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="ml-2 hover:opacity-75"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )

  return (
    <div className="surface-card p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Filter Flashcards</h2>
          <p className="text-sm text-slate-500">
            {visibleSubjectsCount} subject{visibleSubjectsCount !== 1 ? 's' : ''} • {totalCardsCount} card{totalCardsCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onClearAll}
          className="text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Clear All
        </button>
      </div>

      {/* Active Filters */}
      {(categoryId || teacherId || subjectId || flashcardType) && (
        <div className="mb-4 pb-4 border-b border-slate-100">
          <p className="text-sm text-slate-500 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {categoryId && (
              <FilterBadge
                label={`Category: ${categoryId === 'maths' ? 'Mathematics' : 'Computer Science'}`}
                onRemove={() => onCategoryChange('')}
                colorClass="bg-blue-100 text-blue-700"
              />
            )}
            {teacherId && (
              <FilterBadge
                label={`Teacher: ${availableTeachers.find(t => t.id === teacherId)?.name || teacherId}`}
                onRemove={() => onTeacherChange('')}
                colorClass="bg-purple-100 text-purple-700"
              />
            )}
            {subjectId && (
              <FilterBadge
                label={`Subject: ${subjects.find(s => s.id === subjectId)?.name || subjectId}`}
                onRemove={() => onSubjectChange('')}
                colorClass="bg-green-100 text-green-700"
              />
            )}
            {flashcardType && (
              <FilterBadge
                label={`Type: ${flashcardType === 'memorize' ? 'Memorization' : 'Understanding'}`}
                onRemove={() => onTypeChange('')}
                colorClass="bg-amber-100 text-amber-700"
              />
            )}
          </div>
        </div>
      )}

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="field-label">
            Category
          </label>
          <div className="flex flex-col space-y-2">
            {['', 'maths', 'cs'].map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat as 'maths' | 'cs' | '')}
                className={`px-3 py-2 rounded-lg text-left transition-colors ${
                  categoryId === cat
                    ? 'bg-blue-50 border border-blue-200 text-blue-700'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {cat === '' ? 'All Categories' : 
                 cat === 'maths' ? 'Mathematics' : 'Computer Science'}
              </button>
            ))}
          </div>
        </div>

        {/* Teacher Filter */}
        <div>
          <label className="field-label">
            Teacher
          </label>
          <div className="max-h-48 overflow-y-auto pr-2">
            <button
              onClick={() => onTeacherChange('')}
              className={`w-full px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                teacherId === ''
                  ? 'bg-purple-50 border border-purple-200 text-purple-700'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              All Teachers
            </button>
            {availableTeachers.map((teacher) => (
              <button
                key={teacher.id}
                onClick={() => onTeacherChange(teacher.id)}
                className={`w-full px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                  teacherId === teacher.id
                    ? 'bg-purple-50 border border-purple-200 text-purple-700'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {teacher.name}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="field-label">
            Subject
          </label>
          <div className="max-h-48 overflow-y-auto pr-2">
            <button
              onClick={() => onSubjectChange('')}
              className={`w-full px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                subjectId === ''
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              All Subjects
            </button>
            {filteredSubjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => onSubjectChange(subject.id)}
                className={`w-full px-3 py-2 rounded-lg text-left transition-colors mb-1 ${
                  subjectId === subject.id
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-medium">{subject.name}</div>
                <div className="text-xs text-slate-500">
                  {cardCounts[subject.id] || 0} cards
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="field-label">
            Card Type
          </label>
          <div className="flex flex-col space-y-2">
            {['', 'memorize', 'understand'].map((type) => (
              <button
                key={type}
                onClick={() => onTypeChange(type as 'memorize' | 'understand' | '')}
                className={`px-3 py-2 rounded-lg text-left transition-colors ${
                  flashcardType === type
                    ? 'bg-amber-50 border border-amber-200 text-amber-700'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {type === '' ? 'All Types' : 
                 type === 'memorize' ? 'Memorization' : 'Understanding'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
