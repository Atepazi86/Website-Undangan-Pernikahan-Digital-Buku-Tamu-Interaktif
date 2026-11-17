import React, { useState } from 'react';
import { Check, ChevronDown, Copy, Gift } from 'lucide-react';
import { BankAccount } from '../data/weddingConfig';

interface DigitalEnvelopeProps {
  accounts: BankAccount[];
  onCopySuccess: (message: string) => void;
}

export const DigitalEnvelope: React.FC<DigitalEnvelopeProps> = ({
  accounts,
  onCopySuccess,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (account: BankAccount) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(account.accountNumber);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = account.accountNumber;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(account.id);
      onCopySuccess('Nomor rekening berhasil disalin!');
      window.setTimeout(() => {
        setCopiedId((prev) => (prev === account.id ? null : prev));
      }, 2200);
    } catch {
      onCopySuccess('Salin manual nomor: ' + account.accountNumber);
    }
  };

  return (
    <div className="mx-auto max-w-3xl text-center">
      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
        className="inline-flex min-h-[48px] items-center justify-center gap-2.5 bg-[#3A4F41] px-7 py-3 text-sm font-medium text-[#F9F8F4] transition-colors duration-200 hover:bg-[#28382D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A4F41] whitespace-nowrap cursor-pointer"
      >
        <Gift className="h-4 w-4 text-[#C5A059] shrink-0" aria-hidden="true" />
        <span>Kirim Hadiah</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <div
        className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExpanded ? 'grid-rows-[1fr] opacity-100 mt-8' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {accounts.map((account) => {
              const isSage = account.variant === 'sage';
              const isCopied = copiedId === account.id;

              return (
                <div
                  key={account.id}
                  className={`relative flex flex-col justify-between p-6 sm:p-7 border transition-colors ${
                    isSage
                      ? 'bg-[#3A4F41] text-[#F9F8F4] border-[#3A4F41]'
                      : 'bg-white text-[#2C3A30] border-[#3A4F41]/15'
                  }`}
                >
                  {/* Card Top Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className={`text-xs tracking-wider ${
                          isSage ? 'text-[#C5A059]' : 'text-[#5C7062]'
                        }`}
                      >
                        Transfer Bank
                      </p>
                      <h3 className="mt-1 font-serif text-xl font-medium">
                        {account.bankName}
                      </h3>
                    </div>

                    {/* Minimal EMV Chip SVG */}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 36 26"
                      fill="none"
                      className={`w-9 h-6 shrink-0 ${
                        isSage ? 'text-[#C5A059]/80' : 'text-[#C5A059]'
                      }`}
                    >
                      <rect
                        x="1"
                        y="1"
                        width="34"
                        height="24"
                        rx="4"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <path
                        d="M1 9H12M24 9H35M1 17H12M24 17H35M12 1V25M24 1V25"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeOpacity="0.65"
                      />
                    </svg>
                  </div>

                  {/* Account Number & Holder */}
                  <div className="my-6">
                    <p
                      className={`text-xs ${
                        isSage ? 'text-[#F9F8F4]/70' : 'text-[#5C7062]'
                      }`}
                    >
                      Nomor Rekening
                    </p>
                    <p className="mt-1 font-mono text-2xl tracking-wider font-semibold tabular-nums">
                      {account.accountNumber}
                    </p>
                    <p
                      className={`mt-2 text-sm ${
                        isSage ? 'text-[#F9F8F4]/90' : 'text-[#2C3A30]'
                      }`}
                    >
                      a.n. {account.accountHolder}
                    </p>
                  </div>

                  {/* Copy Action */}
                  <button
                    type="button"
                    onClick={() => handleCopy(account)}
                    className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer ${
                      isSage
                        ? 'bg-[#F9F8F4] text-[#28382D] hover:bg-[#EFECE3] focus-visible:outline-[#F9F8F4]'
                        : 'bg-[#3A4F41] text-[#F9F8F4] hover:bg-[#28382D] focus-visible:outline-[#3A4F41]'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Salin Nomor</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
