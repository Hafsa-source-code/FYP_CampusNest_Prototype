// Demo accounts. The same people as the demo data in store.jsx.
// TEMPORARY DUPLICATE: store.jsx still has its own copy of this list;
// in Step 5 store.jsx is split up and will read from this file instead.

export const DEMO_USERS = [
  { id: 1, name: 'Areesha Khan', email: 'areesha@pu.edu.pk', role: 'Student', status: 'Active' },
  {
    id: 2,
    name: 'Tariq Mahmood',
    email: 'tariq@greencourt.pk',
    role: 'Hostel Owner',
    status: 'Active',
  },
  { id: 3, name: 'Rida Malik', email: 'rida.m@pu.edu.pk', role: 'Student', status: 'Active' },
  { id: 4, name: 'Bilal Ahmed', email: 'bilal.a@pu.edu.pk', role: 'Student', status: 'Active' },
  {
    id: 5,
    name: 'Fatima Noor',
    email: 'fatima@saffronlodge.pk',
    role: 'Hostel Owner',
    status: 'Active',
  },
  { id: 6, name: 'Omar Siddiqui', email: 'omar.s@pu.edu.pk', role: 'Student', status: 'Active' },
  { id: 7, name: 'Sana Tariq', email: 'sana.t@pu.edu.pk', role: 'Student', status: 'Active' },
  {
    id: 8,
    name: 'Khalid Rehman',
    email: 'khalid.owner@gmail.com',
    role: 'Hostel Owner',
    status: 'Banned',
    banReason: 'Listed a hostel with photos of a different property.',
  },
  {
    id: 9,
    name: 'Hamza Qureshi',
    email: 'hamza.q@pu.edu.pk',
    role: 'Student',
    status: 'Banned',
    banReason: 'Repeatedly posted phone numbers in community posts.',
  },
  { id: 10, name: 'Admin Team', email: 'admin@campusnest.pk', role: 'Admin', status: 'Active' },
]
