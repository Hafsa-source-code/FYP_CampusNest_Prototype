import { useNavigate } from 'react-router-dom'
import { useCampus } from '../../hooks/useCampus'
import { roomLink } from '../../utils/hostelLinks'
import { RoomTypeCard } from './RoomTypeCard'

/** All room types of a hostel. "Choose a room" opens that room type's page. */
export function RoomTypeList({ hostelId, roomTypes }) {
  const navigate = useNavigate()
  const { campus } = useCampus()

  return (
    <div className="space-y-4">
      {roomTypes.map((roomType) => (
        <RoomTypeCard
          key={roomType.id}
          roomType={roomType}
          onChoose={() => navigate(roomLink(hostelId, roomType.id, campus))}
        />
      ))}
    </div>
  )
}