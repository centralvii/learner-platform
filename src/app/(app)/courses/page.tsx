'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateCourseDialog } from '@/components/courses/create-course-dialog'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { DeleteConfirmationDialog } from '@/components/courses/delete-confirmation-dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface Course {
  id: string
  title: string
  description: string
  tags: string[]
  chaptersCount: number
  lessonsCount: number
  progress: number
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)

  const fetchCourses = () => {
    setLoading(true)
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching courses:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleDeleteCourse = async (courseId: string) => {
    await fetch(`/api/courses/${courseId}`, { method: 'DELETE' })
    fetchCourses()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold">Курсы</h1>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
                <Label htmlFor="edit-mode">Режим ред.</Label>
                <Switch id="edit-mode" checked={editMode} onCheckedChange={setEditMode} />
            </div>
            <CreateCourseDialog onCourseCreated={fetchCourses} />
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">Нет курсов</h2>
          <p className="text-muted-foreground mt-2">Начните с создания своего первого курса.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course.id} className="h-full flex flex-col hover:shadow-lg transition-shadow relative">
                {editMode && (
                    <div className="absolute top-2 right-2 z-10">
                        <DeleteConfirmationDialog onDelete={() => handleDeleteCourse(course.id)} itemName={`курс "${course.title}"`} />
                    </div>
                )}
                <Link href={`/courses/${course.id}`} className="flex flex-col flex-grow">
                    <CardHeader>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2 h-[40px]">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-end">
                        <div className="mb-4">
                            <Progress value={course.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">{course.progress}% пройдено</p>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{course.chaptersCount} глав</span>
                            <span>{course.lessonsCount} уроков</span>
                        </div>
                    </CardContent>
                </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}