'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    CheckCircle2,
    Circle,
    FileText,
    ArrowRight,
    ArrowLeft,
    MessageSquare,
} from 'lucide-react';
import { NoteSection } from '@/components/lessons/note-section';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useCourse } from '@/contexts/course-context';
import { SelectionMenu } from '@/components/selection-menu';
import { AddNoteDialog } from '@/components/lessons/add-note-dialog';
import { AddBookmarkDialog } from '@/components/lessons/add-bookmark-dialog';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { ChapterProgressBar } from '@/components/chapter-progress-bar';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AiChat } from '@/components/ai-chat';

interface Lesson {
    id: string;
    title: string;
    content: string | null;
    videoUrl: string | null;
    completed: boolean;
}

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = params.lessonId as string;
    const { course, updateLessonCompletion } = useCourse();

    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
    const [showAddBookmarkDialog, setShowAddBookmarkDialog] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [refetchCounter, setRefetchCounter] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const currentChapter = course?.chapters.find((chapter) =>
        chapter.lessons.some((l) => l.id === lessonId)
    );
    const lessonsInChapter = currentChapter?.lessons || [];
    const completedLessonsInChapter = lessonsInChapter.filter(
        (l) => l.completed
    ).length;
    const totalLessonsInChapter = lessonsInChapter.length;
    const chapterProgress =
        totalLessonsInChapter > 0
            ? (completedLessonsInChapter / totalLessonsInChapter) * 100
            : 0;

    const allLessons =
        course?.chapters.flatMap((chapter) => chapter.lessons) || [];
    const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);

    const prevLesson =
        currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;

    const nextLesson =
        currentLessonIndex !== -1 && currentLessonIndex < allLessons.length - 1
            ? allLessons[currentLessonIndex + 1]
            : null;

    const handlePrevLesson = () => {
        if (prevLesson && course) {
            router.push(`/courses/${course.id}/lessons/${prevLesson.id}`);
        }
    };

    const handleNextLesson = async () => {
        if (lesson && !lesson.completed) {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lessonId: lesson.id,
                    completed: true,
                }),
            });
            updateLessonCompletion(lesson.id, true);
        }
        if (nextLesson && course) {
            router.push(`/courses/${course.id}/lessons/${nextLesson.id}`);
        }
    };

    const fetchLesson = () => {
        if (lessonId) {
            setLoading(true);
            fetch(`/api/lessons/${lessonId}`)
                .then((res) => res.json())
                .then((data) => {
                    setLesson(data);
                })
                .catch((err) => console.error('Error fetching lesson:', err))
                .finally(() => setLoading(false));
        }
    };

    useEffect(() => {
        fetchLesson();
    }, [lessonId]);

    const handleToggleComplete = async () => {
        if (!lesson) return;

        const newCompletedStatus = !lesson.completed;

        try {
            await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lessonId: lesson.id,
                    completed: newCompletedStatus,
                }),
            });
            // Optimistically update the lesson page UI
            setLesson({ ...lesson, completed: newCompletedStatus });
            // Update the sidebar UI via context
            updateLessonCompletion(lesson.id, newCompletedStatus);
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    const handleAddNote = (content: string) => {
        setSelectedText(content);
        setShowAddNoteDialog(true);
    };

    const handleAddBookmark = (title: string) => {
        setSelectedText(title);
        setShowAddBookmarkDialog(true);
    };

    const saveNote = async (content: string) => {
        await fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessonId, content }),
        });
        setRefetchCounter((prev) => prev + 1);
    };

    const saveBookmark = async (title: string) => {
        await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lessonId, title }),
        });
        setRefetchCounter((prev) => prev + 1);
    };

    const handleAskAI = (content: string) => {
        console.log('Asking AI about:', content);
        // Placeholder for actual AI integration
        // For now, we can just use the bookmark functionality as a temporary placeholder
        // handleAddBookmark(content);
    };

    if (loading || !lesson) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="space-y-4">
                        <div className="bg-gray-200 rounded-lg h-64"></div>
                        <div className="bg-gray-200 rounded-lg h-32"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <SelectionMenu
                onAddNote={handleAddNote}
                onAddBookmark={handleAddBookmark}
                onAskAI={handleAskAI}
            />
            <AddNoteDialog
                isOpen={showAddNoteDialog}
                onOpenChange={setShowAddNoteDialog}
                initialContent={selectedText}
                onSave={saveNote}
            />
            <AddBookmarkDialog
                isOpen={showAddBookmarkDialog}
                onOpenChange={setShowAddBookmarkDialog}
                initialTitle={selectedText}
                onSave={saveBookmark}
            />
            <div className="max-w-prose mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{lesson.title}</h1>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleToggleComplete}
                            variant={lesson.completed ? 'secondary' : 'default'}
                        >
                            {lesson.completed ? (
                                <span className="flex items-center">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />{' '}
                                    Пройдено
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <Circle className="mr-2 h-4 w-4" /> Пройдено
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            Прогресс главы
                        </span>
                        <span className="text-sm font-semibold">
                            {completedLessonsInChapter} / {totalLessonsInChapter}{' '}
                            уроков
                        </span>
                    </div>
                    <ChapterProgressBar
                        lessons={lessonsInChapter}
                        currentLessonId={lessonId}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div
                        className={cn(
                            'transition-all duration-300',
                            showNotes ? 'lg:col-span-2' : 'lg:col-span-3'
                        )}
                    >
                        <Card className="border-none shadow-none">
                            <CardContent className="prose">
                                {lesson.videoUrl && (
                                    <div className="aspect-video mb-6">
                                        <iframe
                                            className="w-full h-full rounded-lg"
                                            src={lesson.videoUrl.replace(
                                                'rutube.ru/video/',
                                                'rutube.ru/play/embed/'
                                            )}
                                            title={lesson.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                                {lesson.content ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            code({
                                                node,
                                                inline,
                                                className,
                                                children,
                                                ...props
                                            }) {
                                                const match = /language-(\w+)/.exec(
                                                    className || ''
                                                );
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        style={vscDarkPlus}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(
                                                            /\n$/,
                                                            ''
                                                        )}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code
                                                        className={className}
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}
                                    >
                                        {lesson.content}
                                    </ReactMarkdown>
                                ) : (
                                    <p>Содержимое урока отсутствует.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    {showNotes && (
                        <div className="lg:col-span-1">
                            <NoteSection
                                key={`note-${refetchCounter}`}
                                lessonId={lessonId}
                            />
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-between items-center">
                    {prevLesson ? (
                        <Button onClick={handlePrevLesson} variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />К предыдущему
                            уроку
                        </Button>
                    ) : (
                        <div />
                    )}

                    {nextLesson && (
                        <Button onClick={handleNextLesson}>
                            К следующему уроку
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Chat Button / AI Chat Component Container */}
            <div className="fixed bottom-4 right-4">
                <Button
                    variant="default"
                    size="icon"
                    className={cn(
                        'rounded-full w-14 h-14 shadow-lg',
                        isChatOpen
                            ? 'opacity-0 pointer-events-none'
                            : 'opacity-100 pointer-events-auto'
                    )}
                    onClick={() => setIsChatOpen(true)}
                >
                    <MessageSquare className="h-6 w-6" />
                </Button>
                <AiChat
                    isOpen={isChatOpen}
                    onClose={() => setIsChatOpen(false)}
                    lessonContext={lesson.content || ''}
                />
            </div>
        </div>
    );
}
