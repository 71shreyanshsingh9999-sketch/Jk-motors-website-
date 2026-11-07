import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'en' | 'hi' | 'mr';

export interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

export const translations = {
  en: {
    // Header
    'header.microBadge': "Nashik's Most Trusted Pre-Owned Cars Deal",
    'header.proprietor': 'Prop.',
    'header.subTagline': 'Buy & Sales Pre-Owned Cars · Nashik',
    'header.whatsapp': 'WhatsApp',
    'header.admin': 'Admin',
    'header.language': 'Language',

    // Hero
    'hero.badge': 'Verified Quality Cars · Easy Finance Available',
    'hero.titleLine1': 'Your Dream Car,',
    'hero.titleLine2': 'Now in Your Budget!',
    'hero.description': "Nashik's most trusted pre-owned car dealership. Clean paperwork, authentic condition, verified inspections & transparent pricing.",
    'hero.exploreBtn': 'Explore Cars',
    'hero.whatsappBtn': 'Chat on WhatsApp',
    'hero.callBtn': 'Call Showroom',
    'hero.statHappy': 'Happy Families',
    'hero.statStock': 'Cars in Stock',
    'hero.statFinance': 'Easy Finance',
    'hero.statInspection': 'Quality Checks',
    'hero.featuredBadge': 'Featured Arrival',
    'hero.viewDetails': 'View Details',

    // Customer Stories
    'stories.title': 'JK Motors Family · Handover Memories',
    'stories.subtitle': 'Real customer delivery smiles with Naresh Joshi at JK Motors Nashik',
    'stories.watchReels': 'Watch Delivery Reels',

    // Search and Filters
    'filter.searchPlaceholder': 'Search car by brand, model or number (e.g. Innova, Scorpio, MH 15)...',
    'filter.fuelAll': 'All Fuels',
    'filter.diesel': 'Diesel',
    'filter.petrol': 'Petrol',
    'filter.cng': 'CNG',
    'filter.electric': 'Electric',
    'filter.bodyAll': 'All Types',
    'filter.suv': 'SUV',
    'filter.sedan': 'Sedan',
    'filter.hatchback': 'Hatchback',
    'filter.muv': 'MUV',
    'filter.van': 'Van',
    'filter.availableOnly': 'Available Only',
    'filter.allStock': 'All Stock',
    'filter.sortFeatured': 'Featured First',
    'filter.sortPriceLow': 'Price: Low to High',
    'filter.sortPriceHigh': 'Price: High to Low',
    'filter.sortYearNew': 'Model: Newest First',
    'filter.sortKmLow': 'Kilometers: Lowest First',
    'filter.showingCount': 'Showing {count} of {total} Cars',

    // Car Card
    'card.negotiable': 'Negotiable',
    'card.fixed': 'Fixed Price',
    'card.sold': 'SOLD OUT',
    'card.details': 'Details',
    'card.bookNow': 'Book Now',
    'card.soldBtn': 'Sold Out',

    // Car Details Sheet
    'details.share': 'Share',
    'details.linkCopied': 'Link Copied!',
    'details.linkCopiedToast': 'Car link copied! Share with friends or family on WhatsApp.',
    'details.photosTab': 'Photo Gallery',
    'details.videoTab': 'Video Walkthrough',
    'details.videoNotice': '📹 Genuine live video walkthrough by JK Motors proprietor Naresh Joshi. Inspect engine condition, tyres, and interior.',
    'details.askingPrice': 'Asking Price',
    'details.slightlyNegotiable': 'Slightly Negotiable',
    'details.fixedPrice': 'Fixed Price',
    'details.reelTitle': 'Watch Car Walkthrough on Instagram Reel',
    'details.reelSubtitle': 'Follow @jk_motors_nashik for new stock arrivals & customer stories',
    'details.watchReel': 'Watch Reel',
    'details.specsTitle': 'Car Specifications',
    'details.modelYear': 'Model Year',
    'details.kmDriven': 'Kilometers Driven',
    'details.fuelType': 'Fuel Type',
    'details.ownership': 'Ownership',
    'details.passingValidity': 'Passing Validity',
    'details.insuranceStatus': 'Insurance Status',
    'details.transmission': 'Transmission',
    'details.exteriorColor': 'Exterior Color',
    'details.overviewTitle': 'Vehicle Overview & Features',
    'details.emiTitle': 'Easy EMI Calculator',
    'details.financeBadge': 'Up to 80% Finance Available',
    'details.downPayment': 'Down Payment',
    'details.loanTenure': 'Loan Tenure',
    'details.monthlyEmi': 'Estimated Monthly EMI',
    'details.perMonth': '/month',
    'details.interestRate': 'Rate: ~10.5% p.a.',
    'details.loanAmount': 'Loan Amount',
    'details.showroomAddress': 'Showroom Address:',
    'details.showroomTimings': 'Timings:',
    'details.bookOnWhatsApp': 'Book on WhatsApp',
    'details.alreadySold': 'Car Already Sold',

    // Booking Modal
    'booking.title': 'Book Visit / Test Drive on WhatsApp',
    'booking.subtitle': 'Direct message with car model, price, and your preferred visit time slot.',
    'booking.yourName': 'Your Full Name *',
    'booking.namePlaceholder': 'e.g. Rahul Sharma',
    'booking.visitDate': 'Preferred Visit Date *',
    'booking.quickDateToday': 'Today',
    'booking.quickDateTomorrow': 'Tomorrow',
    'booking.quickDateSunday': 'Sunday',
    'booking.visitTime': 'Preferred Time Slot *',
    'booking.phoneOptional': 'Your Mobile Number (Optional)',
    'booking.notes': 'Any Special Questions / Requirements (Optional)',
    'booking.notesPlaceholder': 'e.g. Looking for car finance options / want to take a test drive',
    'booking.previewTitle': 'WhatsApp Message Preview',
    'booking.sendWhatsApp': 'Send Booking on WhatsApp',
    'booking.directCallNotice': 'Or directly call proprietor Naresh Joshi at',

    // Floating WhatsApp
    'float.tooltip': 'Chat with Naresh Joshi on WhatsApp!',

    // Footer
    'footer.tagline': "Nashik's most trusted pre-owned 4-wheeler dealership. Best prices and transparent paper transfer.",
    'footer.proprietor': 'Proprietor',
    'footer.addressHeader': 'Showroom Address',
    'footer.mapsDirections': 'Get directions on Google Maps',
    'footer.timingsHeader': 'Showroom Timings',
    'footer.financeTitle': 'Easy Finance & Loan Facility',
    'footer.contactHeader': 'Direct Contact',
    'footer.callUs': 'Call Us',
    'footer.adminBtn': 'Admin Login & Settings',
    'footer.rights': 'All Rights Reserved.',

    // Empty state
    'empty.title': 'No Cars Found',
    'empty.desc': 'No cars match your search criteria. Try a different search or clear your filters.',
    'empty.resetBtn': 'Reset All Filters',
  },

  hi: {
    // Hinglish (Hindi in Roman script)
    'header.microBadge': 'Nashik Ki Sabse Trusted Pre-Owned Cars Deal',
    'header.proprietor': 'Prop.',
    'header.subTagline': 'Buy & Sales Pre-Owned Cars · Nashik',
    'header.whatsapp': 'WhatsApp',
    'header.admin': 'Admin',
    'header.language': 'Language',

    'hero.badge': 'Verified Cars · Instant Loan & Finance Uplabdh',
    'hero.titleLine1': 'Aapki Dream Gaadi,',
    'hero.titleLine2': 'Ab Budget Mein!',
    'hero.description': 'Nashik ka sabse bharosemand second hand car showroom. Pakka paperwork, original condition aur transparent pricing.',
    'hero.exploreBtn': 'Gaadiyan Dekhein',
    'hero.whatsappBtn': 'WhatsApp Par Baat Karein',
    'hero.callBtn': 'Call Karein',
    'hero.statHappy': 'Khush Parivaar',
    'hero.statStock': 'Gaadiyan Ready',
    'hero.statFinance': 'Easy Finance',
    'hero.statInspection': 'Quality Checks',
    'hero.featuredBadge': 'Khas Gaadi',
    'hero.viewDetails': 'Details Dekhein',

    'stories.title': 'JK Motors Parivaar · Chabi Handover Memories',
    'stories.subtitle': 'Showroom mein chabi lete huye hamare khush customers',
    'stories.watchReels': 'Instagram Reels Dekhein',

    'filter.searchPlaceholder': 'Gaadi search karein (e.g. Innova, Scorpio, MH 15)...',
    'filter.fuelAll': 'Sabhi Fuel',
    'filter.diesel': 'Diesel',
    'filter.petrol': 'Petrol',
    'filter.cng': 'CNG',
    'filter.electric': 'Electric',
    'filter.bodyAll': 'Sabhi Types',
    'filter.suv': 'SUV',
    'filter.sedan': 'Sedan',
    'filter.hatchback': 'Hatchback',
    'filter.muv': 'MUV',
    'filter.van': 'Van',
    'filter.availableOnly': 'Sirf Available',
    'filter.allStock': 'Sabhi Gaadiyan',
    'filter.sortFeatured': 'Featured Pehle',
    'filter.sortPriceLow': 'Kimat: Kam se Jyada',
    'filter.sortPriceHigh': 'Kimat: Jyada se Kam',
    'filter.sortYearNew': 'Model: Naya Pehle',
    'filter.sortKmLow': 'Km: Kam Chali Pehle',
    'filter.showingCount': '{total} me se {count} Gaadiyan uplabdh',

    'card.negotiable': 'Negotiable',
    'card.fixed': 'Fix Price',
    'card.sold': 'SOLD OUT',
    'card.details': 'Details',
    'card.bookNow': 'Book Karein',
    'card.soldBtn': 'Sold Out',

    'details.share': 'Share',
    'details.linkCopied': 'Link Copy Ho Gayi!',
    'details.linkCopiedToast': 'Gaadi ki link copy ho gayi! WhatsApp ya dosto ke sath share karein.',
    'details.photosTab': 'Photos Gallery',
    'details.videoTab': 'Video Walkthrough',
    'details.videoNotice': '📹 Live video walkthrough by JK Motors proprietor Naresh Joshi. Engine aur interior check karein.',
    'details.askingPrice': 'Asking Price',
    'details.slightlyNegotiable': 'Thoda Kam-Jyada Hoga',
    'details.fixedPrice': 'Fix Price',
    'details.reelTitle': 'Instagram Reel Par Gaadi Ka Walkthrough Dekhein',
    'details.reelSubtitle': 'Naye stock aur delivery updates ke liye @jk_motors_nashik follow karein',
    'details.watchReel': 'Reel Dekhein',
    'details.specsTitle': 'Gaadi Ki Jankari (Specs)',
    'details.modelYear': 'Model Saal',
    'details.kmDriven': 'Chali Hui Kms',
    'details.fuelType': 'Fuel Type',
    'details.ownership': 'Malkiyat (Owner)',
    'details.passingValidity': 'Passing Validity',
    'details.insuranceStatus': 'Bima (Insurance)',
    'details.transmission': 'Transmission (Gear)',
    'details.exteriorColor': 'Gaadi Ka Rang',
    'details.overviewTitle': 'Gaadi Ka Overview Aur Features',
    'details.emiTitle': 'Aasan EMI Calculator',
    'details.financeBadge': '80% Tak Loan Uplabdh',
    'details.downPayment': 'Down Payment',
    'details.loanTenure': 'Loan Ka Samay',
    'details.monthlyEmi': 'Andajan Mahina EMI',
    'details.perMonth': '/mahina',
    'details.interestRate': 'Rate: ~10.5% p.a.',
    'details.loanAmount': 'Loan Amount',
    'details.showroomAddress': 'Showroom Ka Pata:',
    'details.showroomTimings': 'Khulne Ka Samay:',
    'details.bookOnWhatsApp': 'WhatsApp Par Booking Bhejein',
    'details.alreadySold': 'Gaadi Bik Chuki Hai',

    'booking.title': 'WhatsApp Par Booking / Test Drive Bhejein',
    'booking.subtitle': 'Direct message mein gaadi ka naam, price aur visit ka time chala jayega.',
    'booking.yourName': 'Aapka Pura Naam *',
    'booking.namePlaceholder': 'e.g. Rahul Sharma',
    'booking.visitDate': 'Kab Aana Chahte Hain? *',
    'booking.quickDateToday': 'Aaj',
    'booking.quickDateTomorrow': 'Kal',
    'booking.quickDateSunday': 'Sunday',
    'booking.visitTime': 'Visit Ka Time *',
    'booking.phoneOptional': 'Aapka Mobile Number (Optional)',
    'booking.notes': 'Koi Sawal / Request (Optional)',
    'booking.notesPlaceholder': 'e.g. Finance ki jankari chahiye / test drive leni hai',
    'booking.previewTitle': 'WhatsApp Message Preview',
    'booking.sendWhatsApp': 'WhatsApp Par Booking Bhejein',
    'booking.directCallNotice': 'Ya seedhe phone lagayein Naresh Joshi ji ko:',

    'float.tooltip': 'Naresh Joshi ji se WhatsApp par baat karein!',

    'footer.tagline': 'Nashik mein sabse bharosemand second-hand 4-wheeler khareedne aur bechne ka thikana.',
    'footer.proprietor': 'Proprietor',
    'footer.addressHeader': 'Showroom Ka Pata',
    'footer.mapsDirections': 'Google Maps par rasta dekhein',
    'footer.timingsHeader': 'Showroom Ka Time',
    'footer.financeTitle': 'Easy Finance & Loan Suvidha',
    'footer.contactHeader': 'Direct Sampark',
    'footer.callUs': 'Call Karein',
    'footer.adminBtn': 'Admin Login & Settings',
    'footer.rights': 'All Rights Reserved.',

    'empty.title': 'Koi Gaadi Nahi Mili',
    'empty.desc': 'Aapke search criteria ke hisab se koi gaadi nahi mili. Kripya doosra naam search karein ya filters hatayein.',
    'empty.resetBtn': 'Sabhi Filters Reset Karein',
  },

  mr: {
    // Marathi
    'header.microBadge': 'नाशिकमधील सर्वात विश्वासू सेकंड हँड गाड्यांचे दालन',
    'header.proprietor': 'प्रोप्रा.',
    'header.subTagline': 'सर्व प्रकारच्या फोर व्हिलर खरेदी आणि विक्री · नाशिक',
    'header.whatsapp': 'WhatsApp',
    'header.admin': 'ॲडमिन',
    'header.language': 'भाषा',

    'hero.badge': 'तपासणी केलेल्या गाड्या · सुलभ फायनान्स उपलब्ध',
    'hero.titleLine1': 'तुमची स्वप्नातील गाडी,',
    'hero.titleLine2': 'आता तुमच्या बजेटमध्ये!',
    'hero.description': 'नाशिकमधील सर्वात विश्वासू सेकंड हँड कार शोरूम. स्वच्छ कागदपत्रे, मूळ कंडिशन आणि पारदर्शक व्यवहार.',
    'hero.exploreBtn': 'गाड्या पहा',
    'hero.whatsappBtn': 'WhatsApp वर थेट बोला',
    'hero.callBtn': 'कॉल करा',
    'hero.statHappy': 'आनंदी ग्राहक',
    'hero.statStock': 'उपलब्ध गाड्या',
    'hero.statFinance': 'सुलभ फायनान्स',
    'hero.statInspection': 'क्वालिटी चेक',
    'hero.featuredBadge': 'खास गाडी',
    'hero.viewDetails': 'माहिती पहा',

    'stories.title': 'जे. के. मोटर्स परिवार · कार डिलिव्हरीच्या आठवणी',
    'stories.subtitle': 'नाशिकच्या ग्राहकांचा जे. के. मोटर्सवर अतूट विश्वास',
    'stories.watchReels': 'Instagram रील्स पहा',

    'filter.searchPlaceholder': 'गाडी शोधा (उदा. Innova, Scorpio, MH 15)...',
    'filter.fuelAll': 'सर्व इंधन',
    'filter.diesel': 'डिझेल',
    'filter.petrol': 'पेट्रोल',
    'filter.cng': 'सीएनजी',
    'filter.electric': 'इलेक्ट्रिक',
    'filter.bodyAll': 'सर्व प्रकार',
    'filter.suv': 'एसयूव्ही',
    'filter.sedan': 'सेडान',
    'filter.hatchback': 'हॅचबॅक',
    'filter.muv': 'एमयूव्ही',
    'filter.van': 'व्हॅन',
    'filter.availableOnly': 'फक्त उपलब्ध',
    'filter.allStock': 'सर्व गाड्या',
    'filter.sortFeatured': 'खास गाड्या प्रथम',
    'filter.sortPriceLow': 'किंमत: कमी ते जास्त',
    'filter.sortPriceHigh': 'किंमत: जास्त ते कमी',
    'filter.sortYearNew': 'वर्ष: नवीन प्रथम',
    'filter.sortKmLow': 'किमी: कमी धावलेली प्रथम',
    'filter.showingCount': 'एकूण {total} पैकी {count} गाड्या',

    'card.negotiable': 'वाटाघाटी शक्य',
    'card.fixed': 'ठरलेली किंमत',
    'card.sold': 'विक्री झाली',
    'card.details': 'माहिती',
    'card.bookNow': 'बुक करा',
    'card.soldBtn': 'विक्री झाली',

    'details.share': 'शेअर करा',
    'details.linkCopied': 'लिंक कॉपी झाली!',
    'details.linkCopiedToast': 'गाडीची लिंक कॉपी झाली! WhatsApp किंवा सोशल मीडियावर शेअर करा.',
    'details.photosTab': 'फोटो गॅलरी',
    'details.videoTab': 'व्हिडिओ वॉकथ्रू',
    'details.videoNotice': '📹 जे. के. मोटर्सचे प्रोप्रा. नरेश जोशी यांच्याकडून थेट व्हिडिओ वॉकथ्रू.',
    'details.askingPrice': 'अपेक्षित किंमत',
    'details.slightlyNegotiable': 'किंचित वाटाघाटी शक्य',
    'details.fixedPrice': 'ठरलेली किंमत',
    'details.reelTitle': 'Instagram Reel वर गाडीचा व्हिडिओ पहा',
    'details.reelSubtitle': 'नवीन स्टॉकच्या माहितीसाठी @jk_motors_nashik फॉलो करा',
    'details.watchReel': 'रील पहा',
    'details.specsTitle': 'गाडीची वैशिष्ट्ये',
    'details.modelYear': 'मॉडेल वर्ष',
    'details.kmDriven': 'धावलेले किमी',
    'details.fuelType': 'इंधन प्रकार',
    'details.ownership': 'मालक',
    'details.passingValidity': 'पासिंग वैधता',
    'details.insuranceStatus': 'विमा',
    'details.transmission': 'गिअर प्रकार',
    'details.exteriorColor': 'गाडीचा रंग',
    'details.overviewTitle': 'गाडीचे वर्णन आणि वैशिष्ट्ये',
    'details.emiTitle': 'सुलभ ईएमआय कॅल्क्युलेटर',
    'details.financeBadge': '८०% पर्यंत फायनान्स उपलब्ध',
    'details.downPayment': 'डाऊन पेमेंट',
    'details.loanTenure': 'कर्जाचा कालावधी',
    'details.monthlyEmi': 'अंदाजे मासिक हप्ता',
    'details.perMonth': '/महिना',
    'details.interestRate': 'व्याजदर: ~१०.५%',
    'details.loanAmount': 'कर्ज रक्कम',
    'details.showroomAddress': 'शोरूम पत्ता:',
    'details.showroomTimings': 'कामाची वेळ:',
    'details.bookOnWhatsApp': 'WhatsApp वर बुकिंग करा',
    'details.alreadySold': 'गाडी विकली गेली आहे',

    'booking.title': 'WhatsApp वर टेस्ट ड्राइव्ह / भेट बुक करा',
    'booking.subtitle': 'थेट मेसेजमध्ये गाडीचे नाव, किंमत आणि भेटीची वेळ पाठवली जाईल.',
    'booking.yourName': 'तुमचे पूर्ण नाव *',
    'booking.namePlaceholder': 'उदा. राहुल पाटील',
    'booking.visitDate': 'भेट देण्याची तारीख *',
    'booking.quickDateToday': 'आज',
    'booking.quickDateTomorrow': 'उद्या',
    'booking.quickDateSunday': 'रविवार',
    'booking.visitTime': 'भेटीची वेळ *',
    'booking.phoneOptional': 'तुमचा मोबाईल नंबर (ऐच्छिक)',
    'booking.notes': 'काही विशेष सूचना (ऐच्छिक)',
    'booking.notesPlaceholder': 'उदा. फायनान्सची माहिती हवी आहे / टेस्ट ड्राईव्ह घ्यायची आहे',
    'booking.previewTitle': 'WhatsApp संदेशाचा पूर्वदृश्य',
    'booking.sendWhatsApp': 'WhatsApp वर बुकिंग पाठवा',
    'booking.directCallNotice': 'किंवा थेट संपर्क साधा प्रोप्रा. नरेश जोशी यांच्याशी:',

    'float.tooltip': 'नरेश जोशी यांच्याशी WhatsApp वर थेट बोला!',

    'footer.tagline': 'नाशिकमधील सर्वात विश्वासू सेकंड हँड फोर-व्हीलर खरेदी आणि विक्रीचे केंद्र.',
    'footer.proprietor': 'प्रोप्रा.',
    'footer.addressHeader': 'शोरूम पत्ता',
    'footer.mapsDirections': 'Google Maps वर दिशानिर्देश मिळवा',
    'footer.timingsHeader': 'कामाची वेळ',
    'footer.financeTitle': 'सुलभ फायनान्स आणि कर्ज सुविधा',
    'footer.contactHeader': 'थेट संपर्क',
    'footer.callUs': 'कॉल करा',
    'footer.adminBtn': 'ॲडमिन लॉगिन व सेटिंग्ज',
    'footer.rights': 'सर्व हक्क राखीव.',

    'empty.title': 'कोणतीही गाडी आढळली नाही',
    'empty.desc': 'तुमच्या शोध निकषांनुसार सध्या कोणतीही गाडी उपलब्ध नाही. कृपया वेगळा शब्द शोधा किंवा फिल्टर्स काढा.',
    'empty.resetBtn': 'सर्व फिल्टर्स रीसेट करा',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // English is the default language as requested
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('jk_language');
    if (saved === 'en' || saved === 'hi' || saved === 'mr') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('jk_language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.en;
    let text = langDict[key as keyof typeof langDict] || translations.en[key as keyof typeof translations.en] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, val]) => {
        text = text.replace(`{${paramKey}}`, String(val));
      });
    }

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
