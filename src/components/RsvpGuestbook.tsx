import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock, HelpCircle, Send, Users, XCircle } from 'lucide-react';
import { AttendanceStatus, GuestWish, INITIAL_WISHES } from '../data/weddingConfig';

const STORAGE_KEY = 'rizky_anisa_guestbook_v1';

interface RsvpGuestbookProps {
  defaultName?: string;
}

function formatRelativeTime(createdAt: number, isNew?: boolean): string {
  if (isNew) return 'Baru saja';
  const diffMs = Date.now() - createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 2) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari yang lalu`;
}

export const RsvpGuestbook: React.FC<RsvpGuestbookProps> = ({ defaultName }) => {
  const [wishes, setWishes] = useState<GuestWish[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GuestWish[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage access errors and fall back to initial wishes
    }
    return INITIAL_WISHES;
  });

  const [name, setName] = useState(
    defaultName && defaultName !== 'Tamu Undangan' ? defaultName : ''
  );
  const [status, setStatus] = useState<AttendanceStatus>('Hadir');
  const [guests, setGuests] = useState<number>(1);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<'Semua' | AttendanceStatus>('Semua');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishes]);

  const counts = useMemo(() => {
    const attending = wishes.filter((w) => w.status === 'Hadir').length;
    const maybe = wishes.filter((w) => w.status === 'Ragu-ragu').length;
    const absent = wishes.filter((w) => w.status === 'Berhalangan').length;
    const totalGuests = wishes
      .filter((w) => w.status === 'Hadir')
      .reduce((acc, item) => acc + (item.guests || 1), 0);
    return { attending, maybe, absent, totalGuests };
  }, [wishes]);

  const filteredWishes = useMemo(() => {
    if (filter === 'Semua') return wishes;
    return wishes.filter((w) => w.status === filter);
  }, [wishes, filter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) return;

    const newEntry: GuestWish = {
      id: `wish-${Date.now()}`,
      name: trimmedName,
      status,
      guests: status === 'Berhalangan' ? 0 : guests,
      message: trimmedMessage,
      createdAt: Date.now(),
      isNew: true,
    };

    setWishes((prev) => [newEntry, ...prev]);
    setMessage('');
    setSubmittedNotice(true);
    window.setTimeout(() => setSubmittedNotice(false), 3500);
  };

  const renderStatusMeta = (wishStatus: AttendanceStatus) => {
    if (wishStatus === 'Hadir') {
      return (
        <span className="inline-flex items-center gap-1.5 border border-[#3A4F41]/25 bg-[#3A4F41]/10 px-2 py-0.5 text-xs font-medium text-[#28382D]">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#3A4F41]" aria-hidden="true" />
          <span>Hadir</span>
        </span>
      );
    }
    if (wishStatus === 'Ragu-ragu') {
      return (
        <span className="inline-flex items-center gap-1.5 border border-[#C5A059]/40 bg-[#C5A059]/12 px-2 py-0.5 text-xs font-medium text-[#7A5E24]">
          <HelpCircle className="h-3.5 w-3.5 text-[#A6833E]" aria-hidden="true" />
          <span>Ragu-ragu</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 border border-[#5C7062]/25 bg-[#EFECE3] px-2 py-0.5 text-xs font-medium text-[#5C7062]">
        <XCircle className="h-3.5 w-3.5 text-[#5C7062]" aria-hidden="true" />
        <span>Berhalangan</span>
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      {/* RSVP Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#3A4F41]/15 p-6 sm:p-10 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="rsvp-name"
              className="block text-xs font-semibold tracking-wide text-[#3A4F41] mb-2"
            >
              Nama Lengkap
            </label>
            <input
              id="rsvp-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full min-h-[44px] border border-[#3A4F41]/25 bg-[#F9F8F4] px-4 py-2.5 text-sm text-[#2C3A30] placeholder:text-[#5C7062]/60 focus:border-[#3A4F41] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="rsvp-guests"
              className="block text-xs font-semibold tracking-wide text-[#3A4F41] mb-2"
            >
              Jumlah Tamu
            </label>
            <div className="relative">
              <select
                id="rsvp-guests"
                value={status === 'Berhalangan' ? 0 : guests}
                disabled={status === 'Berhalangan'}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full min-h-[44px] border border-[#3A4F41]/25 bg-[#F9F8F4] px-4 py-2.5 text-sm text-[#2C3A30] focus:border-[#3A4F41] focus:outline-none disabled:opacity-50"
              >
                {status === 'Berhalangan' ? (
                  <option value={0}>0 Tamu (Berhalangan)</option>
                ) : (
                  <>
                    <option value={1}>1 Orang</option>
                    <option value={2}>2 Orang</option>
                    <option value={3}>3 Orang</option>
                    <option value={4}>4 Orang</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Attendance Status Selection */}
        <div>
          <span className="block text-xs font-semibold tracking-wide text-[#3A4F41] mb-2">
            Konfirmasi Kehadiran
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Status Kehadiran">
            {(['Hadir', 'Ragu-ragu', 'Berhalangan'] as AttendanceStatus[]).map((option) => {
              const isSelected = status === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setStatus(option)}
                  className={`min-h-[44px] border px-4 py-2.5 text-sm font-medium transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-[#3A4F41] bg-[#3A4F41] text-[#F9F8F4]'
                      : 'border-[#3A4F41]/20 bg-[#F9F8F4] text-[#2C3A30] hover:border-[#3A4F41]/50'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Wishes Textarea */}
        <div>
          <label
            htmlFor="rsvp-message"
            className="block text-xs font-semibold tracking-wide text-[#3A4F41] mb-2"
          >
            Ucapan &amp; Doa Restu
          </label>
          <textarea
            id="rsvp-message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan doa dan ucapan hangat untuk kedua mempelai..."
            className="w-full border border-[#3A4F41]/25 bg-[#F9F8F4] p-4 text-sm text-[#2C3A30] placeholder:text-[#5C7062]/60 focus:border-[#3A4F41] focus:outline-none leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {submittedNotice ? (
            <p className="inline-flex items-center gap-2 text-sm font-medium text-[#3A4F41]">
              <CheckCircle2 className="h-4 w-4 text-[#3A4F41]" aria-hidden="true" />
              <span>Terima kasih! Konfirmasi dan ucapan Anda telah tersimpan.</span>
            </p>
          ) : (
            <p className="text-xs text-[#5C7062]">
              Ucapan yang dikirim akan langsung tampil di buku tamu.
            </p>
          )}

          <button
            type="submit"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-[#3A4F41] px-7 py-3 text-sm font-medium text-[#F9F8F4] transition-colors duration-200 hover:bg-[#28382D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A4F41] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Send className="h-4 w-4 text-[#C5A059]" aria-hidden="true" />
            <span>Kirim Konfirmasi</span>
          </button>
        </div>
      </form>

      {/* Attendance Summary & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#3A4F41]/15 pb-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-[#5C7062] tabular-nums">
            <span className="font-semibold text-[#2C3A30]">
              {wishes.length} Ucapan
            </span>
            <span aria-hidden="true">·</span>
            <span>{counts.attending} Hadir ({counts.totalGuests} Tamu)</span>
            <span aria-hidden="true">·</span>
            <span>{counts.maybe} Ragu-ragu</span>
            <span aria-hidden="true">·</span>
            <span>{counts.absent} Berhalangan</span>
          </div>

          <div className="flex items-center gap-1 bg-[#EFECE3] p-1 self-start md:self-auto">
            {(['Semua', 'Hadir', 'Ragu-ragu', 'Berhalangan'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`min-h-[36px] px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  filter === tab
                    ? 'bg-white text-[#2C3A30] shadow-xs'
                    : 'text-[#5C7062] hover:text-[#2C3A30]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Wishes Feed */}
        {filteredWishes.length === 0 ? (
          <div className="border border-[#3A4F41]/12 bg-white p-8 text-center text-sm text-[#5C7062]">
            Belum ada ucapan untuk kategori ini.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWishes.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-[#3A4F41]/12 p-5 sm:p-6 transition-colors hover:border-[#C5A059]/45"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="font-serif text-lg font-medium text-[#2C3A30]">
                      {item.name}
                    </h4>
                    {renderStatusMeta(item.status)}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#5C7062]">
                    {item.status !== 'Berhalangan' && item.guests > 0 && (
                      <span className="inline-flex items-center gap-1 tabular-nums">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        {item.guests} Tamu
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      {formatRelativeTime(item.createdAt, item.isNew)}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-sm text-[#2C3A30]/85 leading-relaxed">
                  {item.message}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
