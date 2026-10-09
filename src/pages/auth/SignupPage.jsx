import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { OWNER_SLIDES, STUDENT_SLIDES } from '@/features/auth/authSlides'
import { AuthTitle } from '@/features/auth/components/AuthTitle'
import { SignupForm } from '@/features/auth/components/SignupForm'
import { ROLES } from '@/utils/constants'

/** Sign-up. Opening /signup?role=owner starts on the hostel-owner option. */
export function SignupPage() {
  const [query] = useSearchParams()
  const [role, setRole] = useState(query.get('role') === 'owner' ? ROLES.OWNER : ROLES.STUDENT)
  const isStudent = role === ROLES.STUDENT

  return (
    <AuthLayout slides={isStudent ? STUDENT_SLIDES : OWNER_SLIDES}>
      <AuthTitle
        title={
          <>
            Create your <span className="text-brand-700">account</span>
          </>
        }
      >
        {isStudent
          ? 'Use your university email to get a verified badge.'
          : 'List your hostel free and reach verified students.'}
      </AuthTitle>
      <SignupForm role={role} onRoleChange={setRole} />
    </AuthLayout>
  )
}
