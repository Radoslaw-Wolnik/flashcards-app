import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { CardEditorPage } from './CardEditorPage'
import { getAllSubjects } from '../utils/dataUtils'
import { readUserStudyData } from '../utils/userStudyData'

describe('CardEditorPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('adds a flashcard and edits the saved card', async () => {
    const subject = getAllSubjects()[0]

    if (!subject) {
      throw new Error('Expected at least one subject in fixture data.')
    }

    render(<CardEditorPage />)

    const subjectSelect = screen.getByLabelText('Subject')
    const questionInput = screen.getByLabelText('Question')
    const answerInput = screen.getByLabelText('Answer')

    fireEvent.change(subjectSelect, { target: { value: subject.id } })
    fireEvent.change(questionInput, { target: { value: 'What does a saved test card ask?' } })
    fireEvent.change(answerInput, { target: { value: 'It asks whether adding flashcards works.' } })
    fireEvent.click(screen.getByRole('button', { name: /save flashcard/i }))

    expect(await screen.findByText('Flashcard added.')).toBeInTheDocument()

    let storedCards = readUserStudyData().flashcards
    const addedCardId = storedCards[0]?.id

    expect(storedCards).toHaveLength(1)
    expect(storedCards[0]).toMatchObject({
      subjectId: subject.id,
      question: 'What does a saved test card ask?',
      answer: 'It asks whether adding flashcards works.'
    })

    fireEvent.change(questionInput, { target: { value: 'What does an edited test card ask?' } })
    fireEvent.change(answerInput, { target: { value: 'It asks whether editing flashcards works.' } })
    fireEvent.click(screen.getByRole('button', { name: /save flashcard/i }))

    expect(await screen.findByText('Flashcard updated.')).toBeInTheDocument()

    storedCards = readUserStudyData().flashcards
    expect(storedCards).toHaveLength(1)
    expect(storedCards[0]).toMatchObject({
      id: addedCardId,
      subjectId: subject.id,
      question: 'What does an edited test card ask?',
      answer: 'It asks whether editing flashcards works.'
    })
  })
})
