import React, { useState, useMemo, useCallback } from 'react'
import type { Flashcard } from '../types/flashcard'
import { getAllFlashcards, getAllSubjects, getAllTeachers } from '../utils/dataUtils'
import { shuffleArray } from '../utils/shuffle'
import { Modal } from '../components/Modal'
import { ExamConfigPanel } from '../components/Exam/ExamConfigPanel'
import { ExamSession } from '../components/Exam/ExamSession'
import { PageHeader } from '../components/PageHeader'

type ExamState = {
  currentRound: number
  totalCorrect: number
  totalIncorrect: number
  currentRoundCards: Flashcard[]
  currentCardIndex: number
  roundHistory: boolean[]
  usedCardIds: Set<string>
}

export const ExamPage: React.FC = () => {
  // Configuration state
  const [config, setConfig] = useState({
    rounds: 1 as 1 | 3 | 5 | 10
  })
  
  // Exam state
  const [examState, setExamState] = useState<ExamState | null>(null)
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '' })

  const allCards = useMemo(() => getAllFlashcards(), [])
  const subjectsData = useMemo(() => getAllSubjects(), [])
  const teachersData = useMemo(() => getAllTeachers(), [])

  // Memoize teacher pools
  const { teacherPools, availableTeachersCount } = useMemo(() => {
    const subjMap = subjectsData.reduce<Record<string, string>>((acc, s) => {
      if (s.teacherId) acc[s.id] = s.teacherId
      return acc
    }, {})

    const pools = teachersData.map(t => ({
      teacher: t,
      pool: allCards.filter(fc => subjMap[fc.subjectId] === t.id)
    })).filter(tp => tp.pool.length > 0)

    return {
      teacherPools: pools,
      availableTeachersCount: pools.length
    }
  }, [allCards, subjectsData, teachersData])

  // Start exam
  const startExam = () => {
    const initialExamState: ExamState = {
      currentRound: 1,
      totalCorrect: 0,
      totalIncorrect: 0,
      currentRoundCards: [],
      currentCardIndex: 0,
      roundHistory: [],
      usedCardIds: new Set()
    }

    // Pick first round
    const newExamState = pickNextRound(initialExamState)
    setExamState(newExamState)
  }

  // Helper to pick cards for next round
  const pickNextRound = (state: ExamState): ExamState => {
    const newUsedIds = new Set(state.usedCardIds)
    const picks: Flashcard[] = []

    teacherPools.forEach(({ pool }) => {
      const avail = pool.filter(fc => !newUsedIds.has(fc.id))
      if (avail.length > 0) {
        const choice = shuffleArray(avail)[0]
        picks.push(choice)
        newUsedIds.add(choice.id)
      }
    })

    return {
      ...state,
      currentRoundCards: shuffleArray(picks),
      currentCardIndex: 0,
      roundHistory: [],
      usedCardIds: newUsedIds
    }
  }

  // Handle user answer
  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (!examState) return

    setExamState(prev => {
      if (!prev) return prev

      const newRoundHistory = [...prev.roundHistory, isCorrect]
      const newCorrect = prev.totalCorrect + (isCorrect ? 1 : 0)
      const newIncorrect = prev.totalIncorrect + (isCorrect ? 0 : 1)
      const nextIndex = prev.currentCardIndex + 1

      // If more cards in this round
      if (nextIndex < prev.currentRoundCards.length) {
        return {
          ...prev,
          totalCorrect: newCorrect,
          totalIncorrect: newIncorrect,
          currentCardIndex: nextIndex,
          roundHistory: newRoundHistory
        }
      }

      // Round finished - show modal
      const roundScore = newRoundHistory.filter(h => h).length
      const roundTotal = newRoundHistory.length
      const roundPercentage = Math.round((roundScore / roundTotal) * 100)

      let modalTitle = ''
      let modalMessage = ''

      if (prev.currentRound < config.rounds) {
        modalTitle = `Round ${prev.currentRound} Complete!`
        modalMessage = `You scored ${roundPercentage}% correct (${roundScore}/${roundTotal}). Get ready for round ${prev.currentRound + 1}!`
      } else {
        const totalScore = newCorrect + newIncorrect
        const totalPercentage = Math.round((newCorrect / totalScore) * 100)
        modalTitle = 'Exam Finished!'
        modalMessage = `Congratulations! You completed ${config.rounds} rounds with an average score of ${totalPercentage}% correct.`
      }

      setModalContent({ title: modalTitle, message: modalMessage })
      setModalOpen(true)

      // Return updated state
      return {
        ...prev,
        totalCorrect: newCorrect,
        totalIncorrect: newIncorrect,
        roundHistory: newRoundHistory
      }
    })
  }, [examState, config.rounds])

  // Handle modal close (transition to next round or finish)
  const handleModalClose = () => {
    setModalOpen(false)

    if (!examState) return

    if (examState.currentRound < config.rounds) {
      // Start next round
      const nextRoundState = {
        ...examState,
        currentRound: examState.currentRound + 1
      }
      const newExamState = pickNextRound(nextRoundState)
      setExamState(newExamState)
    } else {
      // Exam complete
      setExamState(null)
    }
  }

  // End exam early
  const handleEndExam = () => {
    if (window.confirm('Are you sure you want to end this exam? Your progress will be lost.')) {
      setExamState(null)
    }
  }

  // Current card
  const currentCard = examState?.currentRoundCards[examState.currentCardIndex] || null

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Exam mode"
        title="Simulate the oral exam"
        description="Each round draws one card per teacher so you can rehearse a broad, exam-like mix."
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={modalContent.title}
        message={modalContent.message}
      />
      
      {!examState ? (
        <ExamConfigPanel
          config={config}
          onConfigChange={setConfig}
          onStart={startExam}
          availableTeachersCount={availableTeachersCount}
        />
      ) : (
        <ExamSession
          currentRound={examState.currentRound}
          totalRounds={config.rounds}
          currentCard={currentCard}
          cardIndex={examState.currentCardIndex}
          totalCardsInRound={examState.currentRoundCards.length}
          correctCount={examState.totalCorrect}
          incorrectCount={examState.totalIncorrect}
          onAnswer={handleAnswer}
          onEndExam={handleEndExam}
        />
      )}
    </main>
  )
}
