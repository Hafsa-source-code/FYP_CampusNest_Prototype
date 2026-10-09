import { AuthLayout } from '@/layouts/AuthLayout'
import { LOGIN_SLIDES } from '@/features/auth/authSlides'
import { BackToLoginLink } from '@/features/auth/components/BackToLoginLink'
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'

export function ForgotPasswordPage() {
  return (
    <AuthLayout slides={LOGIN_SLIDES}>
      <ForgotPasswordForm />
      <BackToLoginLink />
    </AuthLayout>
  )
}
