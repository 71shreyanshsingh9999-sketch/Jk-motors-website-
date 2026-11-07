import React from 'react';
import { MessageCircle, ArrowDown, Award, Banknote, Play, CheckCircle2 } from 'lucide-react';
import { Car, ShowroomConfig } from '../types';
import { formatINR, createGeneralWhatsAppChatUrl } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  config: ShowroomConfig;
  featuredCar?: Car;
  onExploreCars: () => void;
  onSelectCar: (car: Car) => void;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  featuredCar,
  onExploreCars,
  onSelectCar,
}) => {
  const whatsappUrl = createGeneralWhatsAppChatUrl(config);
  const { t } = useLanguage();

  return (
    <section className="relative bg-[#0B2447] text-white overflow-hidden pt-6 pb-0 sm:pt-10">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#FFC727]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 sm:pb-12">
          {/* Left Column: Bold Titles & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/50 text-[#FFC727] text-xs sm:text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#FFC727] animate-ping" />
              <span>{t('hero.badge')}</span>
            </div>

            {/* Badi Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
              {t('hero.titleLine1')}{' '}
              <span className="text-[#FFC727] relative inline-block">
                {t('hero.titleLine2')}
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-[#FFC727]/40"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </h1>

            {/* Subtitle / Tagline */}
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t('hero.description')}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              {/* "Explore Cars" button (peela) */}
              <button
                onClick={onExploreCars}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#FFC727] hover:bg-[#e6b21f] text-[#0B2447] font-bold text-base rounded-xl shadow-lg shadow-yellow-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t('hero.exploreBtn')}</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </button>

              {/* "WhatsApp Chat" button (hara) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-900/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{t('hero.whatsappBtn')}</span>
              </a>
            </div>

            {/* Key trust badges */}
            <div className="pt-4 border-t border-blue-900/40 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFC727] shrink-0" />
                <span className="text-xs text-slate-300 font-medium">{t('hero.statInspection')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-[#FFC727] shrink-0" />
                <span className="text-xs text-slate-300 font-medium">{t('hero.statFinance')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#FFC727] shrink-0" />
                <span className="text-xs text-slate-300 font-medium">{t('hero.statHappy')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Latest / Featured Car Card */}
          <div className="lg:col-span-5">
            {featuredCar ? (
              <div className="relative bg-slate-900/80 rounded-2xl border border-blue-800/50 p-3 sm:p-4 shadow-2xl backdrop-blur-sm group hover:border-[#FFC727]/60 transition-all">
                {/* Featured kicker tag */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold tracking-wider text-[#FFC727] uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FFC727]" />
                    {t('hero.featuredBadge')}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {featuredCar.registration}
                  </span>
                </div>

                {/* Car Image with angled price tag */}
                <div 
                  className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 cursor-pointer"
                  onClick={() => onSelectCar(featuredCar)}
                >
                  <img
                    src={featuredCar.images[0] || '/assets/aistudio/IMG-20261104-WA0006_a918259b.jpg'}
                    alt={featuredCar.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Peela Price Tag (left kata hua / chamfered) */}
                  <div className="absolute top-3 left-0 price-tag-cut bg-[#FFC727] text-[#0B2447] font-extrabold text-sm sm:text-base px-3.5 py-1.5 shadow-lg flex items-center gap-1">
                    <span>{formatINR(featuredCar.price)}</span>
                  </div>

                  {/* Video Walkthrough indicator if video is present */}
                  {featuredCar.videoUrl && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/75 hover:bg-black text-[#FFC727] px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-[#FFC727]/30">
                      <Play className="w-3.5 h-3.5 fill-[#FFC727]" />
                      <span>{t('details.videoTab')}</span>
                    </div>
                  )}

                  {/* Passing badge */}
                  <div className="absolute bottom-3 left-3 text-xs text-white font-medium bg-blue-950/80 px-2 py-0.5 rounded backdrop-blur-sm border border-blue-800/50">
                    Passing: {featuredCar.passingValidUntil}
                  </div>
                </div>

                {/* Car Info footer */}
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                      {featuredCar.title}
                    </h3>
                    <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                      <span>{featuredCar.year}</span>
                      <span>·</span>
                      <span>{featuredCar.fuel}</span>
                      <span>·</span>
                      <span>{featuredCar.km.toLocaleString('en-IN')} km</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCar(featuredCar)}
                    className="px-3.5 py-2 bg-[#FFC727] hover:bg-[#e6b21f] text-[#0B2447] rounded-lg text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    {t('hero.viewDetails')}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Peeli Road Stripe (Dashed Line) requested by user: "neeche peeli road-stripe (dashed line)" */}
      <div className="w-full relative h-3 bg-[#061833] flex items-center">
        <div className="w-full h-1 road-stripe-animated opacity-90 shadow-sm" />
      </div>
    </section>
  );
};
