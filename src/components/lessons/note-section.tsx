'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteConfirmationDialog } from '@/components/courses/delete-confirmation-dialog';

interface Note {
    id: string;
    content: string;
    createdAt: string;
}

interface NoteSectionProps {
    lessonId: string;
}

export function NoteSection({ lessonId }: NoteSectionProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchNotes = () => {
        setLoading(true);
        fetch(`/api/lessons/${lessonId}/notes`)
            .then((res) => res.json())
            .then((data) => {
                setNotes(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching notes:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchNotes();
    }, [lessonId]);

    const handleDeleteNote = async (noteId: string) => {
        await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
        fetchNotes();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Заметки к уроку</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {loading ? (
                        <p>Загрузка заметок...</p>
                    ) : notes.length > 0 ? (
                        notes.map((note) => (
                            <div
                                key={note.id}
                                className="p-2 bg-gray-100  rounded-md text-sm flex justify-between items-start"
                            >
                                <div>
                                    <p>{note.content}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(
                                            note.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <DeleteConfirmationDialog
                                    onDelete={() => handleDeleteNote(note.id)}
                                    itemName="заметку"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            У вас пока нет заметок к этому уроку.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
