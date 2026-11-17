import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';
import { WEDDING_CONFIG } from '../data/weddingConfig';

export const VenueMapPreview: React.FC = () => {
  return (
    <div className="border border-[#3A4F41]/15 bg-white overflow-hidden">
      {/* Architectural Stylized Map Canvas */}
      <div className="relative h-64 sm:h-72 w-full bg-[#EFECE3] overflow-hidden">
        <svg
          viewBox="0 0 600 320"
          className="h-full w-full object-cover"
          role="img"
          aria-label="Peta lokasi Gedung Pendopo Agung, Tasikmalaya"
        >
          {/* Base city blocks */}
          <rect width="600" height="320" fill="#EFECE3" />
          <rect x="40" y="30" width="130" height="80" rx="4" fill="#E6E2D5" />
          <rect x="200" y="30" width="170" height="85" rx="4" fill="#DCE3D9" />
          <rect x="405" y="35" width="155" height="75" rx="4" fill="#E6E2D5" />
          <rect x="40" y="145" width="120" height="120" rx="4" fill="#E6E2D5" />
          <rect x="200" y="145" width="180" height="105" rx="4" fill="#D5DFD2" stroke="#3A4F41" strokeOpacity="0.18" />
          <rect x="415" y="145" width="145" height="125" rx="4" fill="#E6E2D5" />

          {/* Road Grid */}
          <path d="M0 128 H600" stroke="#F9F8F4" strokeWidth="14" />
          <path d="M0 272 H600" stroke="#F9F8F4" strokeWidth="10" />
          <path d="M182 0 V320" stroke="#F9F8F4" strokeWidth="14" />
          <path d="M396 0 V320" stroke="#F9F8F4" strokeWidth="12" />

          {/* Secondary streets */}
          <path d="M0 128 H600" stroke="#C5A059" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M182 0 V320" stroke="#C5A059" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="4 4" />

          {/* Park / Alun-alun greenery */}
          <circle cx="285" cy="72" r="24" fill="#B9C9B6" fillOpacity="0.65" />
          <text x="285" y="76" textAnchor="middle" fill="#3A4F41" fontSize="10" fontFamily="Plus Jakarta Sans, sans-serif">
            Alun-Alun Kota
          </text>

          {/* Street labels */}
          <text x="290" y="132" textAnchor="middle" fill="#5C7062" fontSize="10" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
            Jl. Yudanegara No. 28
          </text>
          <text x="182" y="210" textAnchor="middle" fill="#5C7062" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif" transform="rotate(-90 182 210)">
            Jl. Otto Iskandardinata
          </text>
          <text x="396" y="210" textAnchor="middle" fill="#5C7062" fontSize="9" fontFamily="Plus Jakarta Sans, sans-serif" transform="rotate(-90 396 210)">
            Jl. KH. Z. Mustofa
          </text>

          {/* Venue Pin */}
          <g transform="translate(290, 192)">
            <circle cx="0" cy="0" r="22" fill="#3A4F41" fillOpacity="0.14" />
            <circle cx="0" cy="0" r="10" fill="#3A4F41" />
            <circle cx="0" cy="0" r="4" fill="#C5A059" />
          </g>
        </svg>

        {/* Venue Marker Floating Label */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-sm bg-[#F9F8F4]/95 backdrop-blur-sm border border-[#3A4F41]/15 px-4 py-3 flex items-start gap-3">
          <MapPin className="w-4 h-4 text-[#3A4F41] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#2C3A30] truncate">
              {WEDDING_CONFIG.venueName}
            </p>
            <p className="text-xs text-[#5C7062] leading-relaxed">
              {WEDDING_CONFIG.venueAddress}
            </p>
          </div>
        </div>
      </div>

      {/* Location Action Bar */}
      <div className="px-5 py-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#3A4F41]/10">
        <div className="flex items-center gap-2.5 text-xs text-[#5C7062]">
          <Compass className="w-4 h-4 text-[#C5A059] shrink-0" aria-hidden="true" />
          <span className="tabular-nums">7°19&apos;38&quot;S 108°13&apos;12&quot;E · Parkir VIP &amp; Umum Tersedia</span>
        </div>

        <a
          href={WEDDING_CONFIG.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-[#3A4F41] px-5 py-2.5 text-xs sm:text-sm font-medium text-[#F9F8F4] transition-colors duration-200 hover:bg-[#28382D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A4F41] whitespace-nowrap shrink-0"
        >
          <Navigation className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Petunjuk Arah (Google Maps)</span>
        </a>
      </div>
    </div>
  );
};
