'use client'

import Link from 'next/link'
import { Home, BookOpen, Search, FileText, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { CourseSearch } from '@/components/course-search'

interface LessonSidebarProps {
  isCourseNavOpen: boolean;
  isNotesOpen: boolean;
  onToggleCourseNav: () => void;
  onToggleNotes: () => void;
  courseId: string;
}

export function LessonSidebar({
  isCourseNavOpen,
  isNotesOpen,
  onToggleCourseNav,
  onToggleNotes,
  courseId
}: LessonSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-16 flex-col border-r bg-background">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className="h-9 w-9 rounded-lg flex items-center justify-center text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Home className="!h-6 !w-6" />
                <span className="sr-only">Главная</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Главная</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg" onClick={onToggleCourseNav} onMouseDown={(e) => e.stopPropagation()}>
                {isCourseNavOpen ? <X className="!h-6 !w-6" /> : <BookOpen className="!h-6 !w-6" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isCourseNavOpen ? 'Закрыть программу' : 'Программа курса'}
            </TooltipContent>
          </Tooltip>
          <CourseSearch courseId={courseId} />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-lg" onClick={onToggleNotes} onMouseDown={(e) => e.stopPropagation()}>
                {isNotesOpen ? <X className="!h-6 !w-6" /> : <FileText className="!h-6 !w-6" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {isNotesOpen ? 'Закрыть заметки' : 'Заметки'}
            </TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  )
}
