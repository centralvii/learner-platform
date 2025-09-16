'use client'

import { CourseSidebar } from "@/components/courses/course-sidebar";
import { useState, useEffect } from "react";
import { CourseContext } from "@/contexts/course-context";
import { useParams } from 'next/navigation';

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
  
  interface Course {
    id: string
    title: string
    description: string
    chapters: Chapter[]
    tags: string[]
  }

export default function CourseLayout({ 
    children
}: {
    children: React.ReactNode
}) {
    const params = useParams();
    const courseId = params.courseId as string;
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchCourse = () => {
        if (courseId) {
            setLoading(true);
            fetch(`/api/courses/${courseId}`)
                .then(res => res.json())
                .then(data => {
                    setCourse(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching course:', err);
                    setLoading(false);
                });
        }
    }

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    const updateLessonCompletion = (lessonId: string, completed: boolean) => {
        if (course) {
            const newCourse = { ...course };
            for (const chapter of newCourse.chapters) {
                for (const lesson of chapter.lessons) {
                    if (lesson.id === lessonId) {
                        lesson.completed = completed;
                        break;
                    }
                }
            }
            setCourse(newCourse);
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen">
              <div className="w-80 h-full bg-gray-100 animate-pulse"></div>
              <div className="flex-1 p-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="space-y-4">
                    <div className="bg-gray-200 rounded-lg h-64"></div>
                    <div className="bg-gray-200 rounded-lg h-32"></div>
                  </div>
                </div>
              </div>
            </div>
          )
    }

    if (!course) {
        return <div className="p-6 text-center">Курс не найден.</div>
    }

    return (
        <CourseContext.Provider value={{ course, setCourse, updateLessonCompletion }}>
            <div className="flex h-screen">
                <CourseSidebar course={course} />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </CourseContext.Provider>
    );
}