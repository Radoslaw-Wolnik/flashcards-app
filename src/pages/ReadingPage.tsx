import React, { useState, useMemo, useCallback } from 'react'
import type { Subject } from '../types/flashcard'
import type { Flashcard } from '../types/flashcard'
import rawSubjects from '../data/subjects.json'
import { getAllFlashcards } from '../utils/dataUtils'
import { filterFlashcards } from '../utils/filterUtils'
import { ReadingFilterPanel } from '../components/Reading/ReadingFilterPanel'
import { SubjectAccordion } from '../components/Reading/SubjectAccordion'
import { Search, Filter } from 'lucide-react'

export const ReadingPage: React.FC = () => {
  // Filter states
  const [categoryId, setCategoryId] = useState<'maths' | 'cs' | ''>('')
  const [teacherId, setTeacherId] = useState<string>('')
  const [subjectId, setSubjectId] = useState<string>('')
  const [flashcardType, setFlashcardType] = useState<'memorize' | 'understand' | ''>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Expanded subjects state
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState<boolean>(true)

  const allCards = useMemo(() => getAllFlashcards(), [])
  const subjectsData = rawSubjects as Subject[]

  // Memoize filtered cards
  const filteredCards = useMemo(() => {
    return filterFlashcards(allCards, {
      categoryId: categoryId || undefined,
      teacherId: teacherId || undefined,
      subjectId: subjectId || undefined,
      flashcardType: flashcardType || undefined,
    })
  }, [allCards, categoryId, teacherId, subjectId, flashcardType])

  // Apply search filter
  const searchedCards = useMemo(() => {
    if (!searchQuery.trim()) return filteredCards
    
    const query = searchQuery.toLowerCase()
    return filteredCards.filter(card => 
      card.question.toLowerCase().includes(query) ||
      card.answer.toLowerCase().includes(query)
    )
  }, [filteredCards, searchQuery])

  // Group cards by subject
  const groupedBySubject = useMemo(() => {
    const groups: Record<string, Flashcard[]> = {}
    const subjectMap = subjectsData.reduce<Record<string, Subject>>((acc, subject) => {
      acc[subject.id] = subject
      return acc
    }, {})

    searchedCards.forEach(card => {
      const subject = subjectMap[card.subjectId]
      if (subject) {
        if (!groups[subject.id]) {
          groups[subject.id] = []
        }
        groups[subject.id].push(card)
      }
    })

    // Convert to array and filter based on additional filters
    return Object.entries(groups)
      .filter(([subjectId, cards]) => {
        const subject = subjectMap[subjectId]
        if (!subject) return false
        if (categoryId && subject.categoryId !== categoryId) return false
        if (teacherId && subject.teacherId !== teacherId) return false
        return cards.length > 0
      })
      .map(([subjectId, cards]) => ({
        subject: subjectMap[subjectId],
        cards
      }))
      .sort((a, b) => a.subject.name.localeCompare(b.subject.name))
  }, [searchedCards, subjectsData, categoryId, teacherId])

  // Calculate card counts per subject
  const cardCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    subjectsData.forEach(subject => {
      counts[subject.id] = allCards.filter(c => c.subjectId === subject.id).length
    })
    return counts
  }, [allCards, subjectsData])

  // Toggle subject expansion
  const toggleSubject = useCallback((subjectId: string) => {
    setExpandedSubjects(prev => {
      const next = new Set(prev)
      if (next.has(subjectId)) {
        next.delete(subjectId)
      } else {
        next.add(subjectId)
      }
      return next
    })
  }, [])

  // Expand/Collapse all
  const toggleAllSubjects = useCallback(() => {
    if (expandedSubjects.size === groupedBySubject.length) {
      setExpandedSubjects(new Set())
    } else {
      setExpandedSubjects(new Set(groupedBySubject.map(g => g.subject.id)))
    }
  }, [groupedBySubject, expandedSubjects.size])

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setCategoryId('')
    setTeacherId('')
    setSubjectId('')
    setFlashcardType('')
    setSearchQuery('')
  }, [])

  // Total cards count
  const totalCardsCount = searchedCards.length

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Flashcards</h1>
        <p className="text-gray-600">
          Browse and search through all available flashcards organized by subject
        </p>
      </div>

      {/* Search Bar and Controls */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or answers..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg border flex items-center gap-2 transition-colors ${
              showFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div>
            Showing <span className="font-semibold">{groupedBySubject.length}</span> subjects •{' '}
            <span className="font-semibold">{totalCardsCount}</span> cards
          </div>
          {groupedBySubject.length > 0 && (
            <button
              onClick={toggleAllSubjects}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {expandedSubjects.size === groupedBySubject.length 
                ? 'Collapse All' 
                : 'Expand All'}
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <ReadingFilterPanel
          categoryId={categoryId}
          teacherId={teacherId}
          subjectId={subjectId}
          flashcardType={flashcardType}
          onCategoryChange={setCategoryId}
          onTeacherChange={setTeacherId}
          onSubjectChange={setSubjectId}
          onTypeChange={setFlashcardType}
          onClearAll={clearAllFilters}
          cardCounts={cardCounts}
          visibleSubjectsCount={groupedBySubject.length}
          totalCardsCount={totalCardsCount}
        />
      )}

      {/* Subjects List */}
      <div className="space-y-4">
        {groupedBySubject.length > 0 ? (
          groupedBySubject.map(({ subject, cards }) => (
            <SubjectAccordion
              key={subject.id}
              subject={subject}
              cards={cards}
              isExpanded={expandedSubjects.has(subject.id)}
              onToggle={() => toggleSubject(subject.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No flashcards found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search term
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      {groupedBySubject.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{groupedBySubject.length}</div>
              <div className="text-sm text-gray-600">Subjects</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {searchedCards.filter(c => c.type === 'memorize').length}
              </div>
              <div className="text-sm text-gray-600">Memorization Cards</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-700">
                {searchedCards.filter(c => c.type === 'understand').length}
              </div>
              <div className="text-sm text-gray-600">Understanding Cards</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{totalCardsCount}</div>
              <div className="text-sm text-gray-600">Total Cards</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}