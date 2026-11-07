import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CustomerStories } from './components/CustomerStories';
import { SearchAndFilters } from './components/SearchAndFilters';
import { CarCard } from './components/CarCard';
import { CarDetailsSheet } from './components/CarDetailsSheet';
import { BookingModal } from './components/BookingModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { Car, ShowroomConfig } from './types';
import { DEFAULT_SHOWROOM_CONFIG, INITIAL_CARS } from './data/defaultCars';
import { fetchAllCars, fetchShowroomSettings } from './services/firebase';
import { Car as CarIcon, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t } = useLanguage();

  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('jk_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Data state
  const [cars, setCars] = useState<Car[]>(INITIAL_CARS);
  const [config, setConfig] = useState<ShowroomConfig>(DEFAULT_SHOWROOM_CONFIG);
  const [loading, setLoading] = useState(true);

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('ALL');
  const [selectedBodyType, setSelectedBodyType] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Modal states
  const [selectedCarForDetails, setSelectedCarForDetails] = useState<Car | null>(null);
  const [selectedCarForBooking, setSelectedCarForBooking] = useState<Car | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Synchronize dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jk_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jk_theme', 'light');
    }
  }, [darkMode]);

  // Load cars and showroom settings on mount
  const loadData = async () => {
    try {
      const [fetchedCars, fetchedConfig] = await Promise.all([
        fetchAllCars(),
        fetchShowroomSettings(),
      ]);
      setCars(fetchedCars);
      setConfig(fetchedConfig);
    } catch (err) {
      console.warn('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle URL deep link (e.g. ?car=car-innova-2010)
  useEffect(() => {
    if (cars.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const carId = params.get('car');
      if (carId) {
        const found = cars.find((c) => c.id === carId);
        if (found) {
          setSelectedCarForDetails(found);
        }
      }
    }
  }, [cars]);

  // Find featured car for hero
  const featuredCar = useMemo(() => {
    return cars.find((c) => c.isFeatured && !c.isSold) || cars.find((c) => !c.isSold) || cars[0];
  }, [cars]);

  // Filtered & Sorted Cars
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.registration.toLowerCase().includes(q) ||
          c.variant.toLowerCase().includes(q)
      );
    }

    // Fuel filter
    if (selectedFuel !== 'ALL') {
      result = result.filter((c) => c.fuel.toLowerCase() === selectedFuel.toLowerCase());
    }

    // Body Type filter
    if (selectedBodyType !== 'ALL') {
      result = result.filter((c) => c.bodyType.toLowerCase() === selectedBodyType.toLowerCase());
    }

    // Only Available filter
    if (showOnlyAvailable) {
      result = result.filter((c) => !c.isSold);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'year-desc') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'km-asc') {
      result.sort((a, b) => a.km - b.km);
    } else {
      // 'featured': available first, then featured, then newest
      result.sort((a, b) => {
        if (a.isSold !== b.isSold) return a.isSold ? 1 : -1;
        if (Boolean(a.isFeatured) !== Boolean(b.isFeatured)) return a.isFeatured ? -1 : 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    }

    return result;
  }, [cars, searchQuery, selectedFuel, selectedBodyType, showOnlyAvailable, sortBy]);

  const scrollToInventory = () => {
    const el = document.getElementById('inventory-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#071326] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 1. Header (Gehra Neela #0B2447, WhatsApp, Dark Mode, Admin) */}
      <Header
        config={config}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 2. Hero Section (Gehra Neela #0B2447, Badi Heading, Peela button, Road stripe, Side car preview) */}
      <Hero
        config={config}
        featuredCar={featuredCar}
        onExploreCars={scrollToInventory}
        onSelectCar={(car) => setSelectedCarForDetails(car)}
      />

      {/* 3. Customer Stories / Delivery Photo Strip */}
      <CustomerStories config={config} />

      {/* 4. Search and Fuel Filter Bar */}
      <SearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFuel={selectedFuel}
        onSelectFuel={setSelectedFuel}
        selectedBodyType={selectedBodyType}
        onSelectBodyType={setSelectedBodyType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showOnlyAvailable={showOnlyAvailable}
        onToggleOnlyAvailable={() => setShowOnlyAvailable((prev) => !prev)}
        totalCount={cars.length}
        filteredCount={filteredCars.length}
      />

      {/* 5. Inventory Grid of Cars */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {filteredCars.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center max-w-md mx-auto border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <CarIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                {t('empty.title')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('empty.desc')}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFuel('ALL');
                setSelectedBodyType('ALL');
                setShowOnlyAvailable(false);
              }}
              className="px-4 py-2 bg-[#0B2447] text-[#FFC727] text-xs font-bold rounded-xl shadow-md cursor-pointer hover:bg-[#061833] transition-all"
            >
              {t('empty.resetBtn')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onOpenDetails={(c) => setSelectedCarForDetails(c)}
                onBookNow={(c) => setSelectedCarForBooking(c)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 6. Car Details Bottom Sheet (Neeche se khulne wali sheet, gallery, video, instagram reel, sticky WhatsApp button) */}
      <CarDetailsSheet
        car={selectedCarForDetails}
        config={config}
        isOpen={Boolean(selectedCarForDetails)}
        onClose={() => setSelectedCarForDetails(null)}
        onBookNow={(car) => {
          setSelectedCarForDetails(null);
          setSelectedCarForBooking(car);
        }}
      />

      {/* 7. WhatsApp Booking Modal (Naam, visit time, price, link, wa.me trigger) */}
      <BookingModal
        car={selectedCarForBooking}
        config={config}
        isOpen={Boolean(selectedCarForBooking)}
        onClose={() => setSelectedCarForBooking(null)}
      />

      {/* 8. Admin Control Panel (Add/Edit car, Sold toggle, settings, Firebase & Deploy guides) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        cars={cars}
        onCarsUpdated={loadData}
        config={config}
        onConfigUpdated={(newCfg) => setConfig(newCfg)}
      />

      {/* 9. Floating WhatsApp Button */}
      <FloatingWhatsApp config={config} />

      {/* 10. Footer (Pata, timing, phone, instagram, maps) */}
      <Footer
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

    </div>
  );
}
