import { createContext, useContext, useMemo, useState } from 'react'
import { HOSTEL_PHOTOS, ROOM_PHOTOS, IMG } from './lib'
//  Seed data (kept internally consistent: prices, seats and ratings agree everywhere)
const today = () =>
  new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
const seedUsers = [
  {
    id: 1,
    name: 'Areesha Khan',
    email: 'areesha@pu.edu.pk',
    role: 'Student',
    joined: '10 Jan 2025',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Tariq Mahmood',
    email: 'tariq@greencourt.pk',
    role: 'Hostel Owner',
    joined: '3 Feb 2025',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Rida Malik',
    email: 'rida.m@pu.edu.pk',
    role: 'Student',
    joined: '22 Feb 2025',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Bilal Ahmed',
    email: 'bilal.a@pu.edu.pk',
    role: 'Student',
    joined: '5 Mar 2025',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Fatima Noor',
    email: 'fatima@saffronlodge.pk',
    role: 'Hostel Owner',
    joined: '14 Mar 2025',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Omar Siddiqui',
    email: 'omar.s@pu.edu.pk',
    role: 'Student',
    joined: '2 Apr 2025',
    status: 'Active',
  },
  {
    id: 7,
    name: 'Sana Tariq',
    email: 'sana.t@pu.edu.pk',
    role: 'Student',
    joined: '18 Apr 2025',
    status: 'Active',
  },
  {
    id: 8,
    name: 'Khalid Rehman',
    email: 'khalid.owner@gmail.com',
    role: 'Hostel Owner',
    joined: '1 May 2025',
    status: 'Banned',
    banReason: 'Listed a hostel with photos of a different property.',
  },
  {
    id: 9,
    name: 'Hamza Qureshi',
    email: 'hamza.q@pu.edu.pk',
    role: 'Student',
    joined: '9 May 2025',
    status: 'Banned',
    banReason: 'Repeatedly posted phone numbers in community posts.',
  },
  {
    id: 10,
    name: 'Admin Team',
    email: 'admin@campusnest.pk',
    role: 'Admin',
    joined: '1 Jan 2025',
    status: 'Active',
  },
]
const H = HOSTEL_PHOTOS
const seedHostels = [
  {
    id: 1,
    ownerId: 2,
    name: 'Green Court Hostel',
    area: 'Model Town',
    address: '7-B, Block B, Model Town, Lahore',
    gender: 'Female',
    status: 'Approved',
    rating: 4.8,
    reviewCount: 32,
    distance: 1.4,
    verifiedStays: 24,
    listedOn: 'Feb 2025',
    description:
      'A well-run female hostel in a quiet residential block of Model Town, 1.4 km from PU New Campus. Rooms are cleaned daily, the mess serves three meals, and a female warden lives on site. The generator covers every room, not just the common areas.',
    facilities: ['Wi-Fi', 'Mess', 'AC', 'Generator/UPS', 'Laundry', 'Security guard'],
    image: H[0],
    gallery: [H[0], H[6], H[1], H[7], H[5]],
  },
  {
    id: 2,
    ownerId: 5,
    name: 'Gulberg Heights',
    area: 'Gulberg III',
    address: '22 Main Boulevard, Gulberg III, Lahore',
    gender: 'Male',
    status: 'Approved',
    rating: 4.5,
    reviewCount: 19,
    distance: 2.1,
    verifiedStays: 11,
    listedOn: 'Mar 2025',
    description:
      'Modern single and twin AC rooms above a quiet commercial street. Popular with final-year and postgraduate students who want private space.',
    facilities: ['Wi-Fi', 'AC', 'Security guard', 'Parking'],
    image: H[1],
    gallery: [H[1], H[3], H[8], H[2], H[4]],
  },
  {
    id: 3,
    ownerId: 2,
    name: 'Al-Noor Residency',
    area: 'Faisal Town',
    address: 'House 14, Block C, Faisal Town, Lahore',
    gender: 'Female',
    status: 'Pending',
    rating: 0,
    reviewCount: 0,
    distance: 2.3,
    verifiedStays: 0,
    listedOn: 'Sep 2026',
    description: 'Newly renovated house converted into a small hostel for 12 students.',
    facilities: ['Wi-Fi', 'Mess', 'Laundry'],
    image: H[2],
    gallery: [H[2], H[3]],
  },
  {
    id: 4,
    ownerId: 5,
    name: 'Saffron Lodge',
    area: 'Johar Town',
    address: '118 R-1, Johar Town, Lahore',
    gender: 'Female',
    status: 'Approved',
    rating: 4.6,
    reviewCount: 41,
    distance: 1.9,
    verifiedStays: 41,
    listedOn: 'Jan 2025',
    description:
      'A large, established hostel with a dedicated study hall and a van service to PU New Campus every morning at 7:30 and 8:30.',
    facilities: ['Wi-Fi', 'AC', 'Mess', 'Generator/UPS', 'Security guard'],
    image: H[3],
    gallery: [H[3], H[0], H[7], H[5], H[8]],
  },
  {
    id: 5,
    ownerId: 5,
    name: 'Campus View Inn',
    area: 'Canal Road',
    address: '3 Canal Bank Road, Lahore',
    gender: 'Male',
    status: 'Approved',
    rating: 4.1,
    reviewCount: 14,
    distance: 0.6,
    verifiedStays: 9,
    listedOn: 'Apr 2025',
    description:
      'The closest option to campus — a seven-minute walk to the main gate. Simple rooms, reliable backup power.',
    facilities: ['Wi-Fi', 'Generator/UPS', 'Laundry'],
    image: H[4],
    gallery: [H[4], H[6], H[2], H[1], H[3]],
  },
  {
    id: 6,
    ownerId: 5,
    name: 'Punjab Palace Hostel',
    area: 'Township',
    address: 'Sector A-2, Township, Lahore',
    gender: 'Male',
    status: 'Approved',
    rating: 4.4,
    reviewCount: 27,
    distance: 2.8,
    verifiedStays: 27,
    listedOn: 'Feb 2025',
    description: 'Spacious rooms, a large mess hall and covered parking for bikes.',
    facilities: ['Wi-Fi', 'Mess', 'Security guard', 'Parking', 'AC'],
    image: H[5],
    gallery: [H[5], H[8], H[0], H[4], H[7]],
  },
  {
    id: 7,
    ownerId: 2,
    name: 'Sunrise Girls Annex',
    area: 'Garden Town',
    address: 'Plot 7, Garden Town, Lahore',
    gender: 'Female',
    status: 'Pending',
    rating: 0,
    reviewCount: 0,
    distance: 1.8,
    verifiedStays: 0,
    listedOn: 'Sep 2026',
    description: 'A second building for Green Court residents, opening this term.',
    facilities: ['Wi-Fi', 'Security guard'],
    image: H[7],
    gallery: [H[7]],
  },
  {
    id: 8,
    ownerId: 2,
    name: 'Old Campus Block',
    area: 'Gulberg III',
    address: '41-C Gulberg III, Lahore',
    gender: 'Male',
    status: 'Rejected',
    rating: 0,
    reviewCount: 0,
    distance: 2.4,
    verifiedStays: 0,
    listedOn: 'Aug 2026',
    description: 'Shared rooms near Old Campus.',
    facilities: ['Wi-Fi'],
    image: H[8],
    gallery: [H[8]],
    rejectReason:
      'Photos do not match the submitted address. Please upload current photos of the property.',
  },
  {
    id: 9,
    ownerId: 2,
    name: 'Canal View Lodge',
    area: 'Canal Road',
    address: '9 Canal View, Lahore',
    gender: 'Male',
    status: 'Deactivated',
    rating: 4.0,
    reviewCount: 6,
    distance: 1.1,
    verifiedStays: 6,
    listedOn: 'Mar 2025',
    description: 'Temporarily closed for renovation.',
    facilities: ['Wi-Fi', 'Parking'],
    image: H[6],
    gallery: [H[6]],
  },
]
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i))
const typeSeeds = [
  [1, '2-bed Standard', 'Twin', false, 13500, 2, range(101, 108), [1, 0, 1, 0, 0, 0, 0, 0]],
  [
    1,
    '3-bed AC Room',
    '3-bed',
    true,
    15500,
    3,
    range(201, 210),
    [1, 0, 2, 1, 0, 0, 0, 0, 0, 0],
  ],
  [1, '4-bed Economy', '4-bed+', false, 12000, 4, range(301, 306), [0, 0, 0, 0, 0, 0]],
  [2, 'Single AC Room', 'Single', true, 22000, 1, range(1, 6), [1, 0, 0, 0, 0, 0]],
  [2, '2-bed AC Room', 'Twin', true, 18000, 2, range(11, 18), [1, 0, 1, 0, 0, 0, 0, 0]],
  [
    4,
    '2-bed Standard',
    'Twin',
    false,
    16800,
    2,
    range(101, 110),
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [4, '3-bed AC Room', '3-bed', true, 17500, 3, range(201, 208), [0, 0, 0, 1, 0, 0, 0, 0]],
  [5, '3-bed Standard', '3-bed', false, 13500, 3, range(1, 8), [1, 0, 2, 0, 0, 1, 0, 0]],
  [6, '2-bed AC Room', 'Twin', true, 16000, 2, range(1, 10), [1, 0, 0, 1, 0, 0, 0, 0, 0, 0]],
  [6, '4-bed Standard', '4-bed+', false, 14200, 4, range(11, 16), [0, 2, 0, 1, 0, 0]],
  [3, '3-bed Standard', '3-bed', false, 12000, 3, range(1, 4), [3, 3, 3, 3]],
  [7, '2-bed Standard', 'Twin', false, 14500, 2, range(1, 6), [2, 2, 2, 2, 2, 2]],
  [8, '4-bed Standard', '4-bed+', false, 13000, 4, range(1, 2), [4, 4]],
  [9, '2-bed Standard', 'Twin', false, 14000, 2, range(1, 8), [2, 2, 2, 2, 2, 2, 2, 2]],
]
const seedRoomTypes = []
const seedRooms = []
typeSeeds.forEach(([hostelId, name, type, ac, price, seats, nums, free], ti) => {
  const typeId = ti + 1
  seedRoomTypes.push({
    id: typeId,
    hostelId,
    name,
    type,
    ac,
    price,
    seatsPerRoom: seats,
    photoUrls: ROOM_PHOTOS,
  })
  nums.forEach((n, ri) =>
    seedRooms.push({
      id: typeId * 100 + ri,
      hostelId,
      roomTypeId: typeId,
      number: n,
      totalSeats: seats,
      freeSeats: free[ri],
    }),
  )
})
// Residents: every occupied seat in every hostel has a resident (owner sees all; students see only public ones).
const NAMES = [
  'Ayesha',
  'Zara',
  'Hira',
  'Nida',
  'Sara',
  'Rida',
  'Fatima',
  'Madiha',
  'Iqra',
  'Bushra',
  'Maryam',
  'Laiba',
  'Amna',
  'Sana',
  'Kiran',
  'Mehak',
  'Fiza',
  'Zainab',
  'Noor',
  'Saima',
  'Asma',
  'Rabia',
  'Tayyaba',
  'Lubna',
  'Hafsa',
  'Aleena',
  'Minahil',
  'Emaan',
  'Hadia',
  'Areeba',
]
const MALE = [
  'Ali',
  'Hassan',
  'Usman',
  'Ahmed',
  'Saad',
  'Hamza',
  'Faizan',
  'Talha',
  'Zain',
  'Haris',
  'Danish',
  'Waleed',
  'Shayan',
  'Rayyan',
  'Abdullah',
  'Moiz',
  'Umer',
  'Fahad',
  'Arham',
  'Taimoor',
]
const REASONS = [
  'Same sleep schedule and similar cleanliness standards.',
  'Both prefer quiet study in the evenings.',
  'Compatible budgets; different visitor habits.',
  'Early risers who keep the room tidy.',
  'Similar course load and noise tolerance.',
]
const seedResidents = []
let rid = 1
seedRooms.forEach((room) => {
  const hostel = seedHostels.find((h) => h.id === room.hostelId)
  if (
    hostel.status === 'Pending' ||
    hostel.status === 'Rejected' ||
    hostel.status === 'Deactivated'
  )
    return
  const pool = hostel.gender === 'Female' ? NAMES : MALE
  for (let s = 0; s < room.totalSeats - room.freeSeats; s++) {
    const n = pool[(rid * 7) % pool.length]
    seedResidents.push({
      id: rid,
      roomId: room.id,
      name: n,
      movedIn: ['1 Feb 2025', '1 Mar 2025', '15 Mar 2025', '1 Apr 2025', '1 May 2025'][rid % 5],
      matchScore: 62 + ((rid * 13) % 33),
      matchReason: REASONS[rid % REASONS.length],
      isPublic: rid % 3 !== 0,
    })
    rid++
  }
})
const seedInquiries = [
  {
    id: 1,
    hostelId: 1,
    roomTypeId: 2,
    roomId: 203,
    studentId: 1,
    date: '12 Sep 2026',
    status: 'Pending',
    moveIn: '1 Oct 2026',
    duration: 6,
    chat: [
      {
        id: 1,
        from: 'student',
        text: "Assalam-o-Alaikum. I'm a third-year CS student at PU New Campus. Is a seat in the 3-bed AC room available from 1 October?",
        time: '12 Sep, 10:32',
      },
      {
        id: 2,
        from: 'owner',
        text: 'Wa Alaikum Assalam. Yes, Room 204 has a seat from 1 October. You are welcome to visit any weekday between 4 and 7 pm — please bring your university card.',
        time: '12 Sep, 11:05',
      },
      {
        id: 3,
        from: 'student',
        text: 'Thank you. I will come on Thursday at 5 pm.',
        time: '12 Sep, 11:18',
      },
    ],
  },
  {
    id: 2,
    hostelId: 4,
    roomTypeId: 6,
    roomId: 601,
    studentId: 1,
    date: '3 Apr 2025',
    status: 'Moved In',
    moveIn: '1 May 2025',
    duration: 8,
    assignedRoomId: 601,
    actualMoveIn: '1 May 2025',
    chat: [
      {
        id: 1,
        from: 'student',
        text: 'Hello, I would like a seat in the 2-bed room from May.',
        time: '3 Apr, 09:10',
      },
      {
        id: 2,
        from: 'owner',
        text: 'Welcome! Room 102 is ready for you on 1 May.',
        time: '3 Apr, 12:40',
      },
    ],
  },
  {
    id: 3,
    hostelId: 6,
    roomTypeId: 9,
    roomId: 900,
    studentId: 1,
    date: '20 Mar 2025',
    status: 'Declined',
    moveIn: '15 Apr 2025',
    duration: 4,
    declineReason: 'This hostel is for male students only.',
    chat: [
      {
        id: 1,
        from: 'student',
        text: 'Is the 2-bed available in April?',
        time: '20 Mar, 14:02',
      },
    ],
  },
  {
    id: 4,
    hostelId: 5,
    roomTypeId: 8,
    roomId: 800,
    studentId: 1,
    date: '10 Feb 2025',
    status: 'Expired',
    moveIn: '1 Mar 2025',
    duration: 3,
    chat: [
      {
        id: 1,
        from: 'student',
        text: 'Hi, is there a seat for March?',
        time: '10 Feb, 16:20',
      },
    ],
  },
  {
    id: 5,
    hostelId: 1,
    roomTypeId: 1,
    roomId: 100,
    studentId: 3,
    date: '8 Sep 2026',
    status: 'Pending',
    moveIn: '15 Oct 2026',
    duration: 4,
    chat: [
      {
        id: 1,
        from: 'student',
        text: 'Salam, I am a first-year student. Can I see the 2-bed room this weekend?',
        time: '8 Sep, 18:44',
      },
    ],
  },
  {
    id: 6,
    hostelId: 1,
    roomTypeId: 2,
    roomId: 200,
    studentId: 7,
    date: '2 Sep 2026',
    status: 'Pending',
    moveIn: '1 Nov 2026',
    duration: 8,
    chat: [
      {
        id: 1,
        from: 'student',
        text: 'Is Room 201 still available for November?',
        time: '2 Sep, 09:15',
      },
    ],
  },
  {
    id: 7,
    hostelId: 1,
    roomTypeId: 2,
    roomId: 206,
    studentId: 6,
    date: '1 May 2025',
    status: 'Moved In',
    moveIn: '1 May 2025',
    duration: 8,
    assignedRoomId: 206,
    actualMoveIn: '3 May 2025',
    chat: [],
  },
]
const seedReviews = [
  {
    id: 1,
    inquiryId: -1,
    hostelId: 1,
    studentId: 7,
    studentName: 'Sana Tariq',
    rating: 5,
    date: 'Aug 2026',
    text: 'Very clean, well managed and genuinely safe. I stayed eight months and never had a serious issue. The warden sorts out problems the same day.',
    reply: 'Thank you, Sana — it was a pleasure having you with us.',
  },
  {
    id: 2,
    inquiryId: -2,
    hostelId: 1,
    studentId: 3,
    studentName: 'Rida Malik',
    rating: 4,
    date: 'Jul 2026',
    text: 'Comfortable rooms and a good location — about 15 minutes by rickshaw. The generator works well during load shedding. Water pressure is weak in the morning rush.',
  },
  {
    id: 3,
    inquiryId: -3,
    hostelId: 1,
    studentId: 6,
    studentName: 'Hira Farooq',
    rating: 5,
    date: 'Jun 2026',
    text: 'Fast Wi-Fi, decent mess food and a quiet study room. Would recommend it to any PU student.',
    reply: 'Thank you, Hira! Best of luck with your finals.',
  },
  {
    id: 4,
    inquiryId: -4,
    hostelId: 1,
    studentId: 4,
    studentName: 'Nida Aslam',
    rating: 4,
    date: 'May 2026',
    text: 'Good value for the price. The common area could use more seating, but management listens to feedback.',
  },
  {
    id: 5,
    inquiryId: -5,
    hostelId: 4,
    studentId: 3,
    studentName: 'Rida Malik',
    rating: 5,
    date: 'Apr 2026',
    text: 'The morning van to campus is a lifesaver. Study hall is open until midnight.',
  },
]
const seedReports = [
  {
    id: 1,
    type: 'Hostel Verification',
    title: 'Al-Noor Residency',
    submittedBy: 'Tariq Mahmood',
    date: '24 Sep 2026',
    ownerPhone: '+92 301 4418 220',
    address: 'House 14, Block C, Faisal Town, Lahore',
    rooms: '1 room type · 4 rooms · 12 seats',
    photos: [H[2], H[3]],
    hostelId: 3,
  },
  {
    id: 2,
    type: 'Reported Review',
    title: 'Review on Green Court Hostel',
    submittedBy: 'Tariq Mahmood',
    date: '23 Sep 2026',
    reportReason: 'Reviewer never lived here',
    content:
      '“Terrible place, rats everywhere and the owner is rude. Avoid.” — posted by a new account with no verified stay.',
  },
  {
    id: 3,
    type: 'Hostel Verification',
    title: 'Sunrise Girls Annex',
    submittedBy: 'Tariq Mahmood',
    date: '22 Sep 2026',
    ownerPhone: '+92 301 4418 220',
    address: 'Plot 7, Garden Town, Lahore',
    rooms: '1 room type · 6 rooms · 12 seats',
    photos: [H[7], H[1]],
    hostelId: 7,
  },
  {
    id: 4,
    type: 'Reported Post',
    title: 'Cheap rooms near PU — contact on WhatsApp',
    submittedBy: 'Rida Malik',
    date: '21 Sep 2026',
    reportReason: 'Shares a phone number / off-platform contact',
    content:
      'Cheap rooms available near PU New Campus — WhatsApp 0300 ••• •••• for details. No brokerage.',
  },
  {
    id: 5,
    type: 'Reported Review',
    title: 'Review on Saffron Lodge',
    submittedBy: 'Omar Siddiqui',
    date: '20 Sep 2026',
    reportReason: 'Abusive language',
    content: '“Worst experience ever. The owner is a [removed]. Total scam.”',
  },
]
const seedPosts = [
  {
    id: 1,
    type: 'Question',
    author: 'Areesha Khan',
    authorId: 1,
    time: '2h ago',
    title: 'Model Town or Gulberg for a daily commute to New Campus?',
    hostelId: 1,
    body: "I'm moving next month and deciding between Model Town and Gulberg. Gulberg seems more popular but the commute looks longer on the map. If you make this trip every day, how long does it actually take at 8 am, and what do you use — van, rickshaw or the metro bus?",
    comments: [
      {
        id: 1,
        author: 'Rida Malik',
        time: '1h ago',
        text: 'Model Town, easily. I do it in 15–20 minutes by rickshaw at 8 am. From Gulberg it was closer to 40 because of the Ferozepur Road traffic.',
      },
      {
        id: 2,
        author: 'Sana Tariq',
        time: '1h ago',
        text: 'Green Court runs a shared van at 7:45. It costs Rs 3,000 a month and is worth it in summer.',
      },
      {
        id: 3,
        author: 'Omar Siddiqui',
        time: '40m ago',
        text: 'Whatever you pick, ask whether the generator covers all rooms. Some hostels only back up the ground floor.',
      },
    ],
  },
  {
    id: 2,
    type: 'Marketplace',
    author: 'Bilal Ahmed',
    authorId: 4,
    time: '4h ago',
    title: 'Single mattress, used one semester',
    price: 3500,
    image: IMG.mattress,
    seller: { months: 8, stays: 1 },
    body: "Single-size foam mattress (3' × 6'), used for one semester. No stains, no smell — I used a cover the whole time. Moving out of Johar Town next week. Pick-up only, price slightly negotiable.",
    comments: [
      {
        id: 1,
        author: 'Hira Farooq',
        time: '2h ago',
        text: 'Is it still available this weekend?',
      },
    ],
  },
  {
    id: 3,
    type: 'Study Partners',
    author: 'Zainab Tahir',
    time: '6h ago',
    title: 'Data Structures study group — Saturdays at the Main Library',
    body: 'Starting a weekly session this Saturday at 11 am on the first floor of the Main Library. We will go through past papers for the mid-term. All years welcome.',
    comments: [],
  },
  {
    id: 4,
    type: 'Experience',
    author: 'Rida Malik',
    authorId: 3,
    time: '1d ago',
    title: 'Three months at Saffron Lodge — an honest account',
    hostelId: 4,
    body: "I moved in February. The good: the morning van, a study hall open until midnight, and staff who fix things quickly. The less good: mess food gets repetitive and the Wi-Fi slows down after 10 pm. Overall I'd choose it again.",
    comments: [],
  },
  {
    id: 5,
    type: 'Marketplace',
    author: 'Omar Siddiqui',
    authorId: 6,
    time: '2d ago',
    title: 'First-year Physics and Calculus textbooks',
    price: 1200,
    image: IMG.books,
    seller: { months: 0, stays: 0 },
    body: 'Three original first-year textbooks (not photocopies) in very good condition. Rs 1,200 for all three.',
    comments: [],
  },
  {
    id: 6,
    type: 'Question',
    author: 'Sana Tariq',
    authorId: 7,
    time: '3d ago',
    title: 'Which hostels near New Campus have a proper study room?',
    body: "Looking for somewhere with a quiet study space that's open late. Recommendations welcome.",
    comments: [
      {
        id: 1,
        author: 'Rida Malik',
        time: '3d ago',
        text: 'Saffron Lodge — their study hall is open until midnight.',
      },
    ],
  },
]
const seedNotifications = [
  {
    id: 1,
    userId: 1,
    text: 'Green Court Hostel replied to your inquiry',
    time: '2m ago',
    unread: true,
    link: '/s/inquiries/1',
  },
  {
    id: 2,
    userId: 1,
    text: 'You can now review Saffron Lodge',
    time: '1h ago',
    unread: true,
    link: '/s/inquiries/2',
  },
  {
    id: 3,
    userId: 1,
    text: 'Your report was reviewed by the moderation team',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 4,
    userId: 2,
    text: 'New inquiry from Rida Malik for the 2-bed Standard',
    time: '20m ago',
    unread: true,
    link: '/o/inquiries/5',
  },
  {
    id: 5,
    userId: 2,
    text: 'Sana Tariq left a 5-star review',
    time: '2d ago',
    unread: false,
    link: '/o/reviews',
  },
]
const seedProfile = {
  budgetMin: 12000,
  budgetMax: 18000,
  cleanliness: 4,
  religion: 'Muslim',
  sleep: 'Night owl',
  study: 'Quiet',
  smoking: 'No',
  visitors: 'Rarely',
  noise: 'Low',
  hobbies: ['Reading', 'Coding', 'Badminton'],
  visible: false,
  saved: false,
}
const StoreContext = createContext(null)
export function StoreProvider({ children }) {
  const [hostels, setHostels] = useState(seedHostels)
  const [roomTypes, setRoomTypes] = useState(seedRoomTypes)
  const [rooms, setRooms] = useState(seedRooms)
  const [residents, setResidents] = useState(seedResidents)
  const [inquiries, setInquiries] = useState(seedInquiries)
  const [reviews, setReviews] = useState(seedReviews)
  const [reports, setReports] = useState(seedReports)
  const [users, setUsers] = useState(seedUsers)
  const [notifications, setNotifications] = useState(seedNotifications)
  const [posts, setPosts] = useState(seedPosts)
  const [profile, setProfile] = useState(seedProfile)
  const [currentUserId, setCurrentUserId] = useState(1)
  const [wishlistIds, setWishlistIds] = useState([1, 4, 3])
  const [compareIds, setCompareIds] = useState([1, 4])
  const [ownerHostelId, setOwnerHostelId] = useState(1)
  const currentUser = users.find((u) => u.id === currentUserId) ?? users[0]
  const value = useMemo(() => {
    const hostel = (id) => hostels.find((h) => h.id === id)
    const user = (id) => users.find((u) => u.id === id)
    const typesFor = (hostelId) => roomTypes.filter((t) => t.hostelId === hostelId)
    const roomsFor = (roomTypeId) => rooms.filter((r) => r.roomTypeId === roomTypeId)
    const freeSeats = (hostelId) =>
      rooms.filter((r) => r.hostelId === hostelId).reduce((s, r) => s + r.freeSeats, 0)
    const totalSeats = (hostelId) =>
      rooms.filter((r) => r.hostelId === hostelId).reduce((s, r) => s + r.totalSeats, 0)
    const startingPrice = (hostelId) =>
      Math.min(...typesFor(hostelId).map((t) => t.price), Infinity) || 0
    const notify = (userId, text, link) =>
      setNotifications((n) => [
        {
          id: Date.now() + Math.random(),
          userId,
          text,
          time: 'Just now',
          unread: true,
          link,
        },
        ...n,
      ])
    const hostelName = (id) => hostel(id)?.name ?? 'the hostel'
    return {
      hostels,
      roomTypes,
      rooms,
      residents,
      inquiries,
      reviews,
      reports,
      users,
      notifications,
      posts,
      profile,
      currentUser,
      wishlistIds,
      compareIds,
      ownerHostelId,
      hostel,
      user,
      typesFor,
      roomsFor,
      freeSeats,
      totalSeats,
      startingPrice,
      signIn: (id) => setCurrentUserId(id),
      login: (email) => {
        const u = users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase())
        if (u && u.status === 'Active') setCurrentUserId(u.id)
        return u
      },
      signOut: () => setCurrentUserId(1),
      setOwnerHostelId,
      toggleWishlist: (id) =>
        setWishlistIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])),
      clearWishlist: () => setWishlistIds([]),
      toggleCompare: (id) => {
        if (compareIds.includes(id)) {
          setCompareIds((ids) => ids.filter((x) => x !== id))
          return true
        }
        if (compareIds.length >= 3) return false
        setCompareIds((ids) => [...ids, id])
        return true
      },
      createInquiry: (input) => {
        const id = Date.now()
        setInquiries((items) => [
          {
            id,
            ...input,
            studentId: currentUser.id,
            date: today(),
            status: 'Pending',
            chat: [
              {
                id: id + 1,
                from: 'student',
                text: input.message,
                time: 'Just now',
              },
            ],
          },
          ...items,
        ])
        const h = hostel(input.hostelId)
        if (h) notify(h.ownerId, `New inquiry from ${currentUser.name}`, `/o/inquiries/${id}`)
        return id
      },
      cancelInquiry: (id) =>
        setInquiries((items) =>
          items.map((i) => (i.id === id ? { ...i, status: 'Cancelled' } : i)),
        ),
      sendInquiryMessage: (inquiryId, from, text) => {
        setInquiries((items) =>
          items.map((i) =>
            i.id === inquiryId
              ? {
                  ...i,
                  chat: [...i.chat, { id: Date.now(), from, text, time: 'Just now' }],
                }
              : i,
          ),
        )
        const inq = inquiries.find((i) => i.id === inquiryId)
        if (inq && from === 'owner')
          notify(
            inq.studentId,
            `${hostelName(inq.hostelId)} replied to your inquiry`,
            `/s/inquiries/${inquiryId}`,
          )
      },
      submitReview: (inquiryId, rating, text) => {
        const inq = inquiries.find((i) => i.id === inquiryId)
        const student = inq && users.find((u) => u.id === inq.studentId)
        if (!inq || inq.status !== 'Moved In' || !student) return
        const existing = reviews.find((r) => r.inquiryId === inquiryId)
        const review = {
          id: existing?.id ?? Date.now(),
          inquiryId,
          hostelId: inq.hostelId,
          studentId: student.id,
          studentName: student.name,
          rating,
          date: 'Just now',
          text,
          reply: existing?.reply,
        }
        setReviews(
          existing ? reviews.map((r) => (r.id === review.id ? review : r)) : [review, ...reviews],
        )
        setInquiries((items) =>
          items.map((i) => (i.id === inquiryId ? { ...i, reviewId: review.id } : i)),
        )
        setHostels((items) =>
          items.map((h) =>
            h.id !== inq.hostelId
              ? h
              : {
                  ...h,
                  rating: Number(
                    (existing
                      ? (h.rating * h.reviewCount - existing.rating + rating) / h.reviewCount
                      : (h.rating * h.reviewCount + rating) / (h.reviewCount + 1)
                    ).toFixed(1),
                  ),
                  reviewCount: existing ? h.reviewCount : h.reviewCount + 1,
                },
          ),
        )
        const h = hostel(inq.hostelId)
        if (h && !existing)
          notify(h.ownerId, `${student.name} left a ${rating}-star review`, '/o/reviews')
      },
      deleteReview: (inquiryId) => {
        const del = reviews.find((r) => r.inquiryId === inquiryId)
        if (!del) return
        setReviews(reviews.filter((r) => r.id !== del.id))
        setInquiries((items) =>
          items.map((i) => (i.id === inquiryId ? { ...i, reviewId: undefined } : i)),
        )
        setHostels((items) =>
          items.map((h) =>
            h.id !== del.hostelId
              ? h
              : {
                  ...h,
                  rating:
                    h.reviewCount > 1
                      ? Number(
                          ((h.rating * h.reviewCount - del.rating) / (h.reviewCount - 1)).toFixed(
                            1,
                          ),
                        )
                      : 0,
                  reviewCount: Math.max(0, h.reviewCount - 1),
                },
          ),
        )
      },
      saveProfile: (p) => setProfile({ ...p, saved: true }),
      createPost: (p) => {
        const id = Date.now()
        setPosts((items) => [
          {
            ...p,
            id,
            author: currentUser.name,
            authorId: currentUser.id,
            time: 'Just now',
            comments: [],
          },
          ...items,
        ])
        return id
      },
      addComment: (postId, text) =>
        setPosts((items) =>
          items.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [
                    ...p.comments,
                    {
                      id: Date.now(),
                      author: currentUser.name,
                      time: 'Just now',
                      text,
                    },
                  ],
                }
              : p,
          ),
        ),
      markInquiryMovedIn: (inquiryId, assignedRoomId, actualMoveIn) => {
        const inq = inquiries.find((i) => i.id === inquiryId)
        const room = rooms.find((r) => r.id === assignedRoomId)
        const student = inq && users.find((u) => u.id === inq.studentId)
        if (!inq || !room || room.freeSeats < 1 || !student) return
        setInquiries((items) =>
          items.map((i) =>
            i.id === inquiryId
              ? {
                  ...i,
                  status: 'Moved In',
                  actualMoveIn,
                  assignedRoomId,
                  roomId: assignedRoomId,
                }
              : i,
          ),
        )
        setRooms((items) =>
          items.map((r) => (r.id === assignedRoomId ? { ...r, freeSeats: r.freeSeats - 1 } : r)),
        )
        setResidents((items) => [
          ...items,
          {
            id: Date.now(),
            userId: student.id,
            roomId: assignedRoomId,
            name: student.name.split(' ')[0],
            movedIn: actualMoveIn,
            isPublic: profile.visible,
          },
        ])
        notify(
          student.id,
          `You were marked as moved in at ${hostelName(inq.hostelId)}, Room ${room.number}. You can now leave a review.`,
          `/s/inquiries/${inquiryId}`,
        )
      },
      declineInquiry: (inquiryId, reason) => {
        setInquiries((items) =>
          items.map((i) =>
            i.id === inquiryId
              ? { ...i, status: 'Declined', declineReason: reason || undefined }
              : i,
          ),
        )
        const inq = inquiries.find((i) => i.id === inquiryId)
        if (inq)
          notify(
            inq.studentId,
            `${hostelName(inq.hostelId)} declined your inquiry`,
            `/s/inquiries/${inquiryId}`,
          )
      },
      replyToReview: (reviewId, reply) =>
        setReviews((items) => items.map((r) => (r.id === reviewId ? { ...r, reply } : r))),
      addHostel: (input) => {
        const hostelId = Date.now()
        const types = input.roomTypes.map((t, i) => ({
          id: hostelId + i + 1,
          hostelId,
          name: `${t.type === 'Single' ? 'Single' : t.type === 'Twin' ? '2-bed' : t.type === '3-bed' ? '3-bed' : '4-bed'}${t.ac ? ' AC' : ''} Room`,
          type: t.type,
          ac: t.ac,
          price: t.price,
          seatsPerRoom: t.seatsPerRoom,
          photoUrls: input.photos,
        }))
        const newRooms = types.flatMap((t, ti) =>
          input.roomTypes[ti].roomNumbers.map((n, ri) => ({
            id: hostelId + 1000 + ti * 100 + ri,
            hostelId,
            roomTypeId: t.id,
            number: n,
            totalSeats: t.seatsPerRoom,
            freeSeats: t.seatsPerRoom,
          })),
        )
        const seats = newRooms.reduce((s, r) => s + r.totalSeats, 0)
        const area =
          input.address
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(-2, -1)[0] || 'Lahore'
        setHostels((items) => [
          ...items,
          {
            id: hostelId,
            ownerId: input.ownerId,
            name: input.name,
            area,
            address: input.address,
            description: input.description,
            gender: 'Female',
            status: 'Pending',
            rating: 0,
            reviewCount: 0,
            distance: 0,
            verifiedStays: 0,
            listedOn: 'Just now',
            facilities: input.facilities,
            image: input.photos[0],
            gallery: input.photos,
          },
        ])
        setRoomTypes((items) => [...items, ...types])
        setRooms((items) => [...items, ...newRooms])
        setReports((items) => [
          {
            id: hostelId,
            type: 'Hostel Verification',
            title: input.name,
            submittedBy: user(input.ownerId)?.name ?? 'Owner',
            date: 'Just now',
            ownerPhone: input.ownerPhone,
            address: input.address,
            rooms: `${types.length} room type${types.length > 1 ? 's' : ''} · ${newRooms.length} rooms · ${seats} seats`,
            photos: input.photos,
            hostelId,
          },
          ...items,
        ])
        return hostelId
      },
      updateHostel: (id, changes) =>
        setHostels((items) => items.map((h) => (h.id === id ? { ...h, ...changes } : h))),
      moveOut: (residentId) => {
        const res = residents.find((r) => r.id === residentId)
        if (!res) return
        setResidents((items) => items.filter((r) => r.id !== residentId))
        setRooms((items) =>
          items.map((r) =>
            r.id === res.roomId ? { ...r, freeSeats: Math.min(r.totalSeats, r.freeSeats + 1) } : r,
          ),
        )
      },
      removeRoom: (roomId) => setRooms((items) => items.filter((r) => r.id !== roomId)),
      addRooms: (roomTypeId, numbers) => {
        const t = roomTypes.find((x) => x.id === roomTypeId)
        if (!t) return
        setRooms((items) => [
          ...items,
          ...numbers.map((n, i) => ({
            id: Date.now() + i,
            hostelId: t.hostelId,
            roomTypeId,
            number: n,
            totalSeats: t.seatsPerRoom,
            freeSeats: t.seatsPerRoom,
          })),
        ])
      },
      createReport: (r) =>
        setReports((items) => [
          {
            ...r,
            id: Date.now(),
            date: 'Just now',
            submittedBy: currentUser.name,
          },
          ...items,
        ]),
      markAllNotificationsRead: () =>
        setNotifications((items) =>
          items.map((n) => (n.userId === currentUser.id ? { ...n, unread: false } : n)),
        ),
      readNotification: (id) =>
        setNotifications((items) => items.map((n) => (n.id === id ? { ...n, unread: false } : n))),
      moderateHostel: (reportId, decision, reason) => {
        const report = reports.find((r) => r.id === reportId)
        if (!report?.hostelId) return
        const h = hostel(report.hostelId)
        setHostels((items) =>
          items.map((x) =>
            x.id === report.hostelId
              ? {
                  ...x,
                  status: decision,
                  rejectReason: decision === 'Rejected' ? reason : undefined,
                }
              : x,
          ),
        )
        setReports((items) => items.filter((r) => r.id !== reportId))
        if (h)
          notify(
            h.ownerId,
            decision === 'Approved'
              ? `${h.name} is verified and now live`
              : `${h.name} was not approved — see the reason`,
            '/o/hostels',
          )
      },
      resolveReport: (reportId) => setReports((items) => items.filter((r) => r.id !== reportId)),
      setUserBan: (userId, banned, reason) =>
        setUsers((items) =>
          items.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  status: banned ? 'Banned' : 'Active',
                  banReason: banned ? reason : undefined,
                }
              : u,
          ),
        ),
    }
  }, [
    hostels,
    roomTypes,
    rooms,
    residents,
    inquiries,
    reviews,
    reports,
    users,
    notifications,
    posts,
    profile,
    currentUser,
    wishlistIds,
    compareIds,
    ownerHostelId,
  ])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
export function useStore() {
  const s = useContext(StoreContext)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}
