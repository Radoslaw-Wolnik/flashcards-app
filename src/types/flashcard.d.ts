// Categories.json
export interface Category {
  id: string // maths or cs
  name: string
}

// Teachers.json
export interface Teacher {
  id: string
  name: string
}

// Subjects.json
export interface Subject {
  id: string
  name: string
  categoryId: 'maths' | 'cs'   // e.g. "maths" or "cs"
  teacherId?: string   // optional, links to Teacher.id
}

// flashcards/*.json
export interface Flashcard {
  id: string
  subjectId: string         // links to Subject.id
  type: 'memorize' | 'understand'
  question: string
  answer: string
}
