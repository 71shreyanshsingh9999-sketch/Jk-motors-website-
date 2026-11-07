import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ShowroomConfig } from '../types';
import { createGeneralWhatsAppChatUrl } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

interface FloatingWhatsAppProps {
  config: ShowroomConfig;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ config }) => {
  const { t } = useLanguage();
  const [showTooltip, setShowTooltip] = useState(true);
  const whatsappUrl = createGeneralWhatsAppChatUrl(config);

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="mb-2 relative bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs py-2 px-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-medium">
            {t('float.tooltip')}
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-slate-900 rotate-45 border-r border-b border-slate-200 dark:border-slate-800" />
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl shadow-emerald-950/40 hover:scale-110 active:scale-95 transition-all group relative cursor-pointer"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFC727] text-[#0B2447] text-[10px] font-extrabold rounded-full flex items-center justify-center">
          1
        </span>
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
};
