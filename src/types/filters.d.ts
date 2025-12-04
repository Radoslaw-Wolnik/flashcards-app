// src/types/filters.ts
export interface FilterOptions {
  categoryId?: string;
  teacherId?: string;
  subjectId?: string;
  subjectIds?: string[];
  flashcardType?: string;
  count?: number | 'all';
}