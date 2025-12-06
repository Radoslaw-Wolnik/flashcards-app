// src/pages/TrainingPage.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { Flashcard as FlashcardType } from '../types/flashcard'
import type { SessionState } from '../types/session'
import subjectsData from '../data/subjects.json'
import { getAllFlashcards } from '../utils/dataUtils'
import { filterFlashcards } from '../utils/filterUtils'
import { initSession, nextRound, processNextCard } from '../utils/sessionManager'
import { shuffleArray } from '../utils/shuffle'
import { Button } from '../components/Button'
import { ProgressTracker } from '../components/ProgressTracker'
import Flashcard from '../components/Flashcard/Flashcard'
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
  const [current, setCurrent] = useState<FlashcardType|null>(null)
  const [currentCardFlipped, setCurrentCardFlipped] = useState(false)
  const [hasRevealedAnswer, setHasRevealedAnswer] = useState(false)

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

  const handleCardFlip = (isFlipped: boolean) => {
    setCurrentCardFlipped(isFlipped)
    if (isFlipped && !hasRevealedAnswer) {
      setHasRevealedAnswer(true)
    }
  };

  const handleChoice = (didKnow: boolean) => {
    if (!session || !current) return
    
    // Process the answer
    processNextCard(session, didKnow);
    
    setHasRevealedAnswer(false)
    setCurrentCardFlipped(false)
    
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

  const handleNext = () => {
    if (!session || !current) return
    
    // Advance to next card or round
    if (session.toReview.length > 0) {
      setCurrent(session.toReview[0])
      setCurrentCardFlipped(false)
      setHasRevealedAnswer(false)
    }
  };

  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    
    if (!session) return;
    
    if (session.incorrect.length > 0) {
      // Start next round with incorrect cards
      nextRound(session);
      setCurrent(session.toReview[0] || null);
      setCurrentCardFlipped(false);
      setHasRevealedAnswer(false);
    } else {
      // Training complete
      setSession(null);
      setCurrent(null);
      setCurrentCardFlipped(false);
      setHasRevealedAnswer(false);
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
    setCurrentCardFlipped(false);
    setHasRevealedAnswer(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Training Mode</h1>

      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={modalContent.title}
        message={modalContent.message}
      />
      
      {!session ? (
        <div className="space-y-6 mb-6 max-w-2xl">
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
            <div className="border rounded-xl p-4 bg-white shadow-sm">
              <label className="inline-flex items-center font-medium mb-3">
                <input
                  type="checkbox"
                  ref={selectAllRef}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                  checked={subjectIds.length === availableSubjects.length}
                  onChange={handleSelectAll}
                />
                <span className="ml-2 text-lg">Select All Subjects</span>
              </label>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableSubjects.map(s => (
                  <label key={s.id} className="inline-flex items-center p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-indigo-600"
                      checked={subjectIds.includes(s.id)}
                      onChange={() => toggleSubject(s.id)}
                    />
                    <span className="ml-3">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Number of questions */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <label className="block mb-2 font-medium text-lg">Number of questions:</label>
            <select
              className="border rounded-lg px-4 py-2 w-full max-w-xs"
              value={count}
              onChange={e => {
                const v = e.target.value;
                setCount(v === 'all' ? 'all' : parseInt(v, 10));
              }}
            >
              <option value="all">All available</option>
              <option value="50">50 questions</option>
              <option value="30">30 questions</option>
              <option value="20">20 questions</option>
              <option value="10">10 questions</option>
              <option value="5">5 questions</option>
            </select>
          </div>

          <div className="pt-4">
            <Button 
              onClick={start} 
              variant="primary"
              className="px-8 py-3 text-lg"
              disabled={availableSubjects.length === 0}
            >
              Start Training
            </Button>
            
            {availableSubjects.length === 0 && (
              <p className="mt-2 text-gray-500 text-sm">
                Please select a category or teacher to see available subjects.
              </p>
            )}
          </div>
        </div>
      ) : current ? (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl mb-6">
            <ProgressTracker
              round={session.round}
              correctCount={session.correct.length}
              incorrectCount={session.incorrect.length}
            />
          </div>
          
          {/* Flashcard */}
          <div className="w-full max-w-4xl mb-8">
            <Flashcard
              key={current.id}
              question={current.question}
              answer={current.answer}
              isFlipped={currentCardFlipped}
              onFlip={handleCardFlip}
              maxWidth="700px"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="w-full max-w-2xl">
            {!hasRevealedAnswer ? (
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <p className="mb-2 font-medium text-blue-700">Reveal the answer to continue</p>
                <p className="text-sm text-blue-500">
                  Click the card or press Space to flip and see the answer
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-center font-medium mb-6 text-gray-700">
                  Did you know the answer?
                </p>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => handleChoice(false)}
                    className="px-6 py-3 flex-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                  >
                    <span className="font-medium">I don't know</span>
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    onClick={() => handleChoice(true)}
                    className="px-6 py-3 flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  >
                    <span className="font-medium">I know</span>
                  </Button>
                  
                  {session.toReview.length > 1 && (
                    <Button 
                      onClick={handleNext}
                      variant="primary"
                      className="px-6 py-3 flex-1"
                    >
                      <span className="font-medium">Skip</span>
                    </Button>
                  )}
                </div>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  {session.toReview.length - 1} card(s) remaining in this round
                </div>
              </div>
            )}
          </div>
          
          {/* Exit Button */}
          <div className="mt-8">
            <Button 
              onClick={() => {
                if (window.confirm('Are you sure you want to end this training session?')) {
                  setSession(null)
                  setCurrent(null)
                }
              }}
              variant="secondary"
              className="px-4 py-2"
            >
              End Training Session
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}