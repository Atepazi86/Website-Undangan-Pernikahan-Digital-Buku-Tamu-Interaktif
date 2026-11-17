import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Maximize2, X } from 'lucide-react';
import { GalleryPhoto } from '../data/weddingConfig';

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({ photos }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % photos.length));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev - 1 + photos.length) % photos.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, photos.length]);

  const activePhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {photos.map((photo, idx) => {
          const isFailed = Boolean(failedIds[photo.id]);
          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className="group relative flex flex-col text-left bg-white border border-[#3A4F41]/12 overflow-hidden transition-all duration-300 hover:border-[#C5A059]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A4F41] cursor-pointer"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ECE9DF]">
                {!isFailed ? (
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    referrerPolicy="no-referrer"
                    onError={() => setFailedIds((prev) => ({ ...prev, [photo.id]: true }))}
                    className="h-full w-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#EFECE3] to-[#DCE3D9] p-6 text-center">
                    <ImageIcon className="h-6 w-6 text-[#3A4F41]/60" aria-hidden="true" />
                    <span className="font-serif text-sm text-[#3A4F41]">{photo.title}</span>
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-[#28382D]/0 transition-colors duration-300 group-hover:bg-[#28382D]/20" />

                <span
                  aria-hidden="true"
                  className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center bg-[#F9F8F4]/90 text-[#2C3A30] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                  <Maximize2 className="h-4 w-4" />
                </span>
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 text-xs text-[#5C7062]">
                  <span className="tabular-nums">0{idx + 1} / 0{photos.length}</span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{photo.title}</span>
                </div>
                <p className="mt-1.5 text-sm text-[#2C3A30]/85 line-clamp-2 leading-relaxed">
                  {photo.caption}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhoto && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Tampilan penuh: ${activePhoto.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#19231C]/92 p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative flex w-full max-w-4xl flex-col bg-[#F9F8F4] border border-[#C5A059]/40 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-4 border-b border-[#3A4F41]/12 px-5 py-3.5">
              <div className="min-w-0">
                <p className="font-serif text-lg font-medium text-[#2C3A30] truncate">
                  {activePhoto.title}
                </p>
                <p className="text-xs text-[#5C7062] tabular-nums">
                  Foto {selectedIndex + 1} dari {photos.length}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Tutup pratinjau foto"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center border border-[#3A4F41]/20 text-[#2C3A30] transition-colors hover:bg-[#3A4F41] hover:text-[#F9F8F4] focus-visible:outline-2 focus-visible:outline-[#3A4F41] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Photo Viewport */}
            <div className="relative flex items-center justify-center bg-[#1F2C23] max-h-[70vh] min-h-[280px] overflow-hidden">
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />

              <button
                type="button"
                onClick={() =>
                  setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length)
                }
                aria-label="Foto sebelumnya"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center bg-[#F9F8F4]/90 text-[#2C3A30] transition-colors hover:bg-[#C5A059] cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedIndex((selectedIndex + 1) % photos.length)}
                aria-label="Foto berikutnya"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center bg-[#F9F8F4]/90 text-[#2C3A30] transition-colors hover:bg-[#C5A059] cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Caption Footer */}
            <div className="px-5 py-3.5 text-sm text-[#5C7062] bg-[#F9F8F4]">
              {activePhoto.caption}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
