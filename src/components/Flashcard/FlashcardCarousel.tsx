// src/components/Flashcard/FlashcardCarousel.tsx
import React, { useLayoutEffect, useRef, useState } from 'react'
import { LibraryBig } from 'lucide-react'
import Flashcard from '../Flashcard/Flashcard'

interface FlashcardCarouselProps {
  currentCard: {
    id: string
    question: string
    answer: string
  } | null
  isFlipped: boolean
  onFlip: (flipped: boolean) => void
  // Animation state controlled by parent
  slideDirection?: 'left' | 'right' | null
  maxWidth?: string
}

export const FlashcardCarousel: React.FC<FlashcardCarouselProps> = ({
  currentCard,
  isFlipped,
  onFlip,
  slideDirection = null,
  maxWidth = '700px'
}) => {
  const previousCardId = useRef<string | null>(currentCard?.id ?? null)
  const [entryDirection, setEntryDirection] = useState<'left' | 'right' | null>(null)

  useLayoutEffect(() => {
    const currentCardId = currentCard?.id ?? null

    if (previousCardId.current && currentCardId !== previousCardId.current && slideDirection) {
      setEntryDirection(slideDirection === 'left' ? 'right' : 'left')
      const frame = window.requestAnimationFrame(() => setEntryDirection(null))
      previousCardId.current = currentCardId
      return () => window.cancelAnimationFrame(frame)
    }

    previousCardId.current = currentCardId
  }, [currentCard?.id, slideDirection])

  if (!currentCard) {
    return (
      <div className="text-center py-12 text-slate-500">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <LibraryBig className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-lg">No card to display</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full flex items-center justify-center">
        <div className="flex-1 max-w-4xl">
          <div 
            className={`transition-all duration-300 ease-in-out ${
              entryDirection === 'right'
                ? 'opacity-0 translate-x-full'
                : entryDirection === 'left'
                ? 'opacity-0 -translate-x-full'
                : slideDirection === 'left'
                ? 'opacity-0 -translate-x-full'
                : slideDirection === 'right'
                ? 'opacity-0 translate-x-full'
                : 'opacity-100 transform translate-x-0'
            }`}
          >
            <Flashcard
              key={currentCard.id}
              question={currentCard.question}
              answer={currentCard.answer}
              isFlipped={isFlipped}
              onFlip={() => onFlip(!isFlipped)}
              maxWidth={maxWidth}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
