import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, CalendarPlus, Check, Clock, Disc3, MapPin, VolumeX } from 'lucide-react';
import { BotanicalDivider, CornerOrnament } from './components/BotanicalOrnaments';
import { CoverModal } from './components/CoverModal';
import { DigitalEnvelope } from './components/DigitalEnvelope';
import { GalleryLightbox } from './components/GalleryLightbox';
import { RsvpGuestbook } from './components/RsvpGuestbook';
import { VenueMapPreview } from './components/VenueMapPreview';
import { WEDDING_CONFIG } from './data/weddingConfig';
import { pianoPlayer } from './utils/pianoAudio';

interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function getCountdown(targetISO: string): CountdownParts {
  const diff = new Date(targetISO).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, isPast: false };
}

function buildGoogleCalendarUrl(): string {
  const formatUtc = (iso: string) =>
    new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Pernikahan ${WEDDING_CONFIG.coupleShort}`,
    dates: `${formatUtc(WEDDING_CONFIG.eventDateISO)}/${formatUtc(WEDDING_CONFIG.eventEndISO)}`,
    details: `Akad Nikah (09.00 WIB) & Resepsi Pernikahan (11.30 WIB) ${WEDDING_CONFIG.groom.name} & ${WEDDING_CONFIG.bride.name}.`,
    location: `${WEDDING_CONFIG.venueName}, ${WEDDING_CONFIG.venueAddress}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function App() {
  const guestName = useMemo(() => {
    if (typeof window === 'undefined') return 'Tamu Undangan';
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to')?.trim();
    return toParam && toParam.length > 0 ? toParam : 'Tamu Undangan';
  }, []);

  const [isCoverOpen, setIsCoverOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [countdown, setCountdown] = useState<CountdownParts>(() =>
    getCountdown(WEDDING_CONFIG.eventDateISO)
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const googleCalendarUrl = useMemo(() => buildGoogleCalendarUrl(), []);

  // Lock body scroll while cover modal is open
  useEffect(() => {
    if (isCoverOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCoverOpen]);

  // Real-time countdown timer
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCountdown(getCountdown(WEDDING_CONFIG.eventDateISO));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  // Smooth scroll fade-in reveal observer
  useEffect(() => {
    const sections = document.querySelectorAll('.reveal-section');
    if (typeof IntersectionObserver === 'undefined') {
      sections.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleOpenInvitation = async () => {
    setIsCoverOpen(false);
    const started = await pianoPlayer.start();
    setIsPlaying(started);
  };

  const handleToggleMusic = async () => {
    const nowPlaying = await pianoPlayer.toggle();
    setIsPlaying(nowPlaying);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F4] text-[#2C3A30]">
      {/* 1. Fullscreen Cover Modal */}
      <CoverModal
        guestName={guestName}
        isOpen={isCoverOpen}
        onOpenInvitation={handleOpenInvitation}
      />

      {/* 2. Top Navigation Bar (Clean 3-Zone Contract) */}
      <header className="border-b border-[#3A4F41]/12 bg-[#F9F8F4]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 sm:px-8 py-4">
          <a
            href="#hero"
            className="font-serif text-xl font-semibold tracking-tight text-[#3A4F41] whitespace-nowrap shrink-0"
          >
            {WEDDING_CONFIG.monogram}
          </a>

          <nav
            aria-label="Navigasi Undangan"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C7062]"
          >
            <a
              href="#mempelai"
              className="transition-colors hover:text-[#2C3A30] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Mempelai
            </a>
            <a
              href="#acara"
              className="transition-colors hover:text-[#2C3A30] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Acara
            </a>
            <a
              href="#galeri"
              className="transition-colors hover:text-[#2C3A30] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Galeri
            </a>
            <a
              href="#buku-tamu"
              className="transition-colors hover:text-[#2C3A30] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              Buku Tamu
            </a>
          </nav>

          <a
            href="#buku-tamu"
            className="inline-flex min-h-[44px] items-center justify-center bg-[#3A4F41] px-5 py-2 text-xs sm:text-sm font-medium text-[#F9F8F4] transition-colors hover:bg-[#28382D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A4F41] whitespace-nowrap shrink-0"
          >
            Konfirmasi RSVP
          </a>
        </div>
      </header>

      <main>
        {/* 3. Hero Section & Real-Time Countdown */}
        <section id="hero" className="mx-auto max-w-6xl px-4 sm:px-8 pt-10 pb-16 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Typographic & Countdown Column */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              <div className="space-y-5">
                <p className="text-xs sm:text-sm font-medium tracking-[0.18em] text-[#A6833E]">
                  Undangan {WEDDING_CONFIG.eventType} · Tasikmalaya
                </p>

                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-[#28382D] leading-[1.06]">
                  {WEDDING_CONFIG.coupleShort}
                </h1>

                <p className="max-w-xl text-base sm:text-lg text-[#5C7062] leading-relaxed">
                  Dengan memohon rahmat dan ridho Allah SWT, kami mengundang{' '}
                  <span className="font-medium text-[#2C3A30]">{guestName}</span> untuk hadir
                  dan memberikan doa restu pada hari bahagia kami.
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#3A4F41] pt-1">
                  <span>{WEDDING_CONFIG.eventDateDisplay}</span>
                  <span aria-hidden="true" className="text-[#C5A059]">·</span>
                  <span>09.00 WIB</span>
                  <span aria-hidden="true" className="text-[#C5A059]">·</span>
                  <span>{WEDDING_CONFIG.venueName}</span>
                </div>
              </div>

              {/* Countdown Timer Strip */}
              <div className="space-y-6">
                <div className="border-y border-[#3A4F41]/15 py-6">
                  <p className="text-xs font-medium tracking-wider text-[#5C7062] mb-4">
                    {countdown.isPast ? 'Hari Bahagia Telah Tiba' : 'Menuju Hari Bahagia'}
                  </p>
                  <div className="grid grid-cols-4 gap-3 sm:gap-5">
                    {[
                      { label: 'Hari', value: countdown.days },
                      { label: 'Jam', value: countdown.hours },
                      { label: 'Menit', value: countdown.minutes },
                      { label: 'Detik', value: countdown.seconds },
                    ].map((unit) => (
                      <div
                        key={unit.label}
                        className="bg-white border border-[#3A4F41]/12 px-2 py-4 sm:px-4 sm:py-5 text-center"
                      >
                        <p className="font-serif text-2xl sm:text-4xl font-semibold text-[#3A4F41] tabular-nums">
                          {String(unit.value).padStart(2, '0')}
                        </p>
                        <p className="mt-1 text-xs text-[#5C7062]">{unit.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Hero Action: Save to Google Calendar */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center justify-center gap-2.5 bg-[#3A4F41] px-6 py-3 text-sm font-medium text-[#F9F8F4] transition-colors duration-200 hover:bg-[#28382D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A4F41] whitespace-nowrap"
                  >
                    <CalendarPlus className="h-4 w-4 text-[#C5A059] shrink-0" aria-hidden="true" />
                    <span>Simpan ke Google Calendar</span>
                  </a>

                  <a
                    href="#acara"
                    className="inline-flex min-h-[48px] items-center justify-center border border-[#3A4F41]/25 bg-white px-6 py-3 text-sm font-medium text-[#2C3A30] transition-colors duration-200 hover:border-[#3A4F41] whitespace-nowrap"
                  >
                    Lihat Jadwal &amp; Lokasi
                  </a>
                </div>
              </div>
            </div>

            {/* Right Framed Portrait Column */}
            <div className="lg:col-span-5">
              <div className="relative h-full min-h-[380px] sm:min-h-[460px] border border-[#C5A059]/45 bg-[#EFECE3] p-3 sm:p-4">
                <CornerOrnament position="top-left" className="w-10 h-10 text-[#C5A059] z-10" />
                <CornerOrnament position="top-right" className="w-10 h-10 text-[#C5A059] z-10" />
                <CornerOrnament position="bottom-left" className="w-10 h-10 text-[#C5A059] z-10" />
                <CornerOrnament position="bottom-right" className="w-10 h-10 text-[#C5A059] z-10" />

                <div className="relative h-full w-full overflow-hidden bg-[#DCE3D9]">
                  {!heroImgFailed ? (
                    <img
                      src={WEDDING_CONFIG.heroImage}
                      alt="Potret Mempelai Rizky dan Anisa"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                      <p className="font-serif text-3xl text-[#3A4F41]">
                        {WEDDING_CONFIG.coupleShort}
                      </p>
                      <p className="mt-2 text-sm text-[#5C7062]">
                        {WEDDING_CONFIG.eventDateDisplay}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mempelai & Doa Quote Section */}
        <section
          id="mempelai"
          className="reveal-section border-y border-[#3A4F41]/12 bg-[#F1EFE8]/60 py-16 sm:py-20"
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-8 text-center">
            <p className="mx-auto max-w-2xl font-serif italic text-lg sm:text-xl text-[#3A4F41] leading-relaxed">
              &ldquo;Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
              pasangan hidup dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram
              kepadanya.&rdquo;
            </p>
            <p className="mt-3 text-xs tracking-wider text-[#5C7062]">
              Q.S. Ar-Rum: 21
            </p>

            <BotanicalDivider className="my-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 text-center">
              <div className="bg-white border border-[#3A4F41]/12 p-7 sm:p-9 relative">
                <CornerOrnament position="top-left" className="w-9 h-9 text-[#C5A059]/65" />
                <CornerOrnament position="bottom-right" className="w-9 h-9 text-[#C5A059]/65" />
                <p className="text-xs tracking-[0.18em] text-[#A6833E] font-medium">
                  Mempelai Pria
                </p>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-medium text-[#28382D]">
                  {WEDDING_CONFIG.groom.name}
                </h2>
                <p className="mt-3 text-sm text-[#5C7062] leading-relaxed">
                  {WEDDING_CONFIG.groom.parents}
                </p>
              </div>

              <div className="bg-white border border-[#3A4F41]/12 p-7 sm:p-9 relative">
                <CornerOrnament position="top-right" className="w-9 h-9 text-[#C5A059]/65" />
                <CornerOrnament position="bottom-left" className="w-9 h-9 text-[#C5A059]/65" />
                <p className="text-xs tracking-[0.18em] text-[#A6833E] font-medium">
                  Mempelai Wanita
                </p>
                <h2 className="mt-3 font-serif text-2xl sm:text-3xl font-medium text-[#28382D]">
                  {WEDDING_CONFIG.bride.name}
                </h2>
                <p className="mt-3 text-sm text-[#5C7062] leading-relaxed">
                  {WEDDING_CONFIG.bride.parents}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Detail Rangkaian Acara & Lokasi */}
        <section id="acara" className="reveal-section mx-auto max-w-6xl px-4 sm:px-8 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs tracking-[0.18em] text-[#A6833E] font-medium">
              Rangkaian Acara
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#28382D]">
              Waktu &amp; Tempat Pelaksanaan
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5C7062] leading-relaxed">
              Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan
              hadir pada rangkaian acara berikut.
            </p>
          </div>

          {/* Two Event Schedule Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
            {WEDDING_CONFIG.sessions.map((session) => (
              <div
                key={session.id}
                className="relative bg-white border border-[#3A4F41]/15 p-7 sm:p-9 flex flex-col justify-between"
              >
                <CornerOrnament position="top-left" className="w-10 h-10 text-[#C5A059]/65" />
                <CornerOrnament position="bottom-right" className="w-10 h-10 text-[#C5A059]/65" />

                <div>
                  <p className="text-xs font-medium tracking-wider text-[#A6833E] tabular-nums">
                    Sesi {session.number} · {session.subtitle}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl sm:text-3xl font-medium text-[#28382D]">
                    {session.title}
                  </h3>

                  <div className="mt-6 space-y-3.5 border-t border-[#3A4F41]/10 pt-5 text-sm text-[#2C3A30]">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-[#3A4F41] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-[#3A4F41] shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="tabular-nums font-medium">{session.time}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-[#3A4F41] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="font-medium">{session.venue}</p>
                        <p className="text-[#5C7062] text-xs mt-0.5">{session.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Location Map Preview Card */}
          <VenueMapPreview />
        </section>

        {/* 5. Galeri Foto (Grid + Lightbox) */}
        <section
          id="galeri"
          className="reveal-section border-y border-[#3A4F41]/12 bg-[#F1EFE8]/60 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs tracking-[0.18em] text-[#A6833E] font-medium">
                Galeri Momen
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#28382D]">
                Potret Perjalanan Kami
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#5C7062] leading-relaxed">
                Klik foto mana saja untuk melihat tampilan penuh.
              </p>
            </div>

            <GalleryLightbox photos={WEDDING_CONFIG.gallery} />
          </div>
        </section>

        {/* 6. Amplop Digital (Kado Cashless) */}
        <section id="amplop-digital" className="reveal-section mx-auto max-w-6xl px-4 sm:px-8 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-xs tracking-[0.18em] text-[#A6833E] font-medium">
              Tanda Kasih
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#28382D]">
              Amplop Digital
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5C7062] leading-relaxed">
              Doa restu Bapak/Ibu/Saudara/i merupakan karunia yang sangat berarti bagi kami.
              Namun jika memberi merupakan ungkapan tanda kasih, kami menyediakan saluran kado
              nontunai berikut.
            </p>
          </div>

          <DigitalEnvelope accounts={WEDDING_CONFIG.bankAccounts} onCopySuccess={showToast} />
        </section>

        {/* 7. Konfirmasi Kehadiran (RSVP) & Buku Tamu Interaktif */}
        <section
          id="buku-tamu"
          className="reveal-section border-t border-[#3A4F41]/12 bg-[#F1EFE8]/60 py-16 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-xs tracking-[0.18em] text-[#A6833E] font-medium">
                RSVP &amp; Buku Tamu
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-[#28382D]">
                Konfirmasi Kehadiran &amp; Ucapan
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#5C7062] leading-relaxed">
                Silakan konfirmasi kehadiran serta kirimkan doa restu untuk perjalanan rumah
                tangga kami.
              </p>
            </div>

            <RsvpGuestbook defaultName={guestName} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#28382D] text-[#F9F8F4] py-12 px-4 sm:px-8 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="font-serif text-3xl font-medium tracking-tight">
            {WEDDING_CONFIG.coupleShort}
          </p>
          <p className="text-sm text-[#F9F8F4]/75">
            {WEDDING_CONFIG.eventDateDisplay} · {WEDDING_CONFIG.venueName}, Tasikmalaya
          </p>
          <div className="h-px w-16 mx-auto bg-[#C5A059]/40 my-4" aria-hidden="true" />
          <p className="text-xs text-[#F9F8F4]/60">
            Terima kasih atas kehadiran dan doa restu Anda.
          </p>
        </div>
      </footer>

      {/* Floating Audio Control (Bottom-Right Vinyl Disc) */}
      <button
        type="button"
        onClick={handleToggleMusic}
        aria-label={isPlaying ? 'Bisukan musik latar' : 'Putar musik latar'}
        title={isPlaying ? 'Musik sedang berputar (Klik untuk bisukan)' : 'Putar musik latar'}
        className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[#C5A059]/60 bg-[#28382D] text-[#F9F8F4] shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059] cursor-pointer"
      >
        {isPlaying ? (
          <Disc3 className="h-6 w-6 text-[#C5A059] animate-vinyl" aria-hidden="true" />
        ) : (
          <VolumeX className="h-5 w-5 text-[#F9F8F4]/85" aria-hidden="true" />
        )}
      </button>

      {/* Clipboard Copy Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-5 z-50 flex items-center gap-2.5 border border-[#C5A059]/50 bg-[#28382D] px-4 py-3 text-sm font-medium text-[#F9F8F4] shadow-xl"
        >
          <Check className="h-4 w-4 text-[#C5A059] shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
