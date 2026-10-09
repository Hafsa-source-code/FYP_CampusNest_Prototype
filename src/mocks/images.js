// TEMPORARY demo photos (Unsplash). Real hostel photos will come from the
// backend (Cloudinary URLs). Delete this file once every page uses real data.

const unsplash = (id, width = 1200) =>
  `https://images.unsplash.com/${id}?w=${width}&q=80&auto=format&fit=crop`

export const IMG = {
  heroRoom: unsplash('photo-1555854877-bab0e564b8d5', 1400),
  studyDesk: unsplash('photo-1523240795612-9a054b0db644'),
  campus: unsplash('photo-1541339907198-e08756dedf3f', 1400),
  friends: unsplash('photo-1522202176988-66273c2fd55f'),
  ownerDesk: unsplash('photo-1497366216548-37526070297c'),
  mattress: unsplash('photo-1631049307264-da0ec9d70304', 900),
  books: unsplash('photo-1481627834876-b7833e8f5570', 900),
  sofa: unsplash('photo-1555041469-a586c61ea9bc', 900),
  lamp: unsplash('photo-1540574163026-643ea20ade25', 900),
}

export const HOSTEL_PHOTOS = [
  'photo-1555854877-bab0e564b8d5',
  'photo-1522708323590-d24dbb6b0267',
  'photo-1560448204-e02f11c3d0e2',
  'photo-1493809842364-78817add7ffb',
  'photo-1502672260266-1c1ef2d93688',
  'photo-1484154218962-a197022b5858',
  'photo-1505693416388-ac5ce068fe85',
  'photo-1586023492125-27b2c045efd7',
  'photo-1513694203232-719a280e022f',
].map((id) => unsplash(id))

export const ROOM_PHOTOS = [
  'photo-1505693416388-ac5ce068fe85',
  'photo-1555854877-bab0e564b8d5',
  'photo-1586023492125-27b2c045efd7',
].map((id) => unsplash(id))
