import React, { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, BookOpen, Hash, Type } from 'lucide-react'
import { MarkdownContent } from '../MarkdownContent'
import type { Subject } from '../../types/flashcard'
import type { Flashcard } from '../../types/flashcard'

interface SubjectAccordionProps {
  subject: Subject
  cards: Flashcard[]
  isExpanded: boolean
  onToggle: () => void
}

export const SubjectAccordion: React.FC<SubjectAccordionProps> = ({
  subject,
  cards,
  isExpanded,
  onToggle
}) => {
  const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(new Set())

  const memorizationCards = useMemo(() => 
    cards.filter(card => card.type === 'memorize'),
    [cards]
  )
  
  const understandingCards = useMemo(() => 
    cards.filter(card => card.type === 'understand'),
    [cards]
  )

  const toggleCard = (cardId: string) => {
    setExpandedCardIds(prev => {
      const next = new Set(prev)
      if (next.has(cardId)) {
        next.delete(cardId)
      } else {
        next.add(cardId)
      }
      return next
    })
  }

  const CardItem: React.FC<{ card: Flashcard }> = ({ card }) => {
    const isCardExpanded = expandedCardIds.has(card.id)

    return (
      <div 
        key={card.id}
        className="border border-slate-200 rounded-lg overflow-hidden mb-2 transition-all hover:border-slate-300"
      >
        <button
          onClick={() => toggleCard(card.id)}
          className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
          aria-expanded={isCardExpanded}
        >
          <div className="flex min-w-0 flex-1 items-center">
            <div className={`w-2 h-2 rounded-full mr-3 ${
              card.type === 'memorize' ? 'bg-blue-500' : 'bg-teal-500'
            }`} />
            <MarkdownContent
              variant="compact"
              className="font-medium text-slate-800"
            >
              {card.question}
            </MarkdownContent>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded ${
              card.type === 'memorize' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-teal-100 text-teal-700'
            }`}>
              {card.type === 'memorize' ? 'Memorize' : 'Understand'}
            </span>
            <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${
              isCardExpanded ? 'rotate-90' : ''
            }`} />
          </div>
        </button>
        
        {isCardExpanded && (
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
            <div className="mb-2 flex items-center">
              <Type className="w-4 h-4 mr-2 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">Answer</span>
            </div>
            <div>
              <MarkdownContent variant="answer">
                {card.answer}
              </MarkdownContent>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="surface-card overflow-hidden mb-4 transition-shadow hover:shadow-md">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center">
          <BookOpen className="w-5 h-5 mr-3 text-slate-400" />
          <div>
            <h3 className="font-semibold text-lg text-slate-950">{subject.name}</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-slate-600">
              <span className="flex items-center">
                <Hash className="w-4 h-4 mr-1" />
                {cards.length} card{cards.length !== 1 ? 's' : ''}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                subject.categoryId === 'maths' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-teal-100 text-teal-700'
              }`}>
                {subject.categoryId === 'maths' ? 'Mathematics' : 'Computer Science'}
              </span>
              {subject.teacherId && (
                <span className="text-slate-500">
                  Teacher: {subject.teacherId}
                </span>
              )}
            </div>
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </button>
      
      {isExpanded && (
        <div className="px-5 py-4 border-t border-slate-200">
          {memorizationCards.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-slate-700 mb-3 flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                Memorization Questions ({memorizationCards.length})
              </h4>
              {memorizationCards.map(card => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          )}
          
          {understandingCards.length > 0 && (
            <div>
              <h4 className="font-medium text-slate-700 mb-3 flex items-center">
                <div className="w-2 h-2 rounded-full bg-teal-500 mr-2" />
                Understanding Questions ({understandingCards.length})
              </h4>
              {understandingCards.map(card => (
                <CardItem key={card.id} card={card} />
              ))}
            </div>
          )}
          
          {cards.length === 0 && (
            <div className="text-center py-6 text-slate-500">
              No flashcards found in this subject.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
