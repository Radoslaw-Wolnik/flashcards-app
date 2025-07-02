export interface SessionState {
  /** Current round number (starts at 1) */
  round: number
  /** All cards answered correctly so far */
  correct: Flashcard[]
  /** Cards answered incorrectly in *this* round */
  incorrect: Flashcard[]
  /** Cards queued to review in the current round */
  toReview: Flashcard[]
}