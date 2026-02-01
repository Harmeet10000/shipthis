import { useState, useRef } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Button } from '@/components/ui/button'

export function AvatarUploader() {
  const [image, setImage] = useState<File | null>(null)
  const [scale, setScale] = useState(1.2)
  const editorRef = useRef<AvatarEditor | null>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImage(file)
  }

  const handleSave = async () => {
    if (!editorRef.current) return
    const canvas = editorRef.current.getImageScaledToCanvas()
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
    if (!blob) return

    // TODO: Upload to your backend or S3 using a signed URL
    // const formData = new FormData()
    // formData.append('file', new File([blob], 'avatar.png', { type: 'image/png' }))
    // await apiClient.post('/users/me/avatar', formData)
    alert('Avatar processed. Wire this to your upload endpoint.')
  }

  return (
    <div className="flex flex-col gap-4">
      <input type="file" accept="image/*" onChange={onFileChange} />
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-md border p-3 bg-muted/20">
          <AvatarEditor
            ref={editorRef}
            image={image || ''}
            width={200}
            height={200}
            border={20}
            borderRadius={100}
            scale={scale}
            className="rounded-full"
          />
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={scale}
          onChange={(e) => setScale(parseFloat(e.target.value))}
        />
        <div className="flex gap-2">
          <Button variant="outline" type="button" onClick={() => setImage(null)}>
            Remove
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Avatar
          </Button>
        </div>
      </div>
    </div>
  )
}
