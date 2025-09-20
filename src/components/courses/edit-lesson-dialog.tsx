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
import { Textarea } from '@/components/ui/textarea'
import { Edit } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

interface Lesson {
    id: string;
    title: string;
    content: string | null;
    videoUrl: string | null;
}

interface EditLessonDialogProps {
  lesson: Lesson;
  onLessonUpdated: (updatedLesson: Lesson) => void;
}

export function EditLessonDialog({ lesson, onLessonUpdated }: EditLessonDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(lesson.title)
  const [content, setContent] = useState(lesson.content || '')
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl || '')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    setTitle(lesson.title)
    setContent(lesson.content || '')
    setVideoUrl(lesson.videoUrl || '')
  }, [lesson])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/upload', true)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100
        setUploadProgress(percentComplete)
      }
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText)
        setVideoUrl(response.url)
      } else {
        console.error('Upload failed')
      }
      setUploadProgress(0)
    }

    xhr.send(formData)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, videoUrl }),
      })

      if (response.ok) {
        const updatedLesson = await response.json();
        onLessonUpdated(updatedLesson)
        setOpen(false)
      } else {
        console.error('Failed to update lesson')
      }
    } catch (error) {
      console.error('Error updating lesson:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Редактировать урок</DialogTitle>
          <DialogDescription>
            Обновите информацию об уроке.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Название
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right mt-2">
              Контент
            </Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3" rows={10} placeholder="Поддерживается Markdown" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="videoUrl" className="text-right">
              URL видео
            </Label>
            <Input id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="videoFile" className="text-right">
              Видео-файл
            </Label>
            <Input id="videoFile" type="file" onChange={handleFileChange} className="col-span-3" />
          </div>
          {uploadProgress > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3">
                    <Progress value={uploadProgress} />
                </div>
            </div>
          )}
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
