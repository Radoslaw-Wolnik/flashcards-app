// src/pages/SlowReadPage.tsx
import React, { useMemo, useState } from 'react'
import { getAllFlashcards } from '../utils/dataUtils'
import { SubjectFilter } from '../components/FilterControls/SubjectFilter'
import { ReadModeFlashcardViewer } from '../components/SlowRead/ReadModeFlashcardViewer'
import type { Flashcard } from '../types/flashcard'
import { PageHeader } from '../components/PageHeader'
import { ScanLine } from 'lucide-react'

const SlowReadPage: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string>('')
  const allCards = useMemo(() => getAllFlashcards(), [])

  const cards = useMemo<Flashcard[]>(() => {
    return subjectId ? allCards.filter((card) => card.subjectId === subjectId) : []
  }, [allCards, subjectId])

  return (
    <main className="page-shell flex min-h-screen flex-col items-center">
      <PageHeader
        eyebrow="Slow read"
        title="Move through one subject calmly"
        description="Choose a subject and swipe or use the arrows to review the cards without scoring yourself."
      />

      <div className="w-full max-w-md mb-6">
        <SubjectFilter value={subjectId} onChange={setSubjectId} />
      </div>

      {cards.length > 0 ? (
        <div className="w-full">
          <ReadModeFlashcardViewer
            cards={cards}
            showNavigation={true}
            showProgress={true}
          />
        </div>
      ) : (
        <div className="surface-card mt-12 w-full max-w-md py-12 text-center text-slate-500">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <ScanLine className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-xl font-semibold text-slate-800 mb-2">No flashcards found</p>
          <p className="text-slate-500">Select a subject to begin.</p>
        </div>
      )}
    </main>
  )
}

export default SlowReadPage
