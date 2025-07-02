// src/pages/TrainingPage.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Flashcard } from '../types/flashcard'
import type { SessionState } from '../types/session'
import subjectsData from '../data/subjects.json'
import { getAllFlashcards } from '../utils/dataUtils'
import { filterFlashcards } from '../utils/filterUtils'
import { initSession, nextRound, processNextCard } from '../utils/sessionManager'
import { shuffleArray } from '../utils/shuffle'
import { Button } from '../components/Button'
import { ProgressTracker } from '../components/ProgressTracker'
import { FlashcardTraining } from '../components/Flashcard/FlashcardTraining'
import { CategoryFilter } from '../components/FilterControls/CategoryFilter'
import { TeacherFilter } from '../components/FilterControls/TeacherFilter'
import { Modal } from '../components/Modal'

export const TrainingPage: React.FC = () => {
  // filters
  const [categoryId, setCategoryId] = useState<'maths'|'cs'|''>('')
  const [teacherId, setTeacherId] = useState<string>('')
  // multi‐subject selection
  const [subjectIds, setSubjectIds] = useState<string[]>([])
  // question count
  const [count, setCount] = useState<number|'all'>('all')
  // session
  const [session, setSession] = useState<SessionState|null>(null)
  const [current, setCurrent] = useState<Flashcard|null>(null)

  const [showAnswer, setShowAnswer] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)

  const allCards = getAllFlashcards()

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
  });

  // Memoize available subjects based on category and teacher
  const availableSubjects = useMemo(() => 
    subjectsData.filter(s =>
      (!categoryId || s.categoryId === categoryId) &&
      (!teacherId || s.teacherId === teacherId)
    ), 
    [categoryId, teacherId]
  );

  // Initialize subjects when availableSubjects changes
  useEffect(() => {
    // Only set if there's a real change needed
    const newIds = availableSubjects.map(s => s.id);
    const shouldUpdate = 
      subjectIds.length === 0 || 
      newIds.some(id => !subjectIds.includes(id)) ||
      subjectIds.some(id => !newIds.includes(id));
      
    if (shouldUpdate) {
      setSubjectIds(newIds);
    }
  }, [availableSubjects]);

  const selectAllRef = useRef<HTMLInputElement>(null);
  
  // Set indeterminate state for "Select All" checkbox
  useEffect(() => {
    if (selectAllRef.current && availableSubjects.length > 0) {
      selectAllRef.current.indeterminate = 
        subjectIds.length > 0 && subjectIds.length < availableSubjects.length;
    }
  }, [subjectIds, availableSubjects]);

  const toggleSubject = (id: string) => {
    setSubjectIds(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSubjectIds(availableSubjects.map(s => s.id));
    } else {
      setSubjectIds([]);
    }
  };

  const handleChoice = (didKnow: boolean) => {
    setUserAnswer(didKnow);
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (userAnswer !== null) {
      handleAnswer(userAnswer);
      setShowAnswer(false);
      setUserAnswer(null);
    }
  };

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalOpen(true);
  };

  const handleAnswer = (known: boolean) => {
    if (!session) return;
    
    // Process the answer
    processNextCard(session, known);
    
    // Advance to next card or round
    if (session.toReview.length > 0) {
      setCurrent(session.toReview[0]);
      return;
    }
    
    // Round complete
    const total = session.correct.length + session.incorrect.length;
    const pct = total > 0 ? Math.round((session.correct.length / total) * 100) : 0;
    
    if (session.incorrect.length > 0) {
      showModal(
        `Round ${session.round} Complete!`,
        `You got ${pct}% correct. ${session.incorrect.length} questions need review.`
      );
    } else {
      showModal(
        'Training Complete!',
        `Congratulations! You mastered all questions with ${pct}% accuracy.`
      );
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    
    if (!session) return;
    
    if (session.incorrect.length > 0) {
      // Start next round with incorrect cards
      nextRound(session);
      setCurrent(session.toReview[0] || null);
    } else {
      // Training complete
      setSession(null);
      setCurrent(null);
    }
  };



  const start = () => {
    // base pool by category/teacher/type
    let pool = filterFlashcards(allCards, {
      categoryId: categoryId || undefined,
      teacherId: teacherId || undefined,
    });

    let finalPool = pool;
    if (subjectIds.length > 0) {
      finalPool = pool.filter(fc => subjectIds.includes(fc.subjectId));
    } else if (availableSubjects.length > 0) {
      // Select random subject if none are selected
      const randomIndex = Math.floor(Math.random() * availableSubjects.length);
      const randomSubjectId = availableSubjects[randomIndex].id;
      finalPool = pool.filter(fc => fc.subjectId === randomSubjectId);
    }

    // pick count
    const picked = count === 'all' 
      ? finalPool 
      : shuffleArray(finalPool).slice(0, count);
      
    const newSession = initSession(picked);
    setSession(newSession);
    setCurrent(newSession.toReview[0] || null);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Training Mode</h1>

        <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={modalContent.title}
        message={modalContent.message}
      />
      
      {!session ? (
        <div className="space-y-4 mb-6">
          {/* Category & Teacher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategoryFilter
              value={categoryId}
              onChange={val => {
                setCategoryId(val as 'maths'|'cs');
              }}
            />
            <TeacherFilter
              value={teacherId}
              onChange={val => {
                setTeacherId(val);
              }}
            />
          </div>

          {/* Subject Selection */}
          {availableSubjects.length > 0 && (
            <div className="border rounded p-4">
              <label className="inline-flex items-center font-medium">
                <input
                  type="checkbox"
                  ref={selectAllRef}
                  className="form-checkbox"
                  checked={subjectIds.length === availableSubjects.length}
                  onChange={handleSelectAll}
                />
                <span className="ml-2">Select All</span>
              </label>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {availableSubjects.map(s => (
                  <label key={s.id} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={subjectIds.includes(s.id)}
                      onChange={() => toggleSubject(s.id)}
                    />
                    <span className="ml-2">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Number of questions */}
          <div>
            <label className="block mb-1">Number of questions:</label>
            <select
              className="border rounded px-3 py-2"
              value={count}
              onChange={e => {
                const v = e.target.value;
                setCount(v === 'all' ? 'all' : parseInt(v, 10));
              }}
            >
              <option value="all">All</option>
              <option value="20">20</option>
              <option value="10">10</option>
              <option value="3">3</option>
            </select>
          </div>

          <Button onClick={start}>Start Training</Button>
        </div>
      ) : current ? (
        <div className="flex flex-col h-[70vh] min-h-[500px] max-h-[800px]">
          <ProgressTracker
            round={session.round}
            correctCount={session.correct.length}
            incorrectCount={session.incorrect.length}
          />
          
          <div className="flex-grow mb-6">
            <FlashcardTraining
              question={current.question}
              answer={current.answer}
              showAnswer={showAnswer}
            />
          </div>
          
          <div className="flex justify-center space-x-4 mt-auto">
            {!showAnswer ? (
              <>
                <Button variant="secondary" onClick={() => handleChoice(false)}>
                  I don't know
                </Button>
                <Button variant="primary" onClick={() => handleChoice(true)}>
                  I know
                </Button>
              </>
            ) : (
              <Button onClick={handleNext}>Next</Button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};