import React from 'react';
import { Moon, Sun, MessageCircle, ShieldCheck, PhoneCall, Sparkles, Globe } from 'lucide-react';
import { ShowroomConfig } from '../types';
import { createGeneralWhatsAppChatUrl } from '../utils/helpers';
import { useLanguage, AppLanguage } from '../context/LanguageContext';

interface HeaderProps {
  config: ShowroomConfig;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  darkMode,
  onToggleDarkMode,
  onOpenAdmin,
}) => {
  const whatsappUrl = createGeneralWhatsAppChatUrl(config);
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-[#0B2447] text-white border-b border-blue-950/60 shadow-lg shadow-[#0B2447]/20 backdrop-blur-md">
      {/* Top micro bar for phone & proprietor */}
      <div className="bg-[#061833] text-xs px-3 sm:px-4 py-1.5 flex justify-between items-center text-slate-300 border-b border-blue-900/40">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[#FFC727] font-semibold flex items-center gap-1 text-[11px] sm:text-xs">
            <Sparkles className="w-3 h-3 text-[#FFC727]" />
            {t('header.microBadge')}
          </span>
          <span className="hidden sm:inline text-slate-400">· {t('header.proprietor')} {config.proprietor}</span>
        </div>

        {/* Right side: Phone & Language Quick Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Selector Pills */}
          <div className="flex items-center bg-blue-950/90 rounded-lg p-0.5 border border-blue-800/60 text-[11px] font-bold">
            <span className="px-1.5 text-slate-400 hidden xs:inline flex items-center">
              <Globe className="w-3 h-3 mr-1 text-[#FFC727]" />
            </span>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-1.5 sm:px-2 py-0.5 rounded transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#FFC727] text-[#0B2447] shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="English"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-1.5 sm:px-2 py-0.5 rounded transition-all cursor-pointer ${
                language === 'hi'
                  ? 'bg-[#FFC727] text-[#0B2447] shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Hinglish (Hindi in English Script)"
            >
              Hinglish
            </button>
            <button
              type="button"
              onClick={() => setLanguage('mr')}
              className={`px-1.5 sm:px-2 py-0.5 rounded transition-all cursor-pointer ${
                language === 'mr'
                  ? 'bg-[#FFC727] text-[#0B2447] shadow-sm font-extrabold'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="मराठी (Marathi)"
            >
              मराठी
            </button>
          </div>

          <a
            href={`tel:${config.whatsappNumber}`}
            className="flex items-center gap-1 text-slate-300 hover:text-[#FFC727] transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-[#FFC727]" />
            <span className="font-mono text-[11px] sm:text-xs">{config.whatsappNumber}</span>
          </a>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFC727] to-[#e6b21f] flex items-center justify-center text-[#0B2447] font-extrabold shadow-md shadow-yellow-500/20 group-hover:scale-105 transition-transform shrink-0">
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
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight font-heading text-white">
                {config.name}
              </span>
              <span className="text-xs bg-[#FFC727] text-[#0B2447] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                {config.marathiName}
              </span>
            </div>
            <span className="text-[11px] text-slate-300 tracking-wide hidden sm:block">
              {t('header.subTagline')}
            </span>
          </div>
        </a>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* WhatsApp Direct Chat Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/30 active:scale-95 transition-all"
            title="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className="hidden xs:inline">{t('header.whatsapp')}</span>
          </a>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-xl bg-blue-900/50 hover:bg-blue-900 text-slate-200 hover:text-white flex items-center justify-center transition-colors border border-blue-800/40 cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#FFC727]" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Admin Mode trigger */}
          <button
            onClick={onOpenAdmin}
            aria-label="Admin panel"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-slate-200 hover:text-white text-xs font-medium border border-blue-700/50 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#FFC727]" />
            <span className="hidden sm:inline">{t('header.admin')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
