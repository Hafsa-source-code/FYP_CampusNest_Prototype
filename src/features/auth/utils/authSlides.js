// Photos + captions for the right side of the login / sign-up pages.

const photo = (id) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`

export const LOGIN_SLIDES = [
  {
    img: photo('photo-1523240795612-9a054b0db644'),
    title: 'Find your place near campus',
    text: 'Verified hostels around Punjab University.',
  },
  {
    img: photo('photo-1522771739844-6a9f6d5f14af'),
    title: 'Rooms you can trust',
    text: 'Every listing is checked by phone before it goes live.',
  },
  {
    img: photo('photo-1529156069898-49953e39b3ac'),
    title: 'Live with people you click with',
    text: 'See your roommate match before you move in.',
  },
]

export const STUDENT_SLIDES = [
  {
    img: photo('photo-1529156069898-49953e39b3ac'),
    title: 'Your next home, minus the guesswork',
    text: 'Compare rent, distance and real reviews in one place.',
  },
  {
    img: photo('photo-1523240795612-9a054b0db644'),
    title: 'Reviews from real residents',
    text: 'Only students who moved in can leave a review.',
  },
  {
    img: photo('photo-1522771739844-6a9f6d5f14af'),
    title: 'No brokers. No hidden fees.',
    text: 'Talk to hostel owners directly, inside CampusNest.',
  },
]

export const OWNER_SLIDES = [
  {
    img: photo('photo-1541339907198-e08756dedf3f'),
    title: 'Fill your rooms before term starts',
    text: 'Reach students searching near your hostel.',
  },
  {
    img: photo('photo-1513694203232-719a280e022f'),
    title: 'One inbox for every inquiry',
    text: 'No more midnight phone calls.',
  },
  {
    img: photo('photo-1517486808906-6ca8b3f04846'),
    title: 'Know your occupancy at a glance',
    text: 'Track every room and seat from your dashboard.',
  },
]
