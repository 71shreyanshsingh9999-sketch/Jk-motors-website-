import React from 'react';
import { Play, Calendar, Gauge, Fuel, Eye, MessageCircle } from 'lucide-react';
import { Car } from '../types';
import { formatINR, formatKm, calculateEMI } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

interface CarCardProps {
  car: Car;
  onOpenDetails: (car: Car) => void;
  onBookNow: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  onOpenDetails,
  onBookNow,
}) => {
  const { t } = useLanguage();
  const primaryImage = car.images[0] || '/assets/aistudio/IMG-20261104-WA0006_a918259b.jpg';
  const emiAmount = calculateEMI(car.price);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Top Image Container */}
      <div 
        className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
        onClick={() => onOpenDetails(car)}
      >
        <img
          src={primaryImage}
          alt={car.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
            car.isSold ? 'grayscale contrast-125 opacity-75' : ''
          }`}
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Peela Price-Tag (Left Kata Hua) requested by user: "photo par peela price-tag (left kata hua)" */}
        <div className="absolute top-3 left-0 price-tag-cut bg-[#FFC727] text-[#0B2447] font-extrabold text-sm sm:text-base px-3.5 py-1.5 shadow-lg flex items-center gap-1 z-10">
          <span>{formatINR(car.price)}</span>
          {car.priceNegotiable && !car.isSold && (
            <span className="text-[10px] font-semibold text-[#0B2447]/80 ml-0.5">({t('card.negotiable')})</span>
          )}
        </div>

        {/* Video Walkthrough Indicator */}
        {car.videoUrl && (
          <div className="absolute top-3 right-3 z-10 bg-black/75 hover:bg-black text-[#FFC727] px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-[#FFC727]/40 flex items-center gap-1">
            <Play className="w-3 h-3 fill-[#FFC727]" />
            <span className="text-[11px]">Video</span>
          </div>
        )}

        {/* SOLD Overlay */}
        {car.isSold && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-20">
            <div className="rotate-[-12deg] border-4 border-red-500 bg-red-600/90 text-white font-extrabold text-xl sm:text-2xl px-6 py-1.5 rounded-lg shadow-2xl tracking-widest uppercase">
              {t('card.sold')}
            </div>
          </div>
        )}

        {/* Bottom bar inside photo: Registration number & Photo count */}
        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-xs text-white z-10">
          <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded font-mono text-[11px] font-semibold text-slate-200 border border-white/10">
            {car.registration}
          </span>
          {car.images.length > 1 && (
            <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-slate-200">
              {car.images.length} photos
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title and Brand */}
          <div className="flex items-start justify-between gap-2">
            <h3 
              onClick={() => onOpenDetails(car)}
              className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#0B2447] dark:group-hover:text-[#FFC727] transition-colors cursor-pointer line-clamp-1"
            >
              {car.title}
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {car.variant}
          </p>

          {/* Chips: Year, Km, Fuel, Owners */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Calendar className="w-3 h-3 text-[#0B2447] dark:text-[#FFC727]" />
              {car.year}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Gauge className="w-3 h-3 text-[#0B2447] dark:text-[#FFC727]" />
              {formatKm(car.km)}
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Fuel className="w-3 h-3 text-[#0B2447] dark:text-[#FFC727]" />
              {car.fuel}
            </span>

            <span className="text-[11px] font-medium px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#0B2447] dark:text-blue-300">
              {car.owners}
            </span>
          </div>

          {/* Passing & EMI hint */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate">
              Passing: <strong className="text-slate-700 dark:text-slate-300 font-normal">{car.passingValidUntil}</strong>
            </span>
            {!car.isSold && (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold shrink-0">
                EMI ₹{emiAmount.toLocaleString('en-IN')}/mo
              </span>
            )}
          </div>
        </div>

        {/* Two Action Buttons: "Details" and "Book Now" */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Details button */}
          <button
            onClick={() => onOpenDetails(car)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#0B2447] dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('card.details')}</span>
          </button>

          {/* Book Now button */}
          <button
            onClick={() => onBookNow(car)}
            disabled={car.isSold}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
              car.isSold
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-[#FFC727] hover:bg-[#e6b21f] text-[#0B2447] active:scale-95 shadow-yellow-500/20'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 fill-[#0B2447]" />
            <span>{car.isSold ? t('card.soldBtn') : t('card.bookNow')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
