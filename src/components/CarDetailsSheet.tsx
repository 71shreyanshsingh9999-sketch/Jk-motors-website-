import React, { useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Instagram, 
  MessageCircle, 
  ShieldCheck, 
  Calendar, 
  Gauge, 
  Fuel, 
  Users, 
  FileText, 
  CheckCircle2, 
  Calculator, 
  Phone,
  Share2,
  Check
} from 'lucide-react';
import { Car, ShowroomConfig } from '../types';
import { formatINR, formatKm, calculateEMI } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

interface CarDetailsSheetProps {
  car: Car | null;
  config: ShowroomConfig;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (car: Car) => void;
}

export const CarDetailsSheet: React.FC<CarDetailsSheetProps> = ({
  car,
  config,
  isOpen,
  onClose,
  onBookNow,
}) => {
  if (!isOpen || !car) return null;

  const { t } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'photos' | 'video' | 'specs'>('photos');
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenureYears, setTenureYears] = useState(4);
  const [copied, setCopied] = useState(false);

  const images = car.images.length > 0 ? car.images : ['/assets/aistudio/IMG-20261104-WA0006_a918259b.jpg'];
  const calculatedEmi = calculateEMI(car.price, downPaymentPercent, 10.5, tenureYears * 12);
  const downPaymentAmount = Math.round(car.price * (downPaymentPercent / 100));
  const loanAmount = car.price - downPaymentAmount;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const reelUrl = car.reelUrl || config.instagramUrl;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?car=${car.id}`;
    const shareText = `🚗 *${car.title}* (${car.year}) - *${formatINR(car.price)}*\n⛽ ${car.fuel} · 🛣️ ${formatKm(car.km)} · 📋 ${car.registration}\n📍 JK Motors Nashik (Prop. ${config.proprietor})\nEasy finance & clean paperwork available!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${car.title} (${car.year}) | JK Motors Nashik`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          console.warn('Share error or cancelled:', err);
        }
      }
    }

    // Fallback: Clipboard copy
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n👉 View Car: ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Neeche se khulne wali sheet */}
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in slide-in-from-bottom duration-300 border-t border-slate-200 dark:border-slate-800">
        
        {/* Grab Handle Header */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>

          <div className="flex items-center gap-2">
            {/* Share Button (Web Share API) */}
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:hover:bg-blue-900/80 text-[#0B2447] dark:text-[#FFC727] text-xs font-bold flex items-center gap-1.5 transition-all border border-blue-200/70 dark:border-blue-900/70 cursor-pointer active:scale-95"
              title="Share Car link to WhatsApp / Social apps"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">{t('details.linkCopied')}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{t('details.share')}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Link Copied Floating Notification Toast */}
        {copied && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-[#0B2447] text-[#FFC727] text-xs font-bold px-4 py-2 rounded-full shadow-xl border border-[#FFC727]/30 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 pointer-events-none">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{t('details.linkCopiedToast')}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 pb-28">
          
          {/* Main Visual Display (Gallery or Video) */}
          <div className="space-y-3">
            {/* View Tab Switcher if video exists */}
            {car.videoUrl && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'photos'
                      ? 'bg-white dark:bg-slate-900 text-[#0B2447] dark:text-[#FFC727] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {t('details.photosTab')} ({images.length})
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'video'
                      ? 'bg-white dark:bg-slate-900 text-[#0B2447] dark:text-[#FFC727] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current text-red-500" />
                  <span>{t('details.videoTab')}</span>
                </button>
              </div>
            )}

            {/* Photos View */}
            {activeTab === 'photos' && (
              <div>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-md">
                  <img
                    src={images[activeImageIndex]}
                    alt={`${car.title} photo ${activeImageIndex + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain sm:object-cover"
                  />

                  {/* Peela price tag */}
                  <div className="absolute top-3 left-0 price-tag-cut bg-[#FFC727] text-[#0B2447] font-extrabold text-base px-3.5 py-1.5 shadow-lg">
                    {formatINR(car.price)}
                  </div>

                  {/* Navigation arrows if multiple images */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image counter indicator */}
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-mono text-white">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnails row */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar py-1">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-[#FFC727] scale-105'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Video View */}
            {activeTab === 'video' && car.videoUrl && (
              <div className="space-y-2">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                  <video
                    src={car.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('details.videoNotice')}
                </p>
              </div>
            )}
          </div>

          {/* Car Header & Price Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-[#0B2447] text-white dark:bg-[#FFC727] dark:text-[#0B2447] font-bold px-2 py-0.5 rounded">
                  {car.brand}
                </span>
                <span className="text-xs font-mono text-slate-500 font-semibold">
                  {car.registration}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white mt-1">
                {car.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {car.variant}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('details.askingPrice')}</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0B2447] dark:text-[#FFC727]">
                {formatINR(car.price)}
              </div>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {car.priceNegotiable ? t('details.slightlyNegotiable') : t('details.fixedPrice')}
              </span>
            </div>
          </div>

          {/* Instagram Reel Button */}
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-amber-950/20 p-3.5 rounded-2xl border border-pink-200 dark:border-pink-900/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-md shrink-0">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {t('details.reelTitle')}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {t('details.reelSubtitle')}
                </p>
              </div>
            </div>

            <a
              href={reelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>{t('details.watchReel')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Quick Specs Grid */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white uppercase tracking-wider">
              {t('details.specsTitle')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                  {t('details.modelYear')}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {car.year}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                  {t('details.kmDriven')}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatKm(car.km)}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                  {t('details.fuelType')}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {car.fuel}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                  {t('details.ownership')}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {car.owners}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                  {t('details.passingValidity')}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {car.passingValidUntil}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                  {t('details.insuranceStatus')}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {car.insurance}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{t('details.transmission')}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {car.transmission}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{t('details.exteriorColor')}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  {car.color}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Features */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white uppercase tracking-wider">
              {t('details.overviewTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
              {car.description}
            </p>

            {car.features && car.features.length > 0 && (
              <div className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {car.features.map((feat, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FFC727] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Loan / EMI Calculator Widget */}
          {!car.isSold && (
            <div className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#0B2447] dark:text-[#FFC727]" />
                  <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                    {t('details.emiTitle')}
                  </h3>
                </div>
                <span className="text-xs bg-[#FFC727] text-[#0B2447] font-bold px-2 py-0.5 rounded">
                  {t('details.financeBadge')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                    <span>{t('details.downPayment')} ({downPaymentPercent}%):</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{formatINR(downPaymentAmount)}</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-[#0B2447] dark:accent-[#FFC727] cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                    <span>{t('details.loanTenure')}:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{tenureYears} Years ({tenureYears * 12} Months)</strong>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={tenureYears}
                    onChange={(e) => setTenureYears(Number(e.target.value))}
                    className="w-full accent-[#0B2447] dark:accent-[#FFC727] cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-xl flex items-center justify-between border border-blue-100 dark:border-blue-900/50">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{t('details.monthlyEmi')}:</span>
                  <div className="text-xl font-extrabold text-[#0B2447] dark:text-[#FFC727]">
                    ₹{calculatedEmi.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-500">{t('details.perMonth')}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 text-right">
                  {t('details.interestRate')}<br />
                  {t('details.loanAmount')}: {formatINR(loanAmount)}
                </span>
              </div>
            </div>
          )}

          {/* Showroom Visit Information */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl text-xs space-y-1 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
            <p className="font-semibold text-slate-900 dark:text-white">📍 {t('details.showroomAddress')}</p>
            <p>{config.address}</p>
            <p className="mt-1">⏰ {t('details.showroomTimings')} {config.timings}</p>
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 sm:gap-3">
          {/* Call button */}
          <a
            href={`tel:${config.whatsappNumber}`}
            className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition-colors flex items-center justify-center shrink-0"
            title="Call Showroom"
          >
            <Phone className="w-5 h-5" />
          </a>

          {/* Share button in bottom bar */}
          <button
            onClick={handleShare}
            className="p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/70 dark:hover:bg-blue-900/80 text-[#0B2447] dark:text-[#FFC727] rounded-xl transition-all flex items-center justify-center shrink-0 border border-blue-200/80 dark:border-blue-900/80 cursor-pointer active:scale-95"
            title="Share Car link"
          >
            {copied ? (
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
          </button>

          {/* WhatsApp Booking CTA */}
          <button
            onClick={() => onBookNow(car)}
            disabled={car.isSold}
            className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              car.isSold
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-[#25D366] hover:bg-[#20ba5a] text-white active:scale-[0.98] shadow-emerald-950/20'
            }`}
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>
              {car.isSold ? t('details.alreadySold') : t('details.bookOnWhatsApp')}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
