import { formatPrice } from '@/utils/formatters'
import { ChooseRoomButton } from './ChooseRoomButton'

/** Bar fixed to the bottom of the screen on phones and tablets: price + "Choose a room". */
export function MobilePriceBar({ hostel, onChooseRoom }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
      <div>
        <p className="text-caption text-muted">From</p>
        <p className="tabular text-lead font-bold text-brand-700">
          {formatPrice(hostel.startingPrice)}
          <span className="text-caption font-normal text-muted"> /seat</span>
        </p>
      </div>
      <ChooseRoomButton freeSeats={hostel.freeSeats} onClick={onChooseRoom} />
    </div>
  )
}