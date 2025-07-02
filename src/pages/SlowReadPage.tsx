// src/pages/SlowReadPage.tsx

import React, { useState, useEffect } from 'react'
import { getAllFlashcards } from '../utils/dataUtils'
import { SubjectFilter } from '../components/FilterControls/SubjectFilter'
import { FlashcardRead } from '../components/Flashcard/FlashcardRead'
import type { Flashcard } from '../types/flashcard'

const SlowReadPage: React.FC = () => {
  const [subjectId, setSubjectId] = useState<string>('')
  const [cards, setCards] = useState<Flashcard[]>([])
  const [index, setIndex] = useState(0)

  // Load and filter cards whenever subject changes
  useEffect(() => {
    const all = getAllFlashcards()
    const filtered = subjectId
      ? all.filter(c => c.subjectId === subjectId)
      : []
    setCards(filtered)
    setIndex(0)
  }, [subjectId])

  const prev = () => setIndex(i => Math.max(0, i - 1))
  const next = () => setIndex(i => Math.min(cards.length - 1, i + 1))

  return (
    <div className="container mx-auto px-4 flex flex-col items-center">
      {/* Subject dropdown */}
      <div className="w-full max-w-md my-4">
        <SubjectFilter
          value={subjectId}
          onChange={setSubjectId}
          // optional: pass categoryId/teacherId if needed
        />
      </div>

      {cards.length > 0 ? (
        <>
          <div
            className="w-full flex items-center justify-between"
            style={{ height: '70vh' }}
          >
            <button
              onClick={prev}
              disabled={index === 0}
              className="p-4 text-2xl"
            >
              ←
            </button>

            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-3xl">
                <FlashcardRead
                  question={cards[index].question}
                  answer={cards[index].answer}
                />
              </div>
            </div>

            <button
              onClick={next}
              disabled={index === cards.length - 1}
              className="p-4 text-2xl"
            >
              →
            </button>
          </div>

          {/* Counter */}
          <div className="mt-2 text-gray-600">
            {index + 1} / {cards.length}
          </div>
        </>
      ) : (
        <div className="text-gray-500 mt-8">
          Please select a subject to begin.
        </div>
      )}
    </div>
  )
}

export default SlowReadPage
