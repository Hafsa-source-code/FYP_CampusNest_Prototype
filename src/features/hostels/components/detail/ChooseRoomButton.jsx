import { Button } from '@/components/ui'

/** "Choose a room" (jumps to the Rooms section), or a disabled "Fully booked". */
export function ChooseRoomButton({ freeSeats, onClick, ...rest }) {
  return (
    <Button disabled={freeSeats === 0} onClick={onClick} {...rest}>
      {freeSeats > 0 ? 'Choose a room' : 'Fully booked'}
    </Button>
  )
}