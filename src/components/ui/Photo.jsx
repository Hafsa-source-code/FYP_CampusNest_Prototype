import { useState } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from './Icon'

/**
 * Image with a fixed shape (ratio) that never jumps while loading.
 * If the image is missing or fails to load, a grey box with an icon shows instead.
 * children: anything placed on top of the photo (badges, buttons)
 */
export function Photo({ src, alt, ratio = '4/3', rounded = true, className, children }) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  return (
    <div
      className={cn('relative overflow-hidden bg-sunken', rounded && 'rounded-lg', className)}
      style={{ aspectRatio: ratio }}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-subtle">
          <Icon name="image" size={24} />
        </div>
      )}
      {children}
    </div>
  )
}
