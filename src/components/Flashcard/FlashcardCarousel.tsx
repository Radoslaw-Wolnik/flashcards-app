// src/components/Flashcard/FlashcardCarousel.tsx
import React from 'react'
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
      <div className="w-full flex items-center justify-center min-h-[500px] md:min-h-[600px]">
        <div className="flex-1 max-w-4xl">
          <div 
            className={`transition-all duration-300 ease-in-out ${
              slideDirection === 'left'
                ? 'opacity-0 transform translate-x-full'
                : slideDirection === 'right'
                ? 'opacity-0 transform -translate-x-full'
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
