// src/utils/filterUtils.ts
import type { Flashcard, Subject } from '../types/flashcard'
import { getAllSubjects } from './dataUtils'

type FilterOpts = {
  categoryId?: 'maths' | 'cs'
  teacherId?: string
  subjectId?: string
  flashcardType?: 'memorize' | 'understand'
}

export function filterFlashcards(
  allCards: Flashcard[],
  { categoryId, teacherId, subjectId, flashcardType }: FilterOpts
): Flashcard[] {
  const subjectsById = getAllSubjects().reduce<Record<string, Subject>>((acc, subj) => {
    acc[subj.id] = subj
    return acc
  }, {})

  return allCards.filter(card => {
    const subj = subjectsById[card.subjectId]
    if (!subj) return false
    if (categoryId && subj.categoryId !== categoryId) return false
    if (teacherId && subj.teacherId !== teacherId) return false
    if (subjectId && card.subjectId !== subjectId) return false
    if (flashcardType && card.type !== flashcardType) return false
    return true
  })
}
