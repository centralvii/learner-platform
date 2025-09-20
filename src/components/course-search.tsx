'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X, Book, FileText } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface SearchResult {
    id: string;
    title: string;
    content?: string;
    type: 'lesson';
    courseId?: string;
}

interface CourseSearchProps {
    courseId: string;
}

export function CourseSearch({ courseId }: CourseSearchProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setOpen(true);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (debouncedQuery) {
            setLoading(true);
            fetch(`/api/courses/search?q=${debouncedQuery}&courseId=${courseId}`)
                .then(res => res.json())
                .then(data => {
                    setResults(data.lessons || []);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error searching:', err);
                    setLoading(false);
                });
        } else {
            setResults([]);
        }
    }, [debouncedQuery, courseId]);

    const handleSelect = (result: SearchResult) => {
        router.push(`/courses/${courseId}/lessons/${result.id}`);
        setOpen(false);
    }

    return (
        <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-lg" onClick={() => setOpen(true)}>
              <Search className="!h-6 !w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Поиск</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

            {open && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
                    <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                        <div className="bg-background rounded-lg shadow-2xl flex items-center p-4">
                            <Search className="h-5 w-5 text-muted-foreground" />
                            <Input 
                                placeholder="Поиск по урокам этого курса..." 
                                className="border-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0 !shadow-none"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
              <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {(loading || results.length > 0) && (
                            <div className="bg-background rounded-lg shadow-2xl mt-4 p-4 max-h-[60vh] overflow-y-auto">
                                {loading ? (
                                    <div className="text-center py-4">Загрузка...</div>
                                ) : (
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">Уроки</h3>
                                        <div className="space-y-2">
                                            {results.map(result => (
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
                </div>
            )}
        </>
    )
}