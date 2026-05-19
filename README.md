# Flashcards Study App

A React study app for licencjat exam preparation. It focuses on technical flashcards with Markdown, code blocks, and KaTeX math rendering.

## What It Does

- Reading mode: browse every flashcard by subject, teacher, category, type, and search text.
- Training mode: build a focused practice set and repeat missed cards in later rounds.
- Exam mode: simulate a broad exam round with one question per teacher.
- Slow read mode: move through one subject calmly with arrows, keyboard, or swipe navigation.

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
content/source/        Original Markdown source material
scripts/               Import/normalization helpers for source material
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

## Content Helpers

The original Markdown inputs are kept in `content/source/`.

```bash
python scripts/import_flashcards.py content/source/Maths.md --category maths --out-dir out
python scripts/import_flashcards.py content/source/ComputerScience.md --category cs --out-dir out
python scripts/normalize_flashcard_json.py --input-dir out/flashcards --output-dir out/cleaned
```

Review generated JSON before copying it into `src/data`, especially teacher assignments and answer wording.
