'use client'

import { useState, useEffect } from 'react'
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
import { Edit } from 'lucide-react'

interface Chapter {
    id: string;
    title: string;
}

interface EditChapterDialogProps {
  chapter: Chapter;
  onChapterUpdated: (updatedChapter: Chapter) => void;
}

export function EditChapterDialog({ chapter, onChapterUpdated }: EditChapterDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(chapter.title)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTitle(chapter.title)
  }, [chapter])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/chapters/${chapter.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title }),
        }
      )

      if (response.ok) {
        const updatedChapter = await response.json();
        onChapterUpdated(updatedChapter)
        setOpen(false)
      } else {
        console.error('Failed to update chapter')
      }
    } catch (error) {
      console.error('Error updating chapter:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать главу</DialogTitle>
          <DialogDescription>
            Обновите название главы.
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
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
