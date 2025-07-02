import type { Flashcard } from '../types/flashcard'
import type { SessionState } from '../types/session'


/**
 * Initialize a training session given the picked questions.
 */
export function initSession(cards: Flashcard[]): SessionState {
  return {
    round:    1,
    correct:  [],
    incorrect: [],
    toReview: [...cards],
  }
}

export function processNextCard(state: SessionState, isCorrect: boolean): void {
  if (state.toReview.length === 0) return

  const card = state.toReview.shift()! // Remove first card from toReview

  if (isCorrect) {
    state.correct.push(card)
  } else {
    state.incorrect.push(card)
  }
}

export function nextRound(state: SessionState): void {
  state.round += 1
  state.toReview = [...state.incorrect]
  state.correct = []
  state.incorrect = []
}