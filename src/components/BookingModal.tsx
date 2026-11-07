import React, { useState } from 'react';
import { X, MessageCircle, Calendar, Clock, User, Phone, CheckCircle, Car as CarIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Car, ShowroomConfig, BookingDetails } from '../types';
import { formatINR, createWhatsAppBookingUrl } from '../utils/helpers';
import { useLanguage } from '../context/LanguageContext';

interface BookingModalProps {
  car: Car | null;
  config: ShowroomConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  car,
  config,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !car) return null;

  const { t } = useLanguage();
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [visitDate, setVisitDate] = useState('Today');
  const [visitTime, setVisitTime] = useState('4:00 PM');
  const [customNotes, setCustomNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const quickDates = [
    { label: t('booking.quickDateToday'), val: 'Today' },
    { label: t('booking.quickDateTomorrow'), val: 'Tomorrow' },
    { label: t('booking.quickDateSunday'), val: 'Sunday' },
    { label: 'Custom Date', val: 'Custom Date' },
  ];

  const quickTimes = ['11:00 AM', '2:00 PM', '4:00 PM', '6:30 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      return;
    }

    setIsSubmitting(true);

    const booking: BookingDetails = {
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      visitDate,
      visitTime,
      carId: car.id,
      carTitle: car.title,
      carPrice: car.price,
      notes: customNotes.trim(),
    };

    const waUrl = createWhatsAppBookingUrl(config, booking, car);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }

    // Open WhatsApp link
    setTimeout(() => {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header with Car Preview */}
        <div className="bg-[#0B2447] text-white p-5 border-b border-blue-900/50 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-blue-900/80 hover:bg-blue-800 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[#FFC727] text-xs font-bold uppercase tracking-wider mb-1">
            <CarIcon className="w-4 h-4" />
            <span>{t('booking.title')}</span>
          </div>

          <h2 className="text-xl font-extrabold font-heading text-white">
            {car.title}
          </h2>

          <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 font-mono">
            <span className="text-[#FFC727] font-bold text-sm">{formatINR(car.price)}</span>
            <span>·</span>
            <span>{car.registration}</span>
            <span>·</span>
            <span>{car.fuel}</span>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
              {t('booking.yourName')}
            </label>
            <input
              type="text"
              required
              placeholder={t('booking.namePlaceholder')}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2447]"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
              {t('booking.phoneOptional')}
            </label>
            <input
              type="tel"
              placeholder="e.g. 98XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2447]"
            />
          </div>

          {/* Visit Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
              {t('booking.visitDate')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {quickDates.map((d) => (
                <button
                  type="button"
                  key={d.val}
                  onClick={() => setVisitDate(d.val)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    visitDate === d.val
                      ? 'bg-[#0B2447] text-[#FFC727] border-[#0B2447] dark:bg-[#FFC727] dark:text-[#0B2447]'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visit Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
              {t('booking.visitTime')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {quickTimes.map((tm) => (
                <button
                  type="button"
                  key={tm}
                  onClick={() => setVisitTime(tm)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    visitTime === tm
                      ? 'bg-[#0B2447] text-[#FFC727] border-[#0B2447] dark:bg-[#FFC727] dark:text-[#0B2447]'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {tm}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t('booking.notes')}
            </label>
            <textarea
              rows={2}
              placeholder={t('booking.notesPlaceholder')}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0B2447]"
            />
          </div>

          {/* WhatsApp Message Preview Box */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {t('booking.previewTitle')}:
            </span>
            <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
              Hello JK Motors! I am {customerName || '[Your Name]'}. Interested in inspecting *{car.title}* ({formatINR(car.price)}). Preferred Visit Time: {visitDate} at {visitTime}.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !customerName.trim()}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              !customerName.trim()
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-[#25D366] hover:bg-[#20ba5a] text-white active:scale-[0.98] shadow-emerald-950/30'
            }`}
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>{isSubmitting ? 'Opening WhatsApp...' : t('booking.sendWhatsApp')}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
