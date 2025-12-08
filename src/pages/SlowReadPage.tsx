// src/pages/SlowReadPage.tsx
import React, { useEffect, useState } from 'react'
import { getAllFlashcards } from '../utils/dataUtils'
import { SubjectFilter } from '../components/FilterControls/SubjectFilter'
import { ReadModeFlashcardViewer } from '../components/SlowRead/ReadModeFlashcardViewer'
import type { Flashcard } from '../types/flashcard'

const SlowReadPage: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string>('')
  const [cards, setCards] = useState<Flashcard[]>([])

  // Load/filter cards when subject changes
  useEffect(() => {
    const all = getAllFlashcards()
    const filtered = subjectId ? all.filter((c) => c.subjectId === subjectId) : []
    setCards(filtered)
  }, [subjectId])

  return (
    <div className="container mx-auto px-4 flex flex-col items-center min-h-screen py-6">
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
        <div className="text-gray-500 mt-12 text-center">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-xl mb-2">No flashcards found</p>
          <p className="text-gray-400">Select a subject to begin.</p>
        </div>
      )}
    </div>
  )
}

export default SlowReadPage