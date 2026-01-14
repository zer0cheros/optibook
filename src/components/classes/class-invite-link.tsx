'use client'

import { useState } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Link2, Copy, RefreshCw, Trash2, CheckCircle } from 'lucide-react'

export function ClassInviteLink({
  classId,
  inviteToken,
  onUpdate,
}: {
  classId: string
  inviteToken: string | null
  onUpdate: () => void
}) {
  const [generating, setGenerating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  const inviteUrl = inviteToken
    ? `${window.location.origin}/classes/join/${inviteToken}`
    : null

  const handleGenerateLink = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/classes/${classId}/invite`, {
        method: 'POST',
      })
      if (res.ok) {
        await onUpdate()
      }
    } catch (error) {
      console.error('Failed to generate invite link:', error)
    } finally {
      setGenerating(false)
    }
  }

  const handleDeleteLink = async () => {
    if (!confirm('Är du säker på att du vill ta bort inbjudningslänken?')) {
      return
    }
    setDeleting(true)
    try {
      const res = await fetch(`/api/classes/${classId}/invite`, {
        method: 'DELETE',
      })
      if (res.ok) {
        await onUpdate()
      }
    } catch (error) {
      console.error('Failed to delete invite link:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleCopyLink = async () => {
    if (inviteUrl) {
      try {
        await navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        console.error('Failed to copy link:', error)
      }
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-slate-700" />
          <h3 className="text-lg font-semibold">Inbjudningslänk</h3>
        </div>

        {inviteToken ? (
          <>
            <p className="text-sm text-slate-600">
              Dela denna länk med elever så kan de gå med i klassen direkt utan
              att vänta på godkännande.
            </p>
            <div className="flex gap-2">
              <Input
                value={inviteUrl || ''}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                title="Kopiera länk"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleGenerateLink}
                disabled={generating}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Generera ny länk
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteLink}
                disabled={deleting}
                className="gap-2 text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Ta bort länk
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              Skapa en inbjudningslänk som elever kan använda för att gå med i
              klassen direkt utan att behöva godkännas.
            </p>
            <Button
              onClick={handleGenerateLink}
              disabled={generating}
              className="gap-2 w-fit"
            >
              <Link2 className="w-4 h-4" />
              {generating ? 'Genererar...' : 'Generera inbjudningslänk'}
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
