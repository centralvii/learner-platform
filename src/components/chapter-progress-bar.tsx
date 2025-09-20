'use client'

import { cn } from '@/lib/utils'

interface Lesson {
  id: string;
  completed: boolean;
}

interface ChapterProgressBarProps {
  lessons: Lesson[];
  currentLessonId: string;
}

export function ChapterProgressBar({ lessons, currentLessonId }: ChapterProgressBarProps) {
  return (
    <div className="flex w-full gap-1 h-2">
      {lessons.map((lesson) => (
        <div
          key={lesson.id}
          className={cn(
            'flex-1 rounded-full',
            lesson.completed ? 'bg-primary' : (lesson.id === currentLessonId ? 'bg-muted-foreground' : 'bg-muted')
          )}
        />
      ))}
    </div>
  )
}
