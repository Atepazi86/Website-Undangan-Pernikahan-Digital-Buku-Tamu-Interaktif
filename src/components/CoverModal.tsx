import React, { useState } from 'react';
import { MailOpen } from 'lucide-react';
import { WEDDING_CONFIG } from '../data/weddingConfig';
import { CornerOrnament } from './BotanicalOrnaments';

interface CoverModalProps {
  guestName: string;
  isOpen: boolean;
  onOpenInvitation: () => void;
}

export const CoverModal: React.FC<CoverModalProps> = ({
  guestName,
  isOpen,
  onOpenInvitation,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      role="dialog"
      aria-modal={isOpen}
      aria-label="Sampul Undangan Pernikahan"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#28382D] text-[#F9F8F4] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isOpen ? 'translate-y-0' : '-translate-y-full pointer-events-none'
      }`}
    >
      {/* Background Editorial Image with Scrim */}
      <div className="absolute inset-0 overflow-hidden">
        {!imgFailed && (
          <img
            src={WEDDING_CONFIG.heroImage}
            alt={WEDDING_CONFIG.coupleShort}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-center opacity-40 scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#28382D]/80 via-[#28382D]/70 to-[#1F2C23]/95" />
      </div>

      {/* Framed Stationery Card */}
      <div className="relative z-10 mx-4 w-full max-w-lg border border-[#C5A059]/40 bg-[#28382D]/75 px-6 py-10 sm:px-12 sm:py-14 backdrop-blur-md text-center shadow-2xl">
        <CornerOrnament position="top-left" className="w-12 h-12 sm:w-14 sm:h-14 text-[#C5A059]/80" />
        <CornerOrnament position="top-right" className="w-12 h-12 sm:w-14 sm:h-14 text-[#C5A059]/80" />
        <CornerOrnament position="bottom-left" className="w-12 h-12 sm:w-14 sm:h-14 text-[#C5A059]/80" />
        <CornerOrnament position="bottom-right" className="w-12 h-12 sm:w-14 sm:h-14 text-[#C5A059]/80" />

        <p className="text-xs sm:text-sm tracking-[0.22em] text-[#C5A059] font-medium">
          Undangan {WEDDING_CONFIG.eventType}
        </p>

        <h1 className="mt-4 font-serif text-4xl sm:text-6xl font-medium tracking-tight text-[#F9F8F4]">
          {WEDDING_CONFIG.coupleShort}
        </h1>

        <p className="mt-3 text-sm text-[#F9F8F4]/80 tracking-wide">
          {WEDDING_CONFIG.eventDateDisplay} · Tasikmalaya
        </p>

        <div className="my-7 h-px w-24 mx-auto bg-[#C5A059]/45" aria-hidden="true" />

        <div className="space-y-1.5">
          <p className="text-xs sm:text-sm text-[#F9F8F4]/75">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <p className="font-serif text-xl sm:text-2xl text-[#F9F8F4] font-medium tracking-wide">
            {guestName}
          </p>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={onOpenInvitation}
            className="inline-flex min-h-[48px] items-center justify-center gap-2.5 bg-[#C5A059] px-7 py-3 text-sm font-semibold text-[#1F2C23] transition-colors duration-200 hover:bg-[#D4B26E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C5A059] active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            <MailOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
