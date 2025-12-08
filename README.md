# Flashcards Study App

A comprehensive flashcard learning application designed for studying code and mathematics with support for LaTeX and Markdown formatting.

## ✨ Features

### 📖 Multiple Study Modes
- **Reading Mode**: Browse all flashcards organized by subject with advanced filtering
- **Training Mode**: Focused practice sessions with spaced repetition
- **Exam Mode**: Simulated exams across multiple rounds and teachers
- **Slow Read Mode**: Relaxed, sequential card viewing with swipe navigation

### 🎯 Advanced Features
- **Rich Content Support**: LaTeX equations and Markdown formatting in answers
- **Smart Filtering**: Filter by category (Maths/CS), teacher, subject, and card type
- **Interactive Flashcards**: 3D flip animations with keyboard shortcuts
- **Progress Tracking**: Visual progress indicators and session statistics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 📊 Study Analytics
- Round-based progression in Training and Exam modes
- Correct/incorrect tracking with historical data
- Card type differentiation (memorize vs. understand)
- Teacher and subject performance metrics

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Radoslaw-Wolnik/flashcards-app.git
cd flashcard-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser to `http://localhost:5173/`

## 📝 Adding Flashcards

### Current Data Format
Flashcards are stored in JSON files within `src/data/flashcards/`. Each file contains an array of flashcard objects:

```json
[
  {
    "id": "unique-id",
    "subjectId": "subject-id",
    "type": "memorize" | "understand",
    "question": "Question text",
    "answer": "Answer with **markdown** and $LaTeX$ support"
  }
]
```

### Future Enhancement: Add Flashcards Page
A planned feature is an interface for adding flashcards directly in the application, which would store them in the existing JSON format with proper properties.

## 🔧 Configuration

### Data Files
- **subjects.json**: Defines subjects and their categories/teachers
- **teachers.json**: Teacher information
- **categories.json**: Subject categories (Maths/CS)
- **flashcards/*.json**: Individual flashcard collections

### Study Modes Configuration
Each study mode has configurable options:
- **Training**: Select subjects, number of questions, question types
- **Exam**: Choose number of rounds (1, 3, 5, or 10)
- **Reading**: Filter by multiple criteria simultaneously

## 🎨 Styling

The application uses Tailwind CSS for styling with custom components for:
- 3D card flip animations
- Gradient backgrounds
- Responsive layouts
- Interactive hover states
- Progress indicators

## 🛠️ Development

### Code Organization Notes
The project structure could benefit from some file unification:

**TODO: File Consolidation Opportunities**
- Consider merging similar component types (e.g., TrainingFlashcardViewer and ExamFlashcardViewer share significant logic)
- Unify filter components across different pages
- Consolidate animation logic into reusable hooks
- Create a shared utilities folder for common functions

### Key Dependencies
- **React**: UI framework
- **TypeScript**: Type safety
- **React Router**: Navigation
- **React Markdown**: Markdown rendering
- **KaTeX**: LaTeX equation rendering
- **Tailwind CSS**: Styling
- **Headless UI**: Accessible UI components

## 📈 Performance

- Lazy loading of flashcard data
- Memoized filtering operations
- Efficient state management with useMemo and useCallback
- Optimized re-renders with proper component separation


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Markdown and LaTeX rendering libraries
- Icons from Lucide React
- UI patterns from Headless UI
- Design inspiration from modern learning platforms

---

**Note**: This is a learning-focused application. The primary goal is to provide an effective study tool for technical subjects with proper formatting support for mathematical notation and code examples.