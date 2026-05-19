import React, { useState, useMemo, useCallback } from 'react'
import type { Subject } from '../types/flashcard'
import type { Flashcard } from '../types/flashcard'
import rawSubjects from '../data/subjects.json'
import { getAllFlashcards } from '../utils/dataUtils'
import { filterFlashcards } from '../utils/filterUtils'
import { ReadingFilterPanel } from '../components/Reading/ReadingFilterPanel'
import { SubjectAccordion } from '../components/Reading/SubjectAccordion'
import { PageHeader } from '../components/PageHeader'
import { BookOpenCheck, Brain, Filter, LibraryBig, Search, Sigma, X } from 'lucide-react'

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
    return allCards.reduce<Record<string, number>>((counts, card) => {
      counts[card.subjectId] = (counts[card.subjectId] || 0) + 1
      return counts
    }, {})
  }, [allCards])

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
    <main className="page-shell">
      <PageHeader
        eyebrow="Reading mode"
        title="Browse Flashcards"
        description="Scan every question, filter by subject or teacher, and open the answers without starting a practice session."
      />

      {/* Search Bar and Controls */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or answers..."
              className="text-input pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`secondary-action py-3 ${
              showFilters
                ? 'border-blue-200 bg-blue-50 text-blue-700'
                : ''
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
          <div>
            Showing <span className="font-semibold">{groupedBySubject.length}</span> subjects •{' '}
            <span className="font-semibold">{totalCardsCount}</span> cards
          </div>
          {groupedBySubject.length > 0 && (
            <button
              onClick={toggleAllSubjects}
              className="font-semibold text-blue-600 hover:text-blue-800"
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
          <div className="surface-card border-dashed py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <LibraryBig className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              No flashcards found
            </h3>
            <p className="text-slate-500 mb-4">
              Try adjusting your filters or search term
            </p>
            <button
              onClick={clearAllFilters}
              className="primary-action"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      {groupedBySubject.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat-card text-center">
              <BookOpenCheck className="mx-auto mb-2 h-5 w-5 text-blue-700" aria-hidden="true" />
              <div className="text-2xl font-bold text-blue-700">{groupedBySubject.length}</div>
              <div className="text-sm text-slate-600">Subjects</div>
            </div>
            <div className="stat-card text-center">
              <Brain className="mx-auto mb-2 h-5 w-5 text-teal-700" aria-hidden="true" />
              <div className="text-2xl font-bold text-teal-700">
                {searchedCards.filter(c => c.type === 'memorize').length}
              </div>
              <div className="text-sm text-slate-600">Memorization Cards</div>
            </div>
            <div className="stat-card text-center">
              <Sigma className="mx-auto mb-2 h-5 w-5 text-amber-700" aria-hidden="true" />
              <div className="text-2xl font-bold text-amber-700">
                {searchedCards.filter(c => c.type === 'understand').length}
              </div>
              <div className="text-sm text-slate-600">Understanding Cards</div>
            </div>
            <div className="stat-card text-center">
              <LibraryBig className="mx-auto mb-2 h-5 w-5 text-slate-700" aria-hidden="true" />
              <div className="text-2xl font-bold text-slate-800">{totalCardsCount}</div>
              <div className="text-sm text-slate-600">Total Cards</div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
