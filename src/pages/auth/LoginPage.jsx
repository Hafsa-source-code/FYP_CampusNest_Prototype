import { AuthLayout } from '@/layouts/AuthLayout'
import { LOGIN_SLIDES } from '@/features/auth/authSlides'
import { AuthTitle } from '@/features/auth/components/AuthTitle'
import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
  return (
    <AuthLayout slides={LOGIN_SLIDES}>
      <AuthTitle
        title={
          <>
            Welcome <span className="text-brand-700">back</span>
          </>
        }
      >
        Log in to see your saved hostels and messages.
      </AuthTitle>
      <LoginForm />
    </AuthLayout>
  )
}
