// TEMPORARY: rough travel times worked out from the straight-line distance.
// Replaced by real Google Maps times (from the backend) in the Maps step.

/** distanceKm → [{ icon, mode, time, note }] for walking, public transport and car. */
export function estimateTravel(distanceKm) {
  const walkMinutes = Math.round(distanceKm * 12.5)

  return [
    { icon: 'walk', mode: 'Walk', time: `${walkMinutes} min`, note: `${distanceKm} km` },
    {
      icon: 'bus',
      mode: 'Metro / van',
      time: `${Math.max(6, Math.round(walkMinutes / 2))} min`,
      note: 'incl. 4 min walk to stop',
    },
    {
      icon: 'car',
      mode: 'Rickshaw / car',
      time: `${Math.max(3, Math.round(distanceKm * 4))} min`,
      note: 'at 8 am traffic',
    },
  ]
}