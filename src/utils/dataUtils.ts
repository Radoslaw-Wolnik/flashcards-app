// src/utils/dataUtils.ts
import type { Flashcard } from '../types/flashcard'

// Glob all JSON files under data/flashcards, loading them eagerly.
const modules = import.meta.glob<{ default: Flashcard[] }>(
  '../data/flashcards/*.json',
  { eager: true }
)

export const allFlashcards: Flashcard[] = Object.values(modules)
  .flatMap(m => m.default)

/** Returns a stable array of all flashcards from all JSON files. */
export function getAllFlashcards(): Flashcard[] {
  return allFlashcards
}
