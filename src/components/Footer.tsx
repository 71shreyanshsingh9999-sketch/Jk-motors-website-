import React from 'react';
import { MapPin, Clock, Phone, MessageCircle, Instagram, ShieldCheck, Sparkles, Navigation } from 'lucide-react';
import { ShowroomConfig } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  config: ShowroomConfig;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenAdmin }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0B2447] text-white border-t border-blue-950 pt-12 pb-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        
        {/* Col 1: Showroom Brand & Tagline */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC727] to-[#e6b21f] flex items-center justify-center text-[#0B2447] font-extrabold shadow-md shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 shrink-0"
                style={{ width: '24px', height: '24px', minWidth: '24px', maxWidth: '24px' }}
              >
                {/* Crown on top */}
                <path d="M5 4.5L7.5 7L12 3.5L16.5 7L19 4.5L18 9H6L5 4.5Z" fill="#0B2447" />
                {/* Shield Body */}
                <path d="M4.5 9.5C4.5 9.5 4.5 16 12 21C19.5 16 19.5 9.5 19.5 9.5H4.5Z" fill="#0B2447" />
                {/* Letters JK inside */}
                <text x="12" y="16.2" textAnchor="middle" fill="#FFC727" fontSize="7" fontWeight="900" fontFamily="sans-serif">JK</text>
              </svg>
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-white">
                {config.name}
              </h3>
              <p className="text-xs text-[#FFC727] font-semibold">{config.marathiName}</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {config.tagline}. {t('footer.tagline')}
          </p>

          <div className="text-xs text-slate-400">
            <strong>{t('footer.proprietor')}: {config.proprietor}</strong>
          </div>
        </div>

        {/* Col 2: Showroom Address & Google Maps */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-[#FFC727] uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{t('footer.addressHeader')}</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {config.address}
          </p>
          <a
            href={config.mapLocationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#FFC727] hover:underline font-semibold"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{t('footer.mapsDirections')}</span>
          </a>
        </div>

        {/* Col 3: Timing & Working Hours */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-[#FFC727] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{t('footer.timingsHeader')}</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {config.timings}
          </p>
          <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-900/50 text-xs text-slate-300 space-y-1">
            <p className="text-[#FFC727] font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {t('footer.financeTitle')}
            </p>
            <p className="text-[11px] text-slate-400">
              {config.financePartner}
            </p>
          </div>
        </div>

        {/* Col 4: Contact & Social */}
        <div className="space-y-3">
          <h4 className="font-heading font-bold text-sm text-[#FFC727] uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-4 h-4" />
            <span>{t('footer.contactHeader')}</span>
          </h4>
          
          <div className="space-y-2 text-xs">
            <a
              href={`https://wa.me/91${config.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-200 hover:text-[#25D366] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp: <strong>+91 {config.whatsappNumber}</strong></span>
            </a>

            <a
              href={`tel:${config.callNumber}`}
              className="flex items-center gap-2 text-slate-200 hover:text-[#FFC727] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#FFC727]" />
              <span>{t('footer.callUs')}: <strong>+91 {config.callNumber}</strong></span>
            </a>

            <a
              href={config.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-200 hover:text-pink-400 transition-colors pt-1"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Instagram: <strong>@jk_motors_nashik</strong></span>
            </a>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-xs text-slate-300 hover:text-white border border-blue-800/40 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFC727]" />
              <span>{t('footer.adminBtn')}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Copyright & Road stripe */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <p>© {new Date().getFullYear()} {config.name} ({config.marathiName}), Nashik. {t('footer.rights')}</p>
        <p className="flex items-center gap-1 text-slate-400">
          JK Motors Nashik · Trusted Pre-Owned Car Showroom
        </p>
      </div>
    </footer>
  );
};
