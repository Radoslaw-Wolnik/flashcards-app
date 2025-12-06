// src/pages/ReadingPage.tsx

import React, { useState } from 'react'
import { getAllFlashcards } from '../utils/dataUtils'
import { filterFlashcards }  from '../utils/filterUtils'
import { CategoryFilter }    from '../components/FilterControls/CategoryFilter'
import { TeacherFilter }     from '../components/FilterControls/TeacherFilter'
import { SubjectFilter }     from '../components/FilterControls/SubjectFilter'
import { TypeFilter }        from '../components/FilterControls/TypeFilter'
import  FlashcardRead      from '../components/Flashcard/Flashcard'
// import type { Flashcard } from '../types/flashcard'

export const ReadingPage: React.FC = () => {
  const [categoryId, setCategoryId]       = useState<'maths'|'cs'|''>('')
  const [teacherId, setTeacherId]         = useState<string>('')
  const [subjectId, setSubjectId]         = useState<string>('')
  const [flashcardType, setFlashcardType] = useState<'memorize'|'understand'|''>('')

  const allCards = getAllFlashcards()
  const filtered = filterFlashcards(allCards, {
    categoryId:    categoryId    || undefined,
    teacherId:     teacherId     || undefined,
    subjectId:     subjectId     || undefined,
    flashcardType: flashcardType || undefined,
  })

  const clearAll = () => {
    setCategoryId('')
    setTeacherId('')
    setSubjectId('')
    setFlashcardType('')
  }

  const btnClass = "ml-2 text-gray-500 hover:text-gray-800"

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4 flex items-center">
        Browse Flashcards
        <button onClick={clearAll} className={btnClass}>Clear All</button>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center">
          <CategoryFilter
            value={categoryId}
            onChange={val => setCategoryId(val as 'maths'|'cs')}
          />
          {categoryId && (
            <button onClick={() => setCategoryId('')} className={btnClass}>×</button>
          )}
        </div>

        <div className="flex items-center">
          <TeacherFilter
            value={teacherId}
            onChange={setTeacherId}
          />
          {teacherId && (
            <button onClick={() => setTeacherId('')} className={btnClass}>×</button>
          )}
        </div>

        <div className="flex items-center">
          <SubjectFilter
            value={subjectId}
            onChange={setSubjectId}
            categoryId={categoryId||undefined}
            teacherId={teacherId||undefined}
          />
          {subjectId && (
            <button onClick={() => setSubjectId('')} className={btnClass}>×</button>
          )}
        </div>

        <div className="flex items-center">
          <TypeFilter
            value={flashcardType}
            onChange={setFlashcardType}
          />
          {flashcardType && (
            <button onClick={() => setFlashcardType('')} className={btnClass}>×</button>
          )}
        </div>
      </div>

      {/* Responsive masonry columns */}
      <div className={`
        columns-1 space-y-4
        sm:columns-2 
        lg:columns-3 
        xl:columns-4
      `}>
        {filtered.map(card => (
          <div 
            key={card.id} 
            className="break-inside-avoid mb-4 transform transition-transform hover:scale-[1.01]"
          >
            <FlashcardRead
              question={card.question}
              answer={card.answer}
            />
          </div>
        ))}
      </div>
    </div>
  )
}