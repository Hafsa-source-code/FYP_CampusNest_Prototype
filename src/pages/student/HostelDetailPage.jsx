// What this file does:
// The hostel page (/student/hostel/:id). It only puts the pieces together:
// header and photos on top, then tabbed sections (Overview, Rooms, Location, Reviews)
// on the left and the price card on the right (a bottom bar on phones).

import { useParams } from 'react-router-dom'
import { Container } from '@/components/ui'
import { DETAIL_SECTIONS } from '@/features/hostels/constants'
import { useHostelDetail } from '@/features/hostels/hooks/useHostelDetail'
import { DetailSection } from '@/features/hostels/components/detail/DetailSection'
import { HostelGallery } from '@/features/hostels/components/detail/HostelGallery'
import { HostelHeader } from '@/features/hostels/components/detail/HostelHeader'
import { HostelLocation } from '@/features/hostels/components/detail/HostelLocation'
import { HostelNotFound } from '@/features/hostels/components/HostelNotFound'
import { HostelOverview } from '@/features/hostels/components/detail/HostelOverview'
import { HostelRating } from '@/features/hostels/components/HostelRating'
import { MobilePriceBar } from '@/features/hostels/components/detail/MobilePriceBar'
import { PriceCard } from '@/features/hostels/components/detail/PriceCard'
import { RoomTypeList } from '@/features/hostels/components/detail/RoomTypeList'
import { SectionNote } from '@/features/hostels/components/detail/SectionNote'
import { SectionTabs } from '@/features/hostels/components/detail/SectionTabs'
import { HostelReviews } from '@/features/reviews/components/HostelReviews'
import { scrollToSection } from '@/utils/scrollToSection'

const { overview, rooms, location, reviews } = DETAIL_SECTIONS
const TABS = Object.values(DETAIL_SECTIONS)

export function HostelDetailPage() {
  const { id } = useParams()
  const hostel = useHostelDetail(Number(id))

  if (!hostel) return <HostelNotFound />

  const roomTypeCount = hostel.roomTypes.length
  const goToRooms = () => scrollToSection(rooms.id)

  return (
    <>
      <Container className="pt-6">
        <HostelHeader hostel={hostel} />
        <HostelGallery hostelName={hostel.name} photos={hostel.gallery} />
      </Container>

      <Container className="mt-8 pb-24 lg:pb-0">
        <SectionTabs tabs={TABS} />

        <div className="lg:grid lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <DetailSection id={overview.id} title="About this hostel">
              <HostelOverview hostel={hostel} />
            </DetailSection>

            <DetailSection
              id={rooms.id}
              title="Rooms"
              aside={
                <SectionNote>
                  {roomTypeCount} room {roomTypeCount === 1 ? 'type' : 'types'}
                </SectionNote>
              }
            >
              <RoomTypeList hostelId={hostel.id} roomTypes={hostel.roomTypes} />
            </DetailSection>

            <DetailSection
              id={location.id}
              title="Location"
              aside={<SectionNote icon="mapPin">{hostel.area}, Lahore</SectionNote>}
            >
              <HostelLocation hostel={hostel} />
            </DetailSection>

            <DetailSection
              id={reviews.id}
              title="Reviews"
              aside={
                hostel.reviewCount > 0 && (
                  <HostelRating rating={hostel.rating} reviewCount={hostel.reviewCount} />
                )
              }
            >
              <HostelReviews hostelId={hostel.id} hostelName={hostel.name} />
            </DetailSection>
          </div>

          <aside className="hidden pt-10 lg:col-span-4 lg:block">
            <div className="sticky top-36">
              <PriceCard hostel={hostel} onChooseRoom={goToRooms} />
            </div>
          </aside>
        </div>
      </Container>

      <MobilePriceBar hostel={hostel} onChooseRoom={goToRooms} />
    </>
  )
}