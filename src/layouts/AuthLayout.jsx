import { useNavigate } from 'react-router-dom'
import { Icon, Logo } from '@/components/ui'
import { AuthShowcase } from '@/features/auth/components/AuthShowcase'
import { PATHS } from '@/routes/paths'

/**
 * Frame for login / sign-up / password pages: one rounded card,
 * form on the LEFT, photo panel on the RIGHT (photo hidden on phones).
 * slides: which photos + captions to show on the right
 */
export function AuthLayout({ slides, children }) {
  const navigate = useNavigate()
  const goHome = () => navigate(PATHS.home)

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas sm:p-4 lg:h-screen lg:overflow-hidden lg:p-6">
      <div className="grid w-full max-w-[1120px] bg-surface p-3 shadow-pop sm:rounded-[28px] sm:border sm:border-line lg:h-full lg:max-h-[760px] lg:grid-cols-[1.05fr_1fr]">
        {/* LEFT: form */}
        <div className="flex flex-col px-5 py-5 sm:px-10 lg:min-h-0 lg:overflow-y-auto lg:px-14 lg:py-4">
          <div className="mx-auto flex w-full max-w-[420px] items-center justify-between">
            <button
              type="button"
              onClick={goHome}
              className="group -ml-3 inline-flex h-9 items-center gap-2 rounded-full px-3 text-body font-medium text-ink-2 transition-colors hover:bg-sunken hover:text-ink"
            >
              <Icon
                name="arrowLeft"
                className="transition-transform group-hover:-translate-x-0.5"
              />
              Back to website
            </button>
            {/* On desktop the logo sits on the photo instead */}
            <span className="lg:hidden">
              <Logo onClick={goHome} />
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center py-3">
            <div className="w-full max-w-[420px]">{children}</div>
          </div>
        </div>

        {/* RIGHT: photo. key = restart the slider when the photo set changes */}
        <AuthShowcase key={slides[0].img} slides={slides} />
      </div>
    </div>
  )
}
