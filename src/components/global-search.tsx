'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X, Book, FileText } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { cn } from '@/lib/utils'

interface SearchResult {
    id: string;
    title: string;
    description?: string;
    content?: string;
    type: 'course' | 'lesson';
    // Lesson specific
    courseId?: string;
    chapter?: { courseId: string };
}

interface GlobalSearchProps {
    isCollapsed: boolean;
}

export function GlobalSearch({ isCollapsed }: GlobalSearchProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [courses, setCourses] = useState<SearchResult[]>([]);
    const [lessons, setLessons] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setOpen(true);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (debouncedQuery) {
            setLoading(true);
            fetch(`/api/courses/search?q=${debouncedQuery}`)
                .then(res => res.json())
                .then(data => {
                    setCourses(data.courses || []);
                    setLessons(data.lessons || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error searching:', err);
                    setLoading(false);
                });
        } else {
            setCourses([]);
            setLessons([]);
        }
    }, [debouncedQuery]);

    const handleSelect = (result: SearchResult) => {
        if (result.type === 'course') {
            router.push(`/courses/${result.id}`);
        } else if (result.type === 'lesson') {
            router.push(`/courses/${result.chapter?.courseId}/lessons/${result.id}`);
        }
        setOpen(false);
    }

    return (
        <>
            <Button 
                variant="outline" 
                className={cn(
                    "w-full justify-start text-muted-foreground",
                    isCollapsed && "justify-center"
                )}
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4" />
                <span className={isCollapsed ? 'hidden' : 'ml-2'}>Поиск...</span>
                <kbd className={cn("ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100", isCollapsed && 'hidden')}>
                    <span className="text-xs">CTRL</span>K
                </kbd>
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
                    <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                        <div className="bg-background rounded-lg shadow-2xl flex items-center p-4">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <Input 
                                placeholder="Поиск курсов или уроков..." 
                                className="border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 !shadow-none"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {(loading || courses.length > 0 || lessons.length > 0) && (
                            <div className="bg-background rounded-lg shadow-2xl mt-4 p-4 max-h-[60vh] overflow-y-auto">
                                {loading ? (
                                    <div className="text-center py-4">Загрузка...</div>
                                ) : (
                                    <div className="space-y-6">
                                        {courses.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Курсы</h3>
                                                <div className="space-y-2">
                                                    {courses.map(result => (
                                                        <div key={result.id} onClick={() => handleSelect(result)} className="p-3 rounded-md hover:bg-accent cursor-pointer">
                                                            <div className="font-semibold flex items-center"><Book className="mr-2 h-4 w-4"/>{result.title}</div>
                                                            <p className="text-sm text-muted-foreground line-clamp-1">{result.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {lessons.length > 0 && (
                                            <div>
                                                <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Уроки</h3>
                                                <div className="space-y-2">
                                                    {lessons.map(result => (
                                                        <div key={result.id} onClick={() => handleSelect(result)} className="p-3 rounded-md hover:bg-accent cursor-pointer">
                                                            <div className="font-semibold flex items-center"><FileText className="mr-2 h-4 w-4"/>{result.title}</div>
                                                            <p className="text-sm text-muted-foreground line-clamp-1">{result.content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

