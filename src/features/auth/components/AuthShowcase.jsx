import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Logo } from '@/components/ui'
import { PATHS } from '@/routes/paths'

const SLIDE_EVERY_MS = 6000

/** The photo panel on auth pages: rotating photos + captions + dots. Pauses on hover. */
export function AuthShowcase({ slides }) {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    // Respect people who turned off animations in their device settings
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (paused || reduceMotion) return

    const timer = setInterval(
      () => setCurrent((index) => (index + 1) % slides.length),
      SLIDE_EVERY_MS,
    )
    return () => clearInterval(timer)
  }, [paused, slides.length])

  const slide = slides[current]

  return (
    <div
      className="relative hidden min-h-0 overflow-hidden rounded-[20px] bg-charcoal lg:block"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((item, index) => (
        <img
          key={item.img}
          src={item.img}
          alt=""
          onError={(event) => (event.currentTarget.style.display = 'none')}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            index === current ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#022433] via-[#022433]/30 to-[#022433]/35" />

      <div className="absolute left-0 top-0 p-6">
        <Logo inverse onClick={() => navigate(PATHS.home)} />
      </div>

      <div className="absolute inset-x-0 bottom-0 px-10 pb-8 text-center text-white">
        <p className="text-heading font-semibold leading-tight tracking-tight">{slide.title}</p>
        <p className="mt-2 text-body-lg leading-relaxed text-white/80">{slide.text}</p>

        <div className="mt-5 flex justify-center gap-1">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              aria-current={index === current}
              onClick={() => setCurrent(index)}
              className="group px-1 py-2.5 focus-visible:outline-none"
            >
              <span
                className={cn(
                  'block h-1 rounded-full transition-all group-focus-visible:ring-2 group-focus-visible:ring-white',
                  index === current ? 'w-8 bg-white' : 'w-5 bg-white/40 group-hover:bg-white/70',
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
