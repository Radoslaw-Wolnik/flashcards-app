import type { Flashcard, Subject, Teacher } from '../types/flashcard'

export interface UserStudyData {
  flashcards: Flashcard[]
  subjects: Subject[]
  teachers: Teacher[]
}

export const USER_STUDY_DATA_CHANGED = 'licencjat-flashcards:user-study-data-changed'

const STORAGE_KEY = 'licencjat-flashcards.user-study-data.v1'

const emptyStudyData = (): UserStudyData => ({
  flashcards: [],
  subjects: [],
  teachers: []
})

const canUseStorage = () => (
  typeof window !== 'undefined' &&
  typeof window.localStorage !== 'undefined'
)

const isCategoryId = (value: unknown): value is Subject['categoryId'] => (
  value === 'maths' || value === 'cs'
)

const isCardType = (value: unknown): value is Flashcard['type'] => (
  value === 'memorize' || value === 'understand'
)

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
)

const isFlashcard = (value: unknown): value is Flashcard => {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'string' &&
    typeof value.subjectId === 'string' &&
    isCardType(value.type) &&
    typeof value.question === 'string' &&
    typeof value.answer === 'string'
  )
}

const isSubject = (value: unknown): value is Subject => {
  if (!isRecord(value)) return false

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    isCategoryId(value.categoryId) &&
    (value.teacherId === undefined || typeof value.teacherId === 'string')
  )
}

const isTeacher = (value: unknown): value is Teacher => {
  if (!isRecord(value)) return false

  return typeof value.id === 'string' && typeof value.name === 'string'
}

const upsertById = <T extends { id: string }>(items: T[], item: T): T[] => {
  const existingIndex = items.findIndex(existing => existing.id === item.id)

  if (existingIndex === -1) {
    return [...items, item]
  }

  return items.map(existing => existing.id === item.id ? item : existing)
}

export function readUserStudyData(): UserStudyData {
  if (!canUseStorage()) {
    return emptyStudyData()
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return emptyStudyData()
  }

  try {
    const parsed = JSON.parse(stored) as Partial<UserStudyData>

    return {
      flashcards: Array.isArray(parsed.flashcards) ? parsed.flashcards.filter(isFlashcard) : [],
      subjects: Array.isArray(parsed.subjects) ? parsed.subjects.filter(isSubject) : [],
      teachers: Array.isArray(parsed.teachers) ? parsed.teachers.filter(isTeacher) : []
    }
  } catch {
    return emptyStudyData()
  }
}

export function writeUserStudyData(data: UserStudyData): void {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  window.dispatchEvent(new CustomEvent(USER_STUDY_DATA_CHANGED))
}

export function upsertUserFlashcard(card: Flashcard): UserStudyData {
  const current = readUserStudyData()
  const next = {
    ...current,
    flashcards: upsertById(current.flashcards, card)
  }

  writeUserStudyData(next)
  return next
}

export function upsertUserSubject(subject: Subject): UserStudyData {
  const current = readUserStudyData()
  const next = {
    ...current,
    subjects: upsertById(current.subjects, subject)
  }

  writeUserStudyData(next)
  return next
}

export function upsertUserTeacher(teacher: Teacher): UserStudyData {
  const current = readUserStudyData()
  const next = {
    ...current,
    teachers: upsertById(current.teachers, teacher)
  }

  writeUserStudyData(next)
  return next
}
