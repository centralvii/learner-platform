'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/courses/delete-confirmation-dialog';

interface BookmarkItem {
    id: string;
    title: string;
    createdAt: string;
}

interface BookmarkSectionProps {
    lessonId: string;
}

export function BookmarkSection({ lessonId }: BookmarkSectionProps) {
    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
    const [newBookmark, setNewBookmark] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchBookmarks = () => {
        setLoading(true);
        fetch(`/api/lessons/${lessonId}/bookmarks`)
            .then((res) => res.json())
            .then((data) => {
                setBookmarks(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching bookmarks:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBookmarks();
    }, [lessonId]);

    const handleAddBookmark = async () => {
        if (!newBookmark.trim()) return;

        try {
            await fetch('/api/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId, title: newBookmark }),
            });
            setNewBookmark('');
            fetchBookmarks(); // Refresh bookmarks list
        } catch (error) {
            console.error('Error creating bookmark:', error);
        }
    };

    const handleDeleteBookmark = async (bookmarkId: string) => {
        await fetch(`/api/bookmarks/${bookmarkId}`, { method: 'DELETE' });
        fetchBookmarks();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Закладки</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Название закладки..."
                            value={newBookmark}
                            onChange={(e) => setNewBookmark(e.target.value)}
                        />
                        <Button onClick={handleAddBookmark} size="icon">
                            <Bookmark className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        {loading ? (
                            <p>Загрузка закладок...</p>
                        ) : bookmarks.length > 0 ? (
                            bookmarks.map((bookmark) => (
                                <div
                                    key={bookmark.id}
                                    className="p-2 bg-gray-100  rounded-md text-sm flex justify-between items-center"
                                >
                                    <div className="flex items-center">
                                        <Bookmark className="h-4 w-4 mr-2" />
                                        <span>{bookmark.title}</span>
                                    </div>
                                    <DeleteConfirmationDialog
                                        onDelete={() =>
                                            handleDeleteBookmark(bookmark.id)
                                        }
                                        itemName="закладку"
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                У вас пока нет закладок к этому уроку.
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
