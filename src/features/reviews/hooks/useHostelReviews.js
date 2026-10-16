import { useMemo } from 'react'
import { useStore } from '@/store'
import { MIN_REVIEWS_FOR_SUMMARY } from '../constants'

// TEMPORARY demo text. Later the backend sends each hostel's AI summary (made with OpenAI).
const DEMO_SUMMARY =
  'Residents consistently praise the cleanliness, the responsive warden and reliable backup power. Most reach campus in under 20 minutes. The recurring complaint is low water pressure during the morning rush.'

/**
 * One hostel's reviews, the total count, and the AI summary
 * (summary is null until the hostel has enough reviews).
 * TEMPORARY: reads the demo store.
 */
export function useHostelReviews(hostelId) {
  const { reviews, hostel } = useStore()

  return useMemo(() => {
    const list = reviews.filter((review) => review.hostelId === hostelId)
    const total = hostel(hostelId)?.reviewCount ?? list.length

    return {
      reviews: list,
      total,
      summary: total >= MIN_REVIEWS_FOR_SUMMARY ? DEMO_SUMMARY : null,
    }
  }, [reviews, hostel, hostelId])
}