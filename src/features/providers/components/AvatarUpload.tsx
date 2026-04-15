import { useState } from 'react'

import { Input } from '@components/ui/Input'
import { cn } from '@utils/cn'

interface AvatarUploadProps {
  currentUrl?: string
  initials?: string
  onUrlChange: (url: string) => void
}

function isValidUrl(value: string): boolean {
  return value.startsWith('http://') || value.startsWith('https://')
}

export function AvatarUpload({ currentUrl, initials = '?', onUrlChange }: AvatarUploadProps) {
  const [inputValue, setInputValue] = useState(currentUrl ?? '')
  const [error, setError] = useState<string | undefined>(undefined)

  const previewUrl = isValidUrl(inputValue) ? inputValue : undefined

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value === '') {
      setError(undefined)
      onUrlChange('')
      return
    }

    if (!isValidUrl(value)) {
      setError('A URL deve começar com http:// ou https://')
      return
    }

    setError(undefined)
    onUrlChange(value)
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">Foto / Logo</label>

      <div className="flex items-center gap-4">
        {/* Preview circular */}
        <div
          className={cn(
            'h-16 w-16 rounded-full flex-shrink-0 border-2 overflow-hidden',
            previewUrl ? 'border-primary-200' : 'border-gray-200 bg-primary-100',
          )}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview da foto"
              className="h-full w-full object-cover"
              onError={() => { setError('Não foi possível carregar a imagem desta URL') }}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-primary-700 text-xl font-bold">
              {initials.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1">
          <Input
            label=""
            type="url"
            placeholder="https://exemplo.com/sua-foto.jpg"
            value={inputValue}
            onChange={handleChange}
            error={error}
          />
          <p className="mt-1 text-xs text-gray-400">
            Cole o link da sua foto/logo. O upload direto será disponibilizado em breve.
          </p>
        </div>
      </div>
    </div>
  )
}
