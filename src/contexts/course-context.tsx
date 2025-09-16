import { createContext, useContext } from 'react';

interface Course {
    id: string;
    title: string;
    description: string;
    tags: string[];
    chapters: any[];
}

interface CourseContextType {
  course: Course | null;
  setCourse: (course: Course | null) => void;
  updateLessonCompletion: (lessonId: string, completed: boolean) => void;
}

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}
