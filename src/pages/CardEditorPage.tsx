import React, { useMemo, useState } from 'react'
import { Check, Eye, Plus, Save, Search, SquarePen } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { MarkdownContent } from '../components/MarkdownContent'
import type { Flashcard, Subject } from '../types/flashcard'
import {
  getAllCategories,
  getAllFlashcards,
  getAllSubjects,
  getAllTeachers,
  makeFlashcardId,
  makeStudyDataId
} from '../utils/dataUtils'
import {
  upsertUserFlashcard,
  upsertUserSubject,
  upsertUserTeacher
} from '../utils/userStudyData'

type EditorMode = 'add' | 'edit'
type Notice = {
  kind: 'success' | 'error'
  message: string
}

const NEW_SUBJECT_VALUE = '__new_subject__'
const NEW_TEACHER_VALUE = '__new_teacher__'

const emptyNotice = null as Notice | null

const sortByName = <T extends { name: string }>(items: T[]): T[] => (
  [...items].sort((a, b) => a.name.localeCompare(b.name))
)

const findSubjectTeacherId = (subject?: Subject): string => subject?.teacherId ?? ''

const getCardLabel = (
  card: Flashcard,
  subjectsById: Map<string, Subject>
): string => {
  const subjectName = subjectsById.get(card.subjectId)?.name ?? 'Unknown subject'
  const question = card.question.replace(/\s+/g, ' ').trim()
  const shortQuestion = question.length > 86 ? `${question.slice(0, 86)}...` : question

  return `${subjectName} - ${shortQuestion}`
}

export const CardEditorPage: React.FC = () => {
  const [dataVersion, setDataVersion] = useState(0)
  const [mode, setMode] = useState<EditorMode>('add')
  const [selectedCardId, setSelectedCardId] = useState('')
  const [cardSearch, setCardSearch] = useState('')
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [type, setType] = useState<Flashcard['type']>('understand')
  const [subjectChoice, setSubjectChoice] = useState('')
  const [teacherChoice, setTeacherChoice] = useState('')
  const [categoryId, setCategoryId] = useState<Subject['categoryId']>('cs')
  const [newSubjectName, setNewSubjectName] = useState('')
  const [newTeacherName, setNewTeacherName] = useState('')
  const [notice, setNotice] = useState<Notice | null>(emptyNotice)
  const [showMobilePreview, setShowMobilePreview] = useState(false)

  const cards = useMemo(() => {
    void dataVersion
    return getAllFlashcards()
  }, [dataVersion])
  const subjects = useMemo(() => {
    void dataVersion
    return sortByName(getAllSubjects())
  }, [dataVersion])
  const teachers = useMemo(() => {
    void dataVersion
    return sortByName(getAllTeachers())
  }, [dataVersion])
  const categories = useMemo(() => getAllCategories(), [])

  const subjectsById = useMemo(() => (
    new Map(subjects.map(subject => [subject.id, subject]))
  ), [subjects])

  const teachersById = useMemo(() => (
    new Map(teachers.map(teacher => [teacher.id, teacher]))
  ), [teachers])

  const filteredCards = useMemo(() => {
    const query = cardSearch.trim().toLowerCase()
    const sortedCards = [...cards].sort((a, b) => (
      getCardLabel(a, subjectsById).localeCompare(getCardLabel(b, subjectsById))
    ))

    if (!query) {
      return sortedCards
    }

    return sortedCards.filter(card => {
      const label = getCardLabel(card, subjectsById).toLowerCase()

      return (
        label.includes(query) ||
        card.answer.toLowerCase().includes(query)
      )
    })
  }, [cardSearch, cards, subjectsById])

  const selectedSubject = subjectChoice && subjectChoice !== NEW_SUBJECT_VALUE
    ? subjectsById.get(subjectChoice)
    : undefined

  const selectedTeacher = teacherChoice && teacherChoice !== NEW_TEACHER_VALUE
    ? teachersById.get(teacherChoice)
    : undefined

  const refreshData = () => setDataVersion(version => version + 1)

  const setSubjectFromChoice = (nextSubjectId: string) => {
    setSubjectChoice(nextSubjectId)
    setNotice(emptyNotice)

    const subject = subjectsById.get(nextSubjectId)
    if (subject) {
      setCategoryId(subject.categoryId)
      setTeacherChoice(findSubjectTeacherId(subject))
    }
  }

  const resetForm = () => {
    setMode('add')
    setSelectedCardId('')
    setQuestion('')
    setAnswer('')
    setType('understand')
    setSubjectChoice('')
    setTeacherChoice('')
    setCategoryId('cs')
    setNewSubjectName('')
    setNewTeacherName('')
    setNotice(emptyNotice)
  }

  const loadCard = (cardId: string) => {
    const card = cards.find(item => item.id === cardId)
    if (!card) return

    const subject = subjectsById.get(card.subjectId)
    setMode('edit')
    setSelectedCardId(card.id)
    setQuestion(card.question)
    setAnswer(card.answer)
    setType(card.type)
    setSubjectChoice(card.subjectId)
    setCategoryId(subject?.categoryId ?? 'cs')
    setTeacherChoice(findSubjectTeacherId(subject))
    setNewSubjectName('')
    setNewTeacherName('')
    setNotice(emptyNotice)
  }

  const resolveTeacherId = (): string | undefined => {
    if (teacherChoice === NEW_TEACHER_VALUE) {
      const teacherName = newTeacherName.trim()
      if (!teacherName) {
        throw new Error('Add the new teacher name first.')
      }

      const teacherId = makeStudyDataId(teacherName, teachers.map(teacher => teacher.id))
      upsertUserTeacher({ id: teacherId, name: teacherName })
      setTeacherChoice(teacherId)
      return teacherId
    }

    return teacherChoice || undefined
  }

  const resolveSubjectId = (): string => {
    if (!subjectChoice) {
      throw new Error('Choose a subject for this flashcard.')
    }

    if (subjectChoice === NEW_SUBJECT_VALUE) {
      const subjectName = newSubjectName.trim()
      if (!subjectName) {
        throw new Error('Add the new subject name first.')
      }

      const teacherId = resolveTeacherId()
      if (!teacherId) {
        throw new Error('Choose or add a teacher for the new subject.')
      }

      const subjectId = makeStudyDataId(subjectName, subjects.map(subject => subject.id))
      upsertUserSubject({
        id: subjectId,
        name: subjectName,
        categoryId,
        teacherId
      })

      setSubjectChoice(subjectId)
      return subjectId
    }

    const subject = subjectsById.get(subjectChoice)
    if (!subject) {
      throw new Error('Choose a subject for this flashcard.')
    }

    const teacherId = resolveTeacherId()
    upsertUserSubject({
      ...subject,
      categoryId,
      teacherId
    })

    return subject.id
  }

  const saveCard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const trimmedQuestion = question.trim()
      const trimmedAnswer = answer.trim()

      if (!trimmedQuestion || !trimmedAnswer) {
        throw new Error('Question and answer are both required.')
      }

      const resolvedSubjectId = resolveSubjectId()
      const cardId = mode === 'edit' && selectedCardId
        ? selectedCardId
        : makeFlashcardId(resolvedSubjectId, cards)

      upsertUserFlashcard({
        id: cardId,
        subjectId: resolvedSubjectId,
        type,
        question: trimmedQuestion,
        answer: trimmedAnswer
      })

      setMode('edit')
      setSelectedCardId(cardId)
      setNewSubjectName('')
      setNewTeacherName('')
      refreshData()
      setNotice({
        kind: 'success',
        message: mode === 'edit' ? 'Flashcard updated.' : 'Flashcard added.'
      })
    } catch (error) {
      setNotice({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Could not save the flashcard.'
      })
    }
  }

  const previewPanel = (
    <div className="surface-card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold uppercase tracking-wide text-teal-700">Preview</div>
          <h2 className="text-xl font-bold text-slate-950">Rendered card</h2>
        </div>
        <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          {type === 'memorize' ? 'Memorize' : 'Understand'}
        </span>
      </div>

      <div className="space-y-5">
        <section>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Question</div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            {question.trim() ? (
              <MarkdownContent variant="question">{question}</MarkdownContent>
            ) : (
              <p className="text-sm text-slate-400">Question preview</p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Answer</div>
          <div className="max-h-[48svh] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4">
            {answer.trim() ? (
              <MarkdownContent>{answer}</MarkdownContent>
            ) : (
              <p className="text-sm text-slate-400">Answer preview</p>
            )}
          </div>
        </section>

        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-lg bg-blue-50 px-3 py-1 text-blue-700">
            {selectedSubject?.name ?? (newSubjectName.trim() || 'Subject')}
          </span>
          <span className="rounded-lg bg-teal-50 px-3 py-1 text-teal-700">
            {selectedTeacher?.name ?? (newTeacherName.trim() || 'Teacher')}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <main className="page-shell">
      <PageHeader
        eyebrow="Card editor"
        title="Add or edit flashcards"
        description="Write with Markdown and LaTeX, preview the rendered card, and keep custom cards alongside the JSON study set."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.82fr)] lg:items-start">
        <form className="surface-card p-5" onSubmit={saveCard}>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={resetForm}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  mode === 'add'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-white/80'
                }`}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add
              </button>
              <button
                type="button"
                onClick={() => setMode('edit')}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
                  mode === 'edit'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-white/80'
                }`}
              >
                <SquarePen className="h-4 w-4" aria-hidden="true" />
                Edit
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowMobilePreview(value => !value)}
              className="secondary-action lg:hidden"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
              Preview
            </button>
          </div>

          {mode === 'edit' && (
            <div className="mb-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <label className="field-label" htmlFor="card-search">Find a flashcard</label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="card-search"
                  className="text-input pl-10"
                  value={cardSearch}
                  onChange={event => setCardSearch(event.target.value)}
                  placeholder="Search question, answer, or subject"
                />
              </div>
              <select
                className="select-input"
                value={selectedCardId}
                onChange={event => loadCard(event.target.value)}
              >
                <option value="">Choose a flashcard</option>
                {filteredCards.map(card => (
                  <option key={card.id} value={card.id}>
                    {getCardLabel(card, subjectsById)}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="card-subject">Subject</label>
              <select
                id="card-subject"
                className="select-input"
                value={subjectChoice}
                onChange={event => setSubjectFromChoice(event.target.value)}
              >
                <option value="">Choose subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
                <option value={NEW_SUBJECT_VALUE}>Add new subject</option>
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="card-teacher">Teacher</label>
              <select
                id="card-teacher"
                className="select-input"
                value={teacherChoice}
                onChange={event => {
                  setTeacherChoice(event.target.value)
                  setNotice(emptyNotice)
                }}
              >
                <option value="">No teacher selected</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
                <option value={NEW_TEACHER_VALUE}>Add new teacher</option>
              </select>
            </div>

            {subjectChoice === NEW_SUBJECT_VALUE && (
              <div>
                <label className="field-label" htmlFor="new-subject-name">New subject</label>
                <input
                  id="new-subject-name"
                  className="text-input"
                  value={newSubjectName}
                  onChange={event => setNewSubjectName(event.target.value)}
                  placeholder="Subject name"
                />
              </div>
            )}

            {teacherChoice === NEW_TEACHER_VALUE && (
              <div>
                <label className="field-label" htmlFor="new-teacher-name">New teacher</label>
                <input
                  id="new-teacher-name"
                  className="text-input"
                  value={newTeacherName}
                  onChange={event => setNewTeacherName(event.target.value)}
                  placeholder="Teacher name"
                />
              </div>
            )}

            <div>
              <label className="field-label" htmlFor="card-category">Category</label>
              <select
                id="card-category"
                className="select-input"
                value={categoryId}
                onChange={event => setCategoryId(event.target.value as Subject['categoryId'])}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="card-type">Card type</label>
              <select
                id="card-type"
                className="select-input"
                value={type}
                onChange={event => setType(event.target.value as Flashcard['type'])}
              >
                <option value="understand">Understand</option>
                <option value="memorize">Memorize</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className="field-label" htmlFor="card-question">Question</label>
            <textarea
              id="card-question"
              className="textarea-input min-h-32"
              value={question}
              onChange={event => setQuestion(event.target.value)}
              placeholder="Write the question with Markdown or $LaTeX$"
            />
          </div>

          <div className="mt-5">
            <label className="field-label" htmlFor="card-answer">Answer</label>
            <textarea
              id="card-answer"
              className="textarea-input min-h-64"
              value={answer}
              onChange={event => setAnswer(event.target.value)}
              placeholder="Write the answer with Markdown, code blocks, and $$display math$$"
            />
          </div>

          {notice && (
            <div className={`mt-5 rounded-lg border px-4 py-3 text-sm font-semibold ${
              notice.kind === 'success'
                ? 'border-teal-200 bg-teal-50 text-teal-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}>
              {notice.message}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" className="primary-action">
              <Save className="h-4 w-4" aria-hidden="true" />
              Save flashcard
            </button>
            {selectedCardId && (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Check className="h-4 w-4 text-teal-700" aria-hidden="true" />
                {selectedCardId}
              </span>
            )}
          </div>
        </form>

        <div className="hidden lg:block">
          {previewPanel}
        </div>

        {showMobilePreview && (
          <div className="lg:hidden">
            {previewPanel}
          </div>
        )}
      </div>
    </main>
  )
}
