import { Modal, Photo } from '@/components/ui'

/** Pop-up showing every photo of the hostel. */
export function PhotosModal({ open, onClose, hostelName, photos }) {
  return (
    <Modal open={open} onClose={onClose} title={`${hostelName} — photos`} size="lg">
      <div className="grid grid-cols-2 gap-2 pb-4">
        {photos.map((src, index) => (
          <Photo
            key={src + index}
            src={src}
            alt={`${hostelName} photo ${index + 1}`}
            ratio="3/2"
            className={index === 0 ? 'col-span-2' : undefined}
          />
        ))}
      </div>
    </Modal>
  )
}