'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface AddBookmarkDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    initialTitle: string;
    onSave: (title: string) => void;
}

export function AddBookmarkDialog({ isOpen, onOpenChange, initialTitle, onSave }: AddBookmarkDialogProps) {
    const [title, setTitle] = useState(initialTitle);

    useEffect(() => {
        setTitle(initialTitle);
    }, [initialTitle]);

    const handleSave = () => {
        onSave(title);
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавить новую закладку</DialogTitle>
                </DialogHeader>
                <Input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <DialogFooter>
                    <Button onClick={handleSave}>Сохранить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
