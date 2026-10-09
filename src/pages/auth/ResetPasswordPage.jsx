import { AuthLayout } from '@/layouts/AuthLayout'
import { LOGIN_SLIDES } from '@/features/auth/authSlides'
import { BackToLoginLink } from '@/features/auth/components/BackToLoginLink'
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm'

export function ResetPasswordPage() {
  return (
    <AuthLayout slides={LOGIN_SLIDES}>
      <ResetPasswordForm />
      <BackToLoginLink />
    </AuthLayout>
  )
}
