// src/pages/TrainingPage.tsx
import React, { useState, useMemo } from 'react'
import type { SessionState } from '../types/session'
import type { Subject } from '../types/flashcard'
import rawSubjects from '../data/subjects.json'
import teachersData from '../data/teachers.json'
import { getAllFlashcards } from '../utils/dataUtils'
import { filterFlashcards } from '../utils/filterUtils'
import { initSession, nextRound } from '../utils/sessionManager'
import { shuffleArray } from '../utils/shuffle'
import { TrainingConfigPanel } from '../components/Training/TrainingConfigPanel'
import { TrainingSession } from '../components/Training/TrainingSession'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'

// Cast the raw subjects data to Subject[] type
const subjectsData = rawSubjects as Subject[]

export const TrainingPage: React.FC = () => {
  // Configuration state
  const [config, setConfig] = useState({
    categoryId: '' as 'maths' | 'cs' | '',
    teacherId: '',
    subjectIds: [] as string[],
    count: 'all' as number | 'all'
  })
  
  // Session state
  const [session, setSession] = useState<SessionState | null>(null)
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '' })

  const allCards = useMemo(() => getAllFlashcards(), [])

  // Memoize data
  const { availableSubjects, availableTeachers, cardCounts, availableCardsCount } = useMemo(() => {
    // Filter subjects based on config
    let filteredSubjects: Subject[] = subjectsData
    if (config.categoryId) {
      filteredSubjects = filteredSubjects.filter(s => s.categoryId === config.categoryId)
    }
    if (config.teacherId) {
      filteredSubjects = filteredSubjects.filter(s => s.teacherId === config.teacherId)
    }

    const teacherLookup = new Map(teachersData.map(teacher => [teacher.id, teacher.name]))

    // Get unique teachers
    const teacherMap = new Map<string, { id: string; name: string }>()
    subjectsData.forEach(subject => {
      if (subject.teacherId && !teacherMap.has(subject.teacherId)) {
        teacherMap.set(subject.teacherId, {
          id: subject.teacherId,
          name: teacherLookup.get(subject.teacherId) || subject.teacherId
        })
      }
    })
    
    // Fallback to teachersData if no teachers found in subjects
    if (teacherMap.size === 0 && teachersData.length > 0) {
      teachersData.forEach(teacher => {
        if (teacher.id) {
          teacherMap.set(teacher.id, teacher)
        }
      })
    }

    // Calculate card counts per subject
    const counts = filteredSubjects.reduce((acc, subject) => {
      acc[subject.id] = allCards.filter(c => c.subjectId === subject.id).length
      return acc
    }, {} as Record<string, number>)

    // Calculate total available cards
    let pool = filterFlashcards(allCards, {
      categoryId: config.categoryId || undefined,
      teacherId: config.teacherId || undefined,
    })
    
    let finalPool = pool
    if (config.subjectIds.length > 0) {
      finalPool = pool.filter(fc => config.subjectIds.includes(fc.subjectId))
    }

    return {
      availableSubjects: filteredSubjects,
      availableTeachers: Array.from(teacherMap.values()),
      cardCounts: counts,
      availableCardsCount: finalPool.length
    }
  }, [config.categoryId, config.teacherId, config.subjectIds, allCards])


  // Start training session
  const startTraining = () => {
    let pool = filterFlashcards(allCards, {
      categoryId: config.categoryId || undefined,
      teacherId: config.teacherId || undefined,
    })

    let finalPool = pool
    if (config.subjectIds.length > 0) {
      finalPool = pool.filter(fc => config.subjectIds.includes(fc.subjectId))
    } else if (availableSubjects.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableSubjects.length)
      finalPool = pool.filter(fc => fc.subjectId === availableSubjects[randomIndex].id)
    }

    const picked = config.count === 'all' 
      ? finalPool 
      : shuffleArray(finalPool).slice(0, config.count)
      
    setSession(initSession(picked))
  }

  // Handle round completion
  const showRoundCompleteModal = () => {
    if (!session) return
    
    const total = session.correct.length + session.incorrect.length
    const pct = total > 0 ? Math.round((session.correct.length / total) * 100) : 0
    
    setModalContent({
      title: session.incorrect.length > 0 
        ? `Round ${session.round} Complete!` 
        : 'Training Complete!',
      message: session.incorrect.length > 0
        ? `You got ${pct}% correct. ${session.incorrect.length} questions need review.`
        : `Congratulations! You mastered all questions with ${pct}% accuracy.`
    })
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    
    if (!session) return
    
    if (session.incorrect.length > 0) {
      // Start next round
      nextRound(session)
      setSession({ ...session })
    } else {
      // Training complete
      setSession(null)
    }
  }

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this training session?')) {
      setSession(null)
    }
  }

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Training mode"
        title="Practice until it sticks"
        description="Build a focused set, flip each card, and recycle the missed ones into the next round."
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={modalContent.title}
        message={modalContent.message}
      />
      
      {!session ? (
        <TrainingConfigPanel
          config={config}
          availableSubjects={availableSubjects}
          availableTeachers={availableTeachers}
          allCardsCount={cardCounts}
          availableCardsCount={availableCardsCount}
          onConfigChange={setConfig}
          onStart={startTraining}
        />
      ) : (
        <TrainingSession
          session={session}
          onSessionUpdate={setSession}
          onRoundComplete={showRoundCompleteModal}
          onEndSession={handleEndSession}
        />
      )}
    </main>
  )
}
