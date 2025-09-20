'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { CheckCircle2, Circle, Edit, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AddChapterDialog } from '@/components/courses/add-chapter-dialog';
import { EditCourseDialog } from '@/components/courses/edit-course-dialog';
import { AddLessonDialog } from '@/components/courses/add-lesson-dialog';
import { EditChapterDialog } from '@/components/courses/edit-chapter-dialog';
import { EditLessonDialog } from '@/components/courses/edit-lesson-dialog';
import { DeleteConfirmationDialog } from '@/components/courses/delete-confirmation-dialog';
import { useCourse } from '@/contexts/course-context';

interface Lesson {
    id: string;
    title: string;
    completed: boolean;
    content: string | null;
    videoUrl: string | null;
}

interface Chapter {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface Course {
    id: string;
    title: string;
    description: string;
    tags: string[];
    chapters: Chapter[];
}

export default function CourseDetailPage() {
    const { course, setCourse } = useCourse();
    const [editMode, setEditMode] = useState(false);

    const handleChapterAdded = (newChapter: Chapter) => {
        if (course) {
            setCourse({
                ...course,
                chapters: [...course.chapters, newChapter],
            });
        }
    };

    const handleLessonAdded = (newLesson: Lesson, chapterId: string) => {
        if (course) {
            const newCourse = { ...course };
            const chapter = newCourse.chapters.find((c) => c.id === chapterId);
            if (chapter) {
                chapter.lessons.push(newLesson);
                setCourse(newCourse);
            }
        }
    };

    const handleCourseUpdated = (updatedCourse: Course) => {
        if (course) {
            setCourse({ ...course, ...updatedCourse });
        }
    };

    const handleChapterUpdated = (updatedChapter: Chapter) => {
        if (course) {
            const newCourse = { ...course };
            const chapterIndex = newCourse.chapters.findIndex(
                (c) => c.id === updatedChapter.id
            );
            if (chapterIndex !== -1) {
                newCourse.chapters[chapterIndex] = {
                    ...newCourse.chapters[chapterIndex],
                    ...updatedChapter,
                };
                setCourse(newCourse);
            }
        }
    };

    const handleLessonUpdated = (updatedLesson: Lesson) => {
        if (course) {
            const newCourse = { ...course };
            for (const chapter of newCourse.chapters) {
                const lessonIndex = chapter.lessons.findIndex(
                    (l) => l.id === updatedLesson.id
                );
                if (lessonIndex !== -1) {
                    chapter.lessons[lessonIndex] = {
                        ...chapter.lessons[lessonIndex],
                        ...updatedLesson,
                    };
                    setCourse(newCourse);
                    break;
                }
            }
        }
    };

    const handleDeleteChapter = async (chapterId: string) => {
        if (course) {
            const newCourse = {
                ...course,
                chapters: course.chapters.filter((c) => c.id !== chapterId),
            };
            setCourse(newCourse);
            await fetch(`/api/chapters/${chapterId}`, { method: 'DELETE' });
        }
    };

    const handleDeleteLesson = async (lessonId: string) => {
        if (course) {
            const newCourse = { ...course };
            for (const chapter of newCourse.chapters) {
                chapter.lessons = chapter.lessons.filter(
                    (l) => l.id !== lessonId
                );
            }
            setCourse(newCourse);
            await fetch(`/api/lessons/${lessonId}`, { method: 'DELETE' });
        }
    };

    if (!course) {
        return <div className="p-6 text-center">Курс не найден.</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                    <p className="text-muted-foreground mb-6">
                        {course.description}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Label htmlFor="edit-mode">Режим ред.</Label>
                    <Switch
                        id="edit-mode"
                        checked={editMode}
                        onCheckedChange={setEditMode}
                    />
                </div>
            </div>

            {editMode && (
                <div className="mb-6 flex gap-2">
                    <EditCourseDialog
                        course={course}
                        onCourseUpdated={handleCourseUpdated}
                    />
                    <AddChapterDialog
                        courseId={course.id}
                        onChapterAdded={handleChapterAdded}
                    />
                </div>
            )}

            <Accordion type="single" collapsible className="w-full">
                {course.chapters.map((chapter) => (
                    <AccordionItem value={chapter.id} key={chapter.id}>
                        <div className="flex items-center justify-between w-full pr-4">
                            <AccordionTrigger className="text-lg font-semibold flex-1">
                                <span>{chapter.title}</span>
                            </AccordionTrigger>
                            {editMode && (
                                <div className="flex items-center gap-2 ml-4">
                                    <EditChapterDialog
                                        chapter={chapter}
                                        onChapterUpdated={handleChapterUpdated}
                                    />
                                    <DeleteConfirmationDialog
                                        onDelete={() =>
                                            handleDeleteChapter(chapter.id)
                                        }
                                        itemName={`главу "${chapter.title}"`}
                                    />
                                    <AddLessonDialog
                                        chapterId={chapter.id}
                                        onLessonAdded={handleLessonAdded}
                                    />
                                </div>
                            )}
                        </div>
                        <AccordionContent>
                            <ul className="space-y-2 pt-2">
                                {chapter.lessons.map((lesson) => (
                                    <li
                                        key={lesson.id}
                                        className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 "
                                    >
                                        <Link
                                            href={`/courses/${course.id}/lessons/${lesson.id}`}
                                            className="flex items-center flex-1"
                                        >
                                            {lesson.completed ? (
                                                <CheckCircle2 className="h-5 w-5 mr-3 text-green-500" />
                                            ) : (
                                                <Circle className="h-5 w-5 mr-3 text-muted-foreground" />
                                            )}
                                            <span>{lesson.title}</span>
                                        </Link>
                                        {editMode && (
                                            <div className="flex items-center gap-2">
                                                <EditLessonDialog
                                                    lesson={lesson}
                                                    onLessonUpdated={
                                                        handleLessonUpdated
                                                    }
                                                />
                                                <DeleteConfirmationDialog
                                                    onDelete={() =>
                                                        handleDeleteLesson(
                                                            lesson.id
                                                        )
                                                    }
                                                    itemName={`урок "${lesson.title}"`}
                                                />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
