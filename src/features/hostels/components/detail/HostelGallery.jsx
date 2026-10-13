import { useState } from 'react'
import { Icon, Modal, Photo } from '@/components/ui'
import { cn } from '@/utils/cn'

const PREVIEW_COUNT = 5

/** Big photo + 4 small ones (only the big one on phones). Any photo opens all photos in a pop-up. */
export function HostelGallery({ hostelName, photos }) {
  const [showAll, setShowAll] = useState(false)
  const onlyOne = photos.length === 1
  const photoAlt = (index) => `${hostelName} photo ${index + 1}`

  return (
    <div className="relative mt-6">
      <div className="grid h-[260px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl sm:h-[440px]">
        {photos.slice(0, PREVIEW_COUNT).map((src, index) => (
          <button
            key={src + index}
            type="button"
            onClick={() => setShowAll(true)}
            aria-label={`Open photo ${index + 1}`}
            className={cn(
              index === 0 && 'col-span-4 row-span-2',
              index === 0 && !onlyOne && 'sm:col-span-2',
              index > 0 && 'hidden sm:block',
            )}
          >
            <Photo
              src={src}
              alt={photoAlt(index)}
              ratio="auto"
              rounded={false}
              className="h-full transition-opacity hover:opacity-90"
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowAll(true)}
        className="absolute bottom-4 right-4 inline-flex h-9 items-center gap-2 rounded-full bg-white/95 px-4 text-small font-semibold text-ink shadow-pop hover:bg-white"
      >
        <Icon name="grid" size={15} />
        Show all {photos.length} photos
      </button>

      <Modal
        open={showAll}
        onClose={() => setShowAll(false)}
        title={`${hostelName} — photos`}
        size="lg"
      >
        <div className="grid grid-cols-2 gap-2 pb-4">
          {photos.map((src, index) => (
            <Photo
              key={src + index}
              src={src}
              alt={photoAlt(index)}
              ratio="3/2"
              className={index === 0 ? 'col-span-2' : undefined}
            />
          ))}
        </div>
      </Modal>
    </div>
  )
}