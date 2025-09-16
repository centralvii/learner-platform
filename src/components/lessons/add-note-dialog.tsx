'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

interface AddNoteDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    initialContent: string;
    onSave: (content: string) => void;
}

export function AddNoteDialog({ isOpen, onOpenChange, initialContent, onSave }: AddNoteDialogProps) {
    const [content, setContent] = useState(initialContent);

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleSave = () => {
        onSave(content);
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить новую заметку</DialogTitle>
                </DialogHeader>
                <Textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    rows={10}
                />
                <DialogFooter>
                    <Button onClick={handleSave}>Сохранить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
