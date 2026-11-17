export type AttendanceStatus = 'Hadir' | 'Berhalangan' | 'Ragu-ragu';

export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  aspect: 'portrait' | 'landscape';
}

export interface BankAccount {
  id: string;
  bankName: string;
  bankShort: string;
  accountNumber: string;
  accountHolder: string;
  variant: 'sage' | 'cream';
}

export interface GuestWish {
  id: string;
  name: string;
  status: AttendanceStatus;
  guests: number;
  message: string;
  createdAt: number;
  isNew?: boolean;
}

export const WEDDING_CONFIG = {
  eventType: 'Pernikahan',
  coupleShort: 'Rizky & Anisa',
  monogram: 'R & A',
  groom: {
    name: 'Rizky Pratama Putra',
    parents: 'Putra pertama Bapak H. Hendra Wijaya & Ibu Hj. Siti Aminah',
  },
  bride: {
    name: 'Anisa Rahmawati',
    parents: 'Putri kedua Bapak Drs. Ahmad Fauzi & Ibu Hj. Ratna Dewi',
  },
  eventDateISO: '2026-12-20T09:00:00+07:00',
  eventEndISO: '2026-12-20T15:00:00+07:00',
  eventDateDisplay: 'Minggu, 20 Desember 2026',
  venueName: 'Gedung Pendopo Agung',
  venueAddress: 'Jl. Yudanegara No. 28, Kec. Cihideung, Kota Tasikmalaya, Jawa Barat 46121',
  mapsUrl: 'https://maps.google.com/?q=Pendopo+Agung+Tasikmalaya',
  sessions: [
    {
      id: 'akad',
      number: '01',
      title: 'Akad Nikah',
      subtitle: 'Ijab Kabul & Sungkeman',
      date: 'Minggu, 20 Desember 2026',
      time: '09.00 – 11.00 WIB',
      venue: 'Paviliun Taman · Gedung Pendopo Agung',
      address: 'Jl. Yudanegara No. 28, Tasikmalaya',
    },
    {
      id: 'resepsi',
      number: '02',
      title: 'Resepsi Pernikahan',
      subtitle: 'Ramah Tamah & Jamuan Malam',
      date: 'Minggu, 20 Desember 2026',
      time: '11.30 – 15.00 WIB',
      venue: 'Aula Utama · Gedung Pendopo Agung',
      address: 'Jl. Yudanegara No. 28, Tasikmalaya',
    },
  ],
  heroImage: '/src/assets/images/wedding_cover_hero_1794879430060.jpg',
  gallery: [
    {
      id: 'g1',
      src: '/src/assets/images/wedding_cover_hero_1794879430060.jpg',
      alt: 'Potret Rizky dan Anisa di rumah kaca botani',
      title: 'Di Bawah Cahaya Pagi',
      caption: 'Sesi pra-nikah di konservatori botani dengan nuansa sage dan krem alami.',
      aspect: 'portrait',
    },
    {
      id: 'g2',
      src: '/src/assets/images/wedding_gallery_rings_1794879430149.jpg',
      alt: 'Sepasang cincin pernikahan emas di atas sutra krem dan melati',
      title: 'Ikatan Emas & Melati',
      caption: 'Simbol janji suci yang abadi, dipadukan dengan rangkai melati putih.',
      aspect: 'landscape',
    },
    {
      id: 'g3',
      src: '/src/assets/images/wedding_gallery_akad_1794879430200.jpg',
      alt: 'Paviliun akad nikah taman dengan tirai krem dan anggrek putih',
      title: 'Paviliun Akad Taman',
      caption: 'Ruang sakral bernuansa kayu dan anggrek putih tempat ijab kabul terucap.',
      aspect: 'landscape',
    },
    {
      id: 'g4',
      src: '/src/assets/images/wedding_gallery_bouquet_1794879430205.jpg',
      alt: 'Buket pengantin mawar putih, melati, dan daun eucalyptus',
      title: 'Buket Putih & Eucalyptus',
      caption: 'Detail kebaya brokat gading berpadu buket mawar taman dan daun sage.',
      aspect: 'portrait',
    },
    {
      id: 'g5',
      src: '/src/assets/images/wedding_gallery_reception_1794879430727.jpg',
      alt: 'Meja jamuan resepsi malam dengan lilin tinggi dan daun sage',
      title: 'Jamuan Hangat Senja',
      caption: 'Meja panjang berlapis linen krem dan cahaya lilin untuk merayakan kebersamaan.',
      aspect: 'landscape',
    },
    {
      id: 'g6',
      src: '/src/assets/images/wedding_gallery_walk_1794879430248.jpg',
      alt: 'Mempelai berjalan bergandengan tangan di jalur batu taman zaitun',
      title: 'Langkah Pertama Bersama',
      caption: 'Berjalan beriringan menyusuri taman batu saat senja keemasan tiba.',
      aspect: 'portrait',
    },
  ] as GalleryPhoto[],
  bankAccounts: [
    {
      id: 'bca',
      bankName: 'Bank Central Asia (BCA)',
      bankShort: 'BCA',
      accountNumber: '0541289401',
      accountHolder: 'Rizky Pratama Putra',
      variant: 'sage',
    },
    {
      id: 'mandiri',
      bankName: 'Bank Mandiri',
      bankShort: 'Mandiri',
      accountNumber: '1310018492031',
      accountHolder: 'Anisa Rahmawati',
      variant: 'cream',
    },
  ] as BankAccount[],
};

export const INITIAL_WISHES: GuestWish[] = [
  {
    id: 'seed-1',
    name: 'Dr. Budi Santoso & Keluarga',
    status: 'Hadir',
    guests: 2,
    message:
      'Barakallahu lakuma wa baraka alaikuma. Semoga Rizky dan Anisa senantiasa dilimpahi ketenangan, keberkahan, dan cinta hingga jannah.',
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: 'seed-2',
    name: 'Nadia Kusuma',
    status: 'Hadir',
    guests: 1,
    message:
      'Selamat menempuh hidup baru, Anisa sayang dan Mas Rizky! Tidak sabar menghadiri akad di Pendopo Agung Tasikmalaya.',
    createdAt: Date.now() - 1000 * 60 * 60 * 14,
  },
  {
    id: 'seed-3',
    name: 'Fajar Ramadhan',
    status: 'Berhalangan',
    guests: 1,
    message:
      'Mohon maaf belum bisa hadir langsung karena tugas luar kota, namun doa terbaik selalu menyertai kebahagiaan kalian berdua.',
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
  },
];
