'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle } from 'lucide-react'

interface Lesson {
    id: string;
    title: string;
    completed: boolean;
    content: string | null;
    videoUrl: string | null;
    order: number;
}

interface AddLessonDialogProps {
  chapterId: string;
  onLessonAdded: (newLesson: Lesson, chapterId: string) => void;
}

export function AddLessonDialog({ chapterId, onLessonAdded }: AddLessonDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/chapters/${chapterId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })

      if (response.ok) {
        const newLesson = await response.json();
        onLessonAdded(newLesson, chapterId)
        setOpen(false)
        setTitle('')
      } else {
        console.error('Failed to create lesson')
      }
    } catch (error) {
      console.error('Error creating lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Урок</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить новый урок</DialogTitle>
          <DialogDescription>
            Введите название нового урока.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Название
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Добавление...' : 'Добавить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
