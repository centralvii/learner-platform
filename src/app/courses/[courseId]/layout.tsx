'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CourseContext } from '@/contexts/course-context';
import { useParams, usePathname } from 'next/navigation';
import { CourseSidebar } from '@/components/courses/course-sidebar';
import { LessonSidebar } from '@/components/lesson-sidebar';
import { cn } from '@/lib/utils';
import { SlidingSidebar } from '@/components/sliding-sidebar';
import { CourseNotesSidebar } from '@/components/course-notes-sidebar';

// ... (interfaces)

export default function CourseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const pathname = usePathname();
    const courseId = params.courseId as string;
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCourseNavOpen, setIsCourseNavOpen] = useState(false);
    const [isNotesSidebarOpen, setIsNotesSidebarOpen] = useState(false);
    const lessonSidebarRef = useRef<HTMLElement>(null);

    const isLessonPage = pathname.includes('/lessons/');

    // ... (fetchCourse and updateLessonCompletion)
    const fetchCourse = () => {
        if (courseId) {
            setLoading(true);
            fetch(`/api/courses/${courseId}`)
                .then((res) => res.json())
                .then((data) => {
                    setCourse(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error fetching course:', err);
                    setLoading(false);
                });
        }
    };
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
    };

    const handleToggleCourseNav = useCallback(() => {
        setIsCourseNavOpen((prev) => !prev);
    }, []);

    const handleToggleNotes = useCallback(() => {
        setIsNotesSidebarOpen((prev) => !prev);
    }, []);

    if (loading || !course) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <p>Загрузка курса...</p>
            </div>
        );
    }

    return (
        <CourseContext.Provider
            value={{ course, setCourse, updateLessonCompletion }}
        >
            <div className="flex h-screen">
                {isLessonPage ? (
                    <LessonSidebar
                        ref={lessonSidebarRef}
                        isCourseNavOpen={isCourseNavOpen}
                        isNotesOpen={isNotesSidebarOpen}
                        onToggleCourseNav={handleToggleCourseNav}
                        onToggleNotes={handleToggleNotes}
                        courseId={course.id}
                    />
                ) : (
                    <CourseSidebar course={course} />
                )}

                {isLessonPage && (
                    <>
                        <SlidingSidebar
                            isOpen={isCourseNavOpen}
                            onClose={() => setIsCourseNavOpen(false)}
                            excludeRef={lessonSidebarRef}
                        >
                            <CourseSidebar course={course} />
                        </SlidingSidebar>
                        <SlidingSidebar
                            isOpen={isNotesSidebarOpen}
                            onClose={() => setIsNotesSidebarOpen(false)}
                            excludeRef={lessonSidebarRef}
                            disableOutsideClick={true}
                            disableBackdrop={true}
                            hasRightBorder={true}
                        >
                            <CourseNotesSidebar
                                courseId={course.id}
                                onClose={() => setIsNotesSidebarOpen(false)}
                            />
                        </SlidingSidebar>
                    </>
                )}

                <main
                    className={cn(
                        'flex-1 overflow-auto',
                        isLessonPage ? 'pl-16' : ''
                    )}
                >
                    {children}
                </main>
            </div>
        </CourseContext.Provider>
    );
}
