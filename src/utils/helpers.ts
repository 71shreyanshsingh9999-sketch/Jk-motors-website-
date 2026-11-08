import { Car, BookingDetails, ShowroomConfig } from '../types';

export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
}

export function formatKm(km: number): string {
  if (isNaN(km)) return '0 km';
  return km.toLocaleString('en-IN') + ' km';
}

export function formatPriceLakh(amount: number): string {
  if (amount >= 100000) {
    const lakhs = (amount / 100000).toFixed(2);
    return `₹${lakhs.replace(/\.00$/, '')} Lakh`;
  }
  return formatINR(amount);
}

export function calculateEMI(principal: number, downPaymentPercent = 20, annualRate = 10.5, tenureMonths = 48): number {
  const loanAmount = principal * (1 - downPaymentPercent / 100);
  if (loanAmount <= 0) return 0;
  const monthlyRate = annualRate / 12 / 100;
  const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi);
}

export function createWhatsAppBookingUrl(
  config: ShowroomConfig,
  booking: BookingDetails,
  car?: Car
): string {
  const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, '');
  const phone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  
  const siteUrl = window.location.origin + window.location.pathname;
  const carLink = car ? `${siteUrl}?car=${car.id}` : siteUrl;

  const textLines = [
    `🚗 *Gaadi Booking / Inquiry - JK Motors Nashik*`,
    `--------------------------------------`,
    `👤 *Naam (Name):* ${booking.customerName}`,
    booking.phoneNumber ? `📞 *Phone:* ${booking.phoneNumber}` : null,
    `📅 *Showroom Visit Time:* ${booking.visitDate} - ${booking.visitTime}`,
    ``,
    `🚘 *Pasand ki hui Gaadi (Car Details):*`,
    `• *Model:* ${booking.carTitle}`,
    `• *Price:* ${formatINR(booking.carPrice)}`,
    car ? `• *Reg / Year:* ${car.registration} (${car.year})` : null,
    car ? `• *Fuel / Km:* ${car.fuel} · ${formatKm(car.km)}` : null,
    ``,
    `🔗 *Gaadi ka Link:* ${carLink}`,
    booking.notes ? `📝 *Note:* ${booking.notes}` : null,
    ``,
    `Namaste Naresh sir! Kripya confirm karein ki ye gaadi available hai aur test drive ka time confirm karein. Dhanyawad! 🙏`,
  ].filter(Boolean);

  const fullText = textLines.join('\n');
  return `https://wa.me/${phone}?text=${encodeURIComponent(fullText)}`;
}

export function createGeneralWhatsAppChatUrl(config: ShowroomConfig, customText?: string): string {
  const cleanPhone = config.whatsappNumber.replace(/[^0-9]/g, '');
  const phone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const defaultText = `Namaste Naresh sir! 🙏 Main JK Motors Nashik ki website dekh raha hoon. Mujhe pre-owned gaadiyon ki availability aur finance ke baare mein jaankari chahiye.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(customText || defaultText)}`;
}

/**
 * Resolves static asset paths (like car images and videos) accurately across all environments.
 * Works seamlessly on GitHub Pages subpaths (https://username.github.io/repo-name/),
 * root custom domains, and local preview servers.
 */
export function getAssetUrl(path: string | undefined | null): string {
  if (!path) return '';
  // Keep external URLs or data/blob URIs untouched
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }
  // Strip leading slash if any
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Use Vite's BASE_URL (defaults to './' with base: './')
  const base = import.meta.env.BASE_URL || './';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${cleanPath}`;
}

