import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'

const ReadingPage = lazy(() => import('./pages/ReadingPage').then(module => ({
  default: module.ReadingPage
})))
const TrainingPage = lazy(() => import('./pages/TrainingPage').then(module => ({
  default: module.TrainingPage
})))
const ExamPage = lazy(() => import('./pages/ExamPage').then(module => ({
  default: module.ExamPage
})))
const SlowReadPage = lazy(() => import('./pages/SlowReadPage'))
const CardEditorPage = lazy(() => import('./pages/CardEditorPage').then(module => ({
  default: module.CardEditorPage
})))

const RouteFallback: React.FC = () => (
  <main className="page-shell">
    <div className="surface-card p-6 text-sm font-medium text-slate-600">
      Loading study mode...
    </div>
  </main>
)

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Header />
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<ReadingPage />} />
        <Route path="/training" element={<TrainingPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/slow-read" element={<SlowReadPage />} />
        <Route path="/cards" element={<CardEditorPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
)
