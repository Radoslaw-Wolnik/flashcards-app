// src/utils/dataUtils.ts
import type { Flashcard } from '../types/flashcard'

// Glob all JSON files under data/flashcards, loading them eagerly
const modules = import.meta.glob<{ default: Flashcard[] }>(
  '../data/flashcards/*.json',
  { eager: true }
)

/** Returns all flashcards from all JSON files */
export function getAllFlashcards(): Flashcard[] {
  return Object.values(modules)
    .flatMap(m => m.default)
}
