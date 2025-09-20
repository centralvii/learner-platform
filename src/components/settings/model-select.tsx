
'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface Model {
  model_id: string;
  name: string;
  description: string;
  status: string;
}

export function ModelSelect() {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем сохраненную модель при монтировании
    const savedModel = localStorage.getItem('ai_model');
    if (savedModel) {
      setSelectedModel(savedModel);
    }

    // Загружаем список моделей
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        setModels(data);
        setLoading(false);
        // Если модель не была сохранена, устанавливаем первую из списка по умолчанию
        if (!savedModel && data.length > 0) {
          const defaultModel = 'mistralai/Mistral-Nemo-Instruct-2407'; // Предпочтительная модель по умолчанию
          const modelExists = data.some((m: Model) => m.name === defaultModel);
          const finalDefault = modelExists ? defaultModel : data[0].name;
          setSelectedModel(finalDefault);
          localStorage.setItem('ai_model', finalDefault);
        }
      })
      .catch(err => {
        console.error('Failed to fetch models:', err);
        setLoading(false);
      });
  }, []);

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    localStorage.setItem('ai_model', value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="ai-model-select">Модель нейросети</Label>
      <Select
        value={selectedModel || ''}
        onValueChange={handleModelChange}
        disabled={loading}
      >
        <SelectTrigger id="ai-model-select" className="w-[450px]">
          <SelectValue placeholder={loading ? "Загрузка моделей..." : "Выберите модель"} />
        </SelectTrigger>
        <SelectContent>
          {models.map(model => (
            <SelectItem key={model.model_id} value={model.name}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        Эта модель будет использоваться для ответов в чате.
      </p>
    </div>
  );
}
