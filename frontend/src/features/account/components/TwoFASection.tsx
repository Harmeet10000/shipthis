import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function TwoFASection() {
  const [enabled, setEnabled] = useState(false)
  const [code, setCode] = useState('')

  const handleEnable = async () => {
    // TODO: Call backend to generate secret and QR
    setEnabled(true)
  }

  const handleDisable = async () => {
    // TODO: Call backend to disable 2FA
    setEnabled(false)
  }

  const handleVerify = async () => {
    // TODO: Verify with backend TOTP
    alert('Verification code submitted. Wire to /auth/2fa/verify')
  }

  return (
    <div className="space-y-4">
      {!enabled ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Protect your account with an authenticator app.</p>
          <Button onClick={handleEnable}>Enable 2FA</Button>
        </div>
      ) : (
        <div className="space-y-3">
          <Alert>
            <AlertDescription>
              Scan the QR code with your authenticator app and enter the 6-digit code.
            </AlertDescription>
          </Alert>
          <div className="h-32 w-32 rounded bg-muted" aria-label="QR code placeholder" />
          <div className="flex gap-2 max-w-xs">
            <Input placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} />
            <Button onClick={handleVerify}>Verify</Button>
          </div>
          <Button variant="outline" onClick={handleDisable}>Disable 2FA</Button>
        </div>
      )}
    </div>
  )
}
