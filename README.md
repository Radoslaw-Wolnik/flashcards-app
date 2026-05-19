# Flashcards Study App

A React study app for licencjat exam preparation. It focuses on technical flashcards with Markdown, code blocks, and KaTeX math rendering.

## What It Does

- Reading mode: browse every flashcard by subject, teacher, category, type, and search text.
- Training mode: build a focused practice set and repeat missed cards in later rounds.
- Exam mode: simulate a broad exam round with one question per teacher.
- Slow read mode: move through one subject calmly with arrows, keyboard, or swipe navigation.
- Cards page: add or edit flashcards with Markdown, LaTeX, and a live rendered preview.

## Tech Stack

- Vite, React, TypeScript, React Router
- Tailwind CSS v4 through `@tailwindcss/vite`
- React Markdown, Remark GFM, Remark Math, Rehype KaTeX
- Lucide React icons

Tailwind is configured in the v4 CSS-first style: the Vite plugin is in `vite.config.ts`, Tailwind is imported from `src/index.css`, and shared app tokens/components live there.

## Project Structure

```text
src/
  components/          Reusable UI and study-mode components
  data/                Runtime JSON data used by the app
    flashcards/        Per-subject flashcard collections
  pages/               Route-level study modes
  utils/               Data, filtering, markdown, and session helpers
```

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
```

Open the dev server at `http://localhost:5173/`.

## Flashcard Format

Flashcards live in `src/data/flashcards/*.json`.

```json
{
  "id": "analiza_matematyczna-01",
  "subjectId": "analiza_matematyczna",
  "type": "memorize",
  "question": "Question text with optional $LaTeX$",
  "answer": "Answer with **Markdown**, code blocks, and $$display math$$"
}
```

Use stable, globally unique card IDs. The current convention is `subjectId-01`, `subjectId-02`, and so on.

## Editing Cards

The app reads the checked-in study set from `src/data`. The Cards page stores added or edited cards in browser localStorage and merges them with the JSON data at runtime, so custom edits survive refreshes on the same browser without needing to touch the JSON files by hand.
