'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { Textarea } from '@/components/ui/textarea'
import { Edit, Trash2 } from 'lucide-react'
import { DeleteConfirmationDialog } from './delete-confirmation-dialog'

interface Course {
    id: string;
    title: string;
    description: string;
    tags: string[];
}

interface EditCourseDialogProps {
  course: Course;
  onCourseUpdated: (updatedCourse: Course) => void;
}

export function EditCourseDialog({ course, onCourseUpdated }: EditCourseDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(course.title)
  const [description, setDescription] = useState(course.description)
  const [tags, setTags] = useState(course.tags.join(', '))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setTitle(course.title)
    setDescription(course.description)
    setTags(course.tags.join(', '))
  }, [course])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/courses/${course.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          }),
        }
      )

      if (response.ok) {
        const updatedCourse = await response.json();
        onCourseUpdated(updatedCourse)
        setOpen(false)
      } else {
        console.error('Failed to update course')
      }
    } catch (error) {
      console.error('Error updating course:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    await fetch(`/api/courses/${course.id}`, { method: 'DELETE' })
    router.push('/courses')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Edit className="mr-2 h-4 w-4" /> Редактировать курс</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать курс</DialogTitle>
          <DialogDescription>
            Обновите информацию о курсе.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Название
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Описание
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Теги
            </Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="col-span-3" placeholder="Через запятую" />
          </div>
        </div>
        <DialogFooter className="justify-between">
          <DeleteConfirmationDialog onDelete={handleDelete} itemName={`курс "${course.title}"`} />
          <Button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
