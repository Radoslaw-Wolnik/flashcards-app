import React, { useState } from 'react'
import type { Flashcard } from '../types/flashcard'
import teachersData    from '../data/teachers.json'
import subjectsData    from '../data/subjects.json'
import { getAllFlashcards } from '../utils/dataUtils'
import { shuffleArray }     from '../utils/shuffle'
import { Button }           from '../components/Button'
import { ProgressTracker }  from '../components/ProgressTracker'
import { FlashcardTraining }from '../components/Flashcard/FlashcardTraining'
import { Modal } from '../components/Modal';

type Rounds = 1 | 3 | 5 | 10

export const ExamPage: React.FC = () => {
  const [rounds,       setRounds]       = useState<Rounds>(1)
  const [currentRound, setCRound]       = useState<number>(0)
  const [usedIds,      setUsedIds]      = useState<Set<string>>(new Set())
  const [history,      setHistory]      = useState<boolean[]>([])
  const [currentSet,   setCurrentSet]   = useState<Flashcard[]>([])
  const [indexInSet,   setIndexInSet]   = useState<number>(0)

  const [showAnswer, setShowAnswer] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)

  const allCards = getAllFlashcards()

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
  });

  const subjMap = subjectsData.reduce<Record<string,string>>((acc, s) => {
    if (s.teacherId) acc[s.id] = s.teacherId
    return acc
  }, {})

  const teacherPools = teachersData.map(t => ({
    teacher: t,
    pool: allCards.filter(fc => subjMap[fc.subjectId] === t.id)
  }))

  const startExam = () => {
    setUsedIds(new Set())
    setHistory([])
    setCRound(1)
    pickNextSet(new Set())
  }

  const handleChoice = (didKnow: boolean) => {
    setUserAnswer(didKnow)
    setShowAnswer(true)
  }

  const handleNext = () => {
    if (userAnswer !== null) {
      handleAnswer(userAnswer)
      setShowAnswer(false)
      setUserAnswer(null)
    }
  }

  function pickNextSet(prevUsed: Set<string>) {
    const newUsed = new Set(prevUsed)
    const picks: Flashcard[] = []

    teacherPools.forEach(({ pool }) => {
      const avail = pool.filter(fc => !newUsed.has(fc.id))
      if (avail.length > 0) {
        const choice = shuffleArray(avail)[0]
        picks.push(choice)
        newUsed.add(choice.id)
      }
    })

    setUsedIds(newUsed)
    setCurrentSet(shuffleArray(picks))
    setIndexInSet(0)
    setHistory([])
  }

   const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setModalOpen(true);
  };

  const handleAnswer = (known: boolean) => {
    setHistory(h => [...h, known]);
    const nextIdx = indexInSet + 1;

    if (nextIdx < currentSet.length) {
      setIndexInSet(nextIdx);
      return;
    }

    // Round finished
    const corrects = history.filter(h => h).length + (known ? 1 : 0);
    const total = history.length + 1;
    const pct = Math.round((corrects / total) * 100);
    
    if (currentRound < rounds) {
      showModal(
        `Round ${currentRound} Complete!`,
        `You scored ${pct}% correct. Get ready for the next round!`
      );
    } else {
      showModal(
        'Exam Finished!',
        `You scored an average of ${pct}% correct over ${rounds} rounds.`
      );
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    
    if (currentRound < rounds) {
      // Start next round
      setCRound(r => r + 1);
      setHistory([]);
      pickNextSet(usedIds);
    } else {
      // Exam complete
      setCRound(0);
      setHistory([]);
      setCurrentSet([]);
      setUsedIds(new Set());
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Exam Mode</h1>

        <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={modalContent.title}
        message={modalContent.message}
      />

      {currentRound === 0 ? (
        <div className="space-y-4">
          <label className="block mb-1">Number of rounds:</label>
          <select
            className="border rounded px-3 py-2"
            value={rounds}
            onChange={e => setRounds(parseInt(e.target.value) as Rounds)}
          >
            <option value={1}>1</option>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
          </select>

          <Button onClick={startExam}>Start Exam</Button>
        </div>
      ) : (
        <div className="flex flex-col h-[70vh] min-h-[500px] max-h-[800px]">
          <ProgressTracker
            round={currentRound}
            correctCount={history.filter(h => h).length}
            incorrectCount={history.filter(h => !h).length}
          />
          
          <div className="flex-grow mb-6">
            <FlashcardTraining
              question={currentSet[indexInSet].question}
              answer={currentSet[indexInSet].answer}
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
      )}
    </div>
  )
}
