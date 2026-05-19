// src/utils/dataUtils.ts
import type { Category, Flashcard, Subject, Teacher } from '../types/flashcard'
import rawCategories from '../data/categories.json'
import rawSubjects from '../data/subjects.json'
import rawTeachers from '../data/teachers.json'
import { readUserStudyData } from './userStudyData'

// Glob all JSON files under data/flashcards, loading them eagerly.
const modules = import.meta.glob<{ default: Flashcard[] }>(
  '../data/flashcards/*.json',
  { eager: true }
)

const baseFlashcards: Flashcard[] = Object.values(modules)
  .flatMap(m => m.default)

const baseCategories = rawCategories as Category[]
const baseSubjects = rawSubjects as Subject[]
const baseTeachers = rawTeachers as Teacher[]

const mergeById = <T extends { id: string }>(baseItems: T[], userItems: T[]): T[] => {
  if (userItems.length === 0) {
    return baseItems
  }

  const userById = new Map(userItems.map(item => [item.id, item]))
  const merged = baseItems.map(item => userById.get(item.id) ?? item)
  const baseIds = new Set(baseItems.map(item => item.id))
  const appended = userItems.filter(item => !baseIds.has(item.id))

  return [...merged, ...appended]
}

export const allFlashcards: Flashcard[] = baseFlashcards

export function getAllCategories(): Category[] {
  return baseCategories
}

export function getAllSubjects(): Subject[] {
  return mergeById(baseSubjects, readUserStudyData().subjects)
}

export function getAllTeachers(): Teacher[] {
  return mergeById(baseTeachers, readUserStudyData().teachers)
}

/** Returns all flashcards from JSON plus any user-edited browser cards. */
export function getAllFlashcards(): Flashcard[] {
  return mergeById(baseFlashcards, readUserStudyData().flashcards)
}

export function makeStudyDataId(name: string, existingIds: string[]): string {
  const fallback = 'custom'
  const base = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || fallback

  const usedIds = new Set(existingIds)
  let nextId = base
  let suffix = 2

  while (usedIds.has(nextId)) {
    nextId = `${base}_${suffix}`
    suffix += 1
  }

  return nextId
}

export function makeFlashcardId(subjectId: string, cards = getAllFlashcards()): string {
  const usedIds = new Set(cards.map(card => card.id))
  let nextNumber = cards.filter(card => card.subjectId === subjectId).length + 1
  let nextId = `${subjectId}-${String(nextNumber).padStart(2, '0')}`

  while (usedIds.has(nextId)) {
    nextNumber += 1
    nextId = `${subjectId}-${String(nextNumber).padStart(2, '0')}`
  }

  return nextId
}
