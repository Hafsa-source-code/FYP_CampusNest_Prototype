import { useCampus } from '../../hooks/useCampus'
import { LocationMap } from './LocationMap'
import { TravelTimes } from './TravelTimes'

/** Map + travel times to the campus the student picked. */
export function HostelLocation({ hostel }) {
  const { campus } = useCampus()

  return (
    <>
      <LocationMap hostelName={hostel.name} campus={campus} />
      <TravelTimes distance={hostel.distance} />
    </>
  )
}