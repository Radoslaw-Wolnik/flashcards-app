import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { ReadingPage } from './pages/ReadingPage'
import { TrainingPage } from './pages/TrainingPage'
import { ExamPage } from './pages/ExamPage'
import SlowReadPage from './pages/SlowReadPage'

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<ReadingPage />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/exam" element={<ExamPage />} />
      <Route path="/slow-read" element={<SlowReadPage />} />
    </Routes>
  </BrowserRouter>
)
