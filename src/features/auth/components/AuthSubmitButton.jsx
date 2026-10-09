import { Button } from '@/components/ui'

/** The main button under every auth form: same size, centred. Disabled while waiting. */
export function AuthSubmitButton({ busy = false, busyLabel = 'Please wait…', children }) {
  return (
    <div className="flex justify-center">
      <Button type="submit" disabled={busy} className="min-w-[180px]">
        {busy ? busyLabel : children}
      </Button>
    </div>
  )
}
