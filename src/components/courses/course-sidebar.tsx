'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CheckCircle2, Circle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Lesson {
  id: string
  title: string
  completed: boolean
}

interface Chapter {
  id: string
  title: string
  lessons: Lesson[]
}

interface CourseSidebarProps {
  course: {
    id: string
    title: string
    chapters: Chapter[]
  }
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const params = useParams()
  const lessonId = params.lessonId as string

  const defaultAccordionValue = lessonId 
    ? course.chapters.find(chapter => 
        chapter.lessons.some(lesson => lesson.id === lessonId)
      )?.id
    : undefined;

  return (
    <div className="h-full border-r bg-gray-50 dark:bg-gray-900 w-80 flex flex-col">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-1">{course.title}</h2>
        <Link href={`/courses/${course.id}`} className="text-sm text-muted-foreground hover:underline">
          Вернуться к обзору курса
        </Link>
      </div>
      <div className="flex-1 overflow-auto">
        <Accordion type="single" collapsible defaultValue={defaultAccordionValue} className="w-full">
          {course.chapters.map(chapter => (
            <AccordionItem value={chapter.id} key={chapter.id} className="border-t">
              <AccordionTrigger className="px-4 py-3 text-md font-semibold">
                {chapter.title}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 pb-2">
                  {chapter.lessons.map(lesson => {
                    const isActive = lesson.id === lessonId
                    return (
                      <li key={lesson.id}>
                        <Link href={`/courses/${course.id}/lessons/${lesson.id}`}>
                          <div className={cn(
                            "flex items-center px-4 py-2 mx-2 rounded-md transition-colors",
                            isActive 
                              ? "bg-gray-200 dark:bg-gray-700"
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}>
                            {lesson.completed ? (
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className={cn("text-sm", isActive && "font-semibold")}>
                              {lesson.title}
                            </span>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="p-4 border-t">
        <Link href="/courses">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Все курсы
          </Button>
        </Link>
      </div>
    </div>
  )
}
