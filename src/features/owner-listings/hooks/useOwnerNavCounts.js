import { useAuth } from '@/hooks/useAuth'
import { useStore } from '@/store'

/**
 * Numbers shown beside the owner's menu items:
 * pending inquiries and reviews without a reply, across all their hostels.
 * TEMPORARY: reads the demo store.
 */
export function useOwnerNavCounts() {
  const { user } = useAuth()
  const { hostels, inquiries, reviews } = useStore()

  const myHostelIds = hostels
    .filter((hostel) => hostel.ownerId === user?.id)
    .map((hostel) => hostel.id)
  const isMine = (item) => myHostelIds.includes(item.hostelId)

  return {
    inquiries: inquiries.filter((inquiry) => isMine(inquiry) && inquiry.status === 'Pending')
      .length,
    reviews: reviews.filter((review) => isMine(review) && !review.reply).length,
  }
}
