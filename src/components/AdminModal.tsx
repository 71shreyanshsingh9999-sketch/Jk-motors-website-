import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Lock, 
  Save, 
  Settings, 
  Car as CarIcon, 
  Eye, 
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Play,
  Instagram,
  Fuel,
  Gauge,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Car, ShowroomConfig, FirebaseConfigState, FuelType, BodyType, TransmissionType } from '../types';
import { formatINR, formatKm } from '../utils/helpers';
import { 
  upsertCar, 
  removeCar, 
  toggleCarSold, 
  saveShowroomSettings, 
  saveFirebaseCredentials,
  getSavedFirebaseConfig
} from '../services/firebase';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  cars: Car[];
  onCarsUpdated: () => void;
  config: ShowroomConfig;
  onConfigUpdated: (newConfig: ShowroomConfig) => void;
}

const PRESET_SHOWROOM_PHOTOS = [
  '/assets/aistudio/IMG-20261104-WA0006_a918259b.jpg',
  '/assets/aistudio/IMG-20261104-WA0008_f6e50e39.jpg',
  '/assets/aistudio/IMG-20261104-WA0007_91da812e.jpg',
  '/assets/aistudio/IMG-20261104-WA0009_04766760.jpg',
  '/assets/aistudio/IMG-20261104-WA0010_119a8d12.jpg',
  '/assets/aistudio/IMG-20261104-WA0003_b7ac20e2.jpg',
  '/assets/aistudio/IMG-20261104-WA0004_a28823c9.jpg',
  '/assets/aistudio/IMG-20261104-WA0002_9ea5637b.jpg',
];

const PRESET_SHOWROOM_VIDEOS = [
  { label: 'Toyota Innova 2010 Walkthrough (Naresh Joshi)', url: '/assets/aistudio/VID-20261104-WA0016_ea2651b3.mp4' },
  { label: 'Mahindra Scorpio 2013 Walkthrough (Naresh Joshi)', url: '/assets/aistudio/VID-20261104-WA0027_ab370dda.mp4' },
  { label: 'Customer Car Delivery Celebration Video', url: '/assets/aistudio/VID-20261104-WA0022_238eef52.mp4' },
];

const POPULAR_BRANDS = [
  'Maruti Suzuki',
  'Hyundai',
  'Mahindra',
  'Tata',
  'Toyota',
  'Honda',
  'Kia',
  'Renault',
  'Ford',
  'Volkswagen'
];

const COMMON_FEATURES = [
  'Power Steering',
  'All Power Windows',
  'Chilled AC',
  'Dual Airbags',
  'ABS with EBD',
  'Touchscreen Infotainment',
  'Reverse Parking Camera',
  'Alloy Wheels',
  'Central Locking',
  'Push Button Start',
  'Steering Audio Controls',
  'Yokohama Tyres'
];

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  cars,
  onCarsUpdated,
  config,
  onConfigUpdated,
}) => {
  if (!isOpen) return null;

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('jk_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'cars' | 'settings' | 'deploy'>('cars');

  // Car Edit / Add Form State
  const [editingCar, setEditingCar] = useState<Partial<Car> | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [customFeatureInput, setCustomFeatureInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<ShowroomConfig>(config);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Firebase Config Form State
  const [firebaseConfig, setFirebaseConfig] = useState<FirebaseConfigState>(getSavedFirebaseConfig());
  const [firebaseStatusMsg, setFirebaseStatusMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim().toLowerCase() === 'jkadmin' || pinInput.trim() === '7020') {
      setIsAuthenticated(true);
      sessionStorage.setItem('jk_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid password! Please use "jkadmin" or "7020".');
    }
  };

  const handleQuickDemoLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('jk_admin_auth', 'true');
    setAuthError('');
  };

  const startAddNewCar = () => {
    setEditingCar({
      id: 'car-' + Date.now(),
      title: '',
      brand: 'Maruti Suzuki',
      model: '',
      variant: '',
      year: new Date().getFullYear() - 5,
      price: 450000,
      priceNegotiable: true,
      km: 45000,
      fuel: 'Petrol',
      transmission: 'Manual',
      bodyType: 'Hatchback',
      owners: '1st Owner',
      registration: 'MH 15 XX 0000',
      passingValidUntil: `${new Date().getFullYear() + 10} Valid`,
      insurance: 'Comprehensive Valid',
      color: 'White',
      isSold: false,
      isFeatured: false,
      images: [PRESET_SHOWROOM_PHOTOS[0]],
      videoUrl: PRESET_SHOWROOM_VIDEOS[0].url,
      reelUrl: config.instagramUrl,
      features: ['Power Steering', 'Chilled AC', 'All Power Windows', 'Central Locking'],
      description: 'Excellent showroom condition, original company paint, zero accidental history, immediate loan and paper transfer available.',
      createdAt: Date.now(),
    });
    setCustomPhotoUrl('');
    setCustomFeatureInput('');
    setIsAddingNew(true);
  };

  const startEditCar = (car: Car) => {
    setEditingCar({ ...car });
    setCustomPhotoUrl('');
    setCustomFeatureInput('');
    setIsAddingNew(false);
  };

  // Handle local photo file upload (e.g. from camera or gallery)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target?.result as string;
        if (resultUrl && editingCar) {
          setEditingCar((prev) => ({
            ...prev,
            images: [...(prev?.images || []), resultUrl],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const addCustomPhotoUrl = () => {
    if (!customPhotoUrl.trim() || !editingCar) return;
    setEditingCar({
      ...editingCar,
      images: [...(editingCar.images || []), customPhotoUrl.trim()],
    });
    setCustomPhotoUrl('');
  };

  const toggleFeature = (feat: string) => {
    if (!editingCar) return;
    const current = editingCar.features || [];
    if (current.includes(feat)) {
      setEditingCar({
        ...editingCar,
        features: current.filter((f) => f !== feat),
      });
    } else {
      setEditingCar({
        ...editingCar,
        features: [...current, feat],
      });
    }
  };

  const addCustomFeature = () => {
    if (!customFeatureInput.trim() || !editingCar) return;
    const current = editingCar.features || [];
    if (!current.includes(customFeatureInput.trim())) {
      setEditingCar({
        ...editingCar,
        features: [...current, customFeatureInput.trim()],
      });
    }
    setCustomFeatureInput('');
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar || !editingCar.title) return;

    const fullCar: Car = {
      id: editingCar.id || 'car-' + Date.now(),
      title: editingCar.title.trim(),
      brand: editingCar.brand || 'Maruti Suzuki',
      model: editingCar.model || editingCar.title.split(' ')[0] || '',
      variant: editingCar.variant || '',
      year: Number(editingCar.year) || 2018,
      price: Number(editingCar.price) || 0,
      priceNegotiable: Boolean(editingCar.priceNegotiable),
      km: Number(editingCar.km) || 0,
      fuel: (editingCar.fuel as FuelType) || 'Petrol',
      transmission: (editingCar.transmission as TransmissionType) || 'Manual',
      bodyType: (editingCar.bodyType as BodyType) || 'Hatchback',
      owners: editingCar.owners || '1st Owner',
      registration: editingCar.registration || 'MH 15',
      passingValidUntil: editingCar.passingValidUntil || 'Valid',
      insurance: editingCar.insurance || 'Valid',
      color: editingCar.color || 'White',
      isSold: Boolean(editingCar.isSold),
      isFeatured: Boolean(editingCar.isFeatured),
      images: editingCar.images && editingCar.images.length > 0 ? editingCar.images : [PRESET_SHOWROOM_PHOTOS[0]],
      videoUrl: editingCar.videoUrl || '',
      reelUrl: editingCar.reelUrl || config.instagramUrl,
      features: editingCar.features || [],
      description: editingCar.description || '',
      createdAt: editingCar.createdAt || Date.now(),
    };

    await upsertCar(fullCar);
    setEditingCar(null);
    onCarsUpdated();
    setSaveSuccessMsg(isAddingNew ? 'Car successfully added to showroom!' : 'Car details updated!');
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleDeleteCar = async (carId: string) => {
    if (window.confirm('Are you sure you want to remove this car from the showroom inventory?')) {
      await removeCar(carId);
      onCarsUpdated();
    }
  };

  const handleToggleSold = async (car: Car) => {
    await toggleCarSold(car.id, !car.isSold);
    onCarsUpdated();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveShowroomSettings(settingsForm);
    onConfigUpdated(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...firebaseConfig, isConfigured: true };
    const success = saveFirebaseCredentials(updated);
    if (success) {
      setFirebaseStatusMsg('Firebase successfully configured! Connected to live cloud Firestore.');
    } else {
      setFirebaseStatusMsg('Firebase credentials saved (Local storage active).');
    }
  };

  const copyFirestoreRules = () => {
    const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{carId} {
      allow read: if true;
      allow write: if true; // In production, restrict to authenticated admins
    }
    match /settings/{settingId} {
      allow read: if true;
      allow write: if true;
    }
  }
}`;
    navigator.clipboard.writeText(rules);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Admin Box */}
      <div className="relative w-full max-w-4xl max-h-[94vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-[#0B2447] text-white px-5 py-4 border-b border-blue-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFC727] text-[#0B2447] flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading">
                JK Motors · Admin Control Panel
              </h2>
              <p className="text-[11px] text-slate-300">
                Manage Cars Inventory, Add New Vehicles, Edit Showroom Details & Cloud Settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-blue-900/80 hover:bg-blue-800 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Not Authenticated State */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#0B2447] dark:text-[#FFC727] flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-900">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                Admin Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your admin PIN to add new cars, modify prices, or update showroom settings.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                placeholder="Enter Password (e.g. jkadmin)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-[#0B2447]"
              />

              {authError && (
                <p className="text-xs text-red-500 font-semibold">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0B2447] hover:bg-[#061833] text-[#FFC727] font-bold text-sm rounded-xl transition-all shadow-md cursor-pointer"
              >
                Login to Admin Panel
              </button>
            </form>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              <span>Default admin password: <strong className="text-slate-700 dark:text-slate-300 font-mono">jkadmin</strong></span>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  ⚡ 1-Click Quick Demo Login
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-x-auto no-scrollbar">
              <button
                onClick={() => { setActiveTab('cars'); setEditingCar(null); }}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'cars'
                    ? 'bg-white dark:bg-slate-900 text-[#0B2447] dark:text-[#FFC727] border-t-2 border-[#0B2447] dark:border-[#FFC727] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <CarIcon className="w-4 h-4" />
                <span>Cars Inventory ({cars.length})</span>
              </button>

              <button
                onClick={() => { setActiveTab('settings'); setEditingCar(null); }}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-white dark:bg-slate-900 text-[#0B2447] dark:text-[#FFC727] border-t-2 border-[#0B2447] dark:border-[#FFC727] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Showroom Settings</span>
              </button>

              <button
                onClick={() => { setActiveTab('deploy'); setEditingCar(null); }}
                className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  activeTab === 'deploy'
                    ? 'bg-white dark:bg-slate-900 text-[#0B2447] dark:text-[#FFC727] border-t-2 border-[#0B2447] dark:border-[#FFC727] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Firebase & Deployment</span>
              </button>
            </div>

            {/* Notification Banner */}
            {saveSuccessMsg && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-2 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              
              {/* TAB 1: CARS INVENTORY & ADD NEW CAR FORM */}
              {activeTab === 'cars' && (
                <div className="space-y-4">
                  {/* If editing or adding car */}
                  {editingCar ? (
                    <form onSubmit={handleSaveCar} className="space-y-5 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#FFC727] text-[#0B2447] flex items-center justify-center font-bold">
                            <Plus className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                              {isAddingNew ? 'Add New Car to Showroom' : 'Edit Car Details'}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Fill in complete vehicle information, upload photos, and set pricing.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setEditingCar(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Section 1: Basic Identification */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <CarIcon className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                          <span>1. Basic Car Information</span>
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          {/* Title */}
                          <div className="sm:col-span-2">
                            <label className="block font-bold mb-1">Car Title / Full Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Toyota Innova 2.5 G 7-Str"
                              value={editingCar.title || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, title: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                            />
                          </div>

                          {/* Price */}
                          <div>
                            <label className="block font-bold mb-1">Asking Price (₹) *</label>
                            <input
                              type="number"
                              required
                              placeholder="e.g. 450000"
                              value={editingCar.price || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, price: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-bold text-emerald-600 dark:text-emerald-400"
                            />
                            <span className="text-[10px] text-slate-400">
                              Preview: {formatINR(editingCar.price || 0)}
                            </span>
                          </div>

                          {/* Brand Selection */}
                          <div>
                            <label className="block font-bold mb-1">Manufacturer Brand</label>
                            <select
                              value={editingCar.brand || 'Maruti Suzuki'}
                              onChange={(e) => setEditingCar({ ...editingCar, brand: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            >
                              {POPULAR_BRANDS.map((b) => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                              <option value="Other">Other Brand</option>
                            </select>
                          </div>

                          {/* Model */}
                          <div>
                            <label className="block font-bold mb-1">Model Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Innova, Scorpio, Creta, Swift"
                              value={editingCar.model || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, model: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>

                          {/* Variant */}
                          <div>
                            <label className="block font-bold mb-1">Variant & Trim</label>
                            <input
                              type="text"
                              placeholder="e.g. 2.5 G Diesel / VDi+ / Top Model"
                              value={editingCar.variant || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, variant: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Technical Specifications & Usage */}
                      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Gauge className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                          <span>2. Specs, Year & Usage</span>
                        </h4>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          {/* Year */}
                          <div>
                            <label className="block font-bold mb-1">Manufacturing Year</label>
                            <input
                              type="number"
                              min="2000"
                              max={new Date().getFullYear() + 1}
                              value={editingCar.year || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, year: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                            />
                          </div>

                          {/* Km Driven */}
                          <div>
                            <label className="block font-bold mb-1">Kilometers Driven</label>
                            <input
                              type="number"
                              placeholder="e.g. 55000"
                              value={editingCar.km || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, km: Number(e.target.value) })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                            />
                          </div>

                          {/* Fuel */}
                          <div>
                            <label className="block font-bold mb-1">Fuel Type</label>
                            <select
                              value={editingCar.fuel || 'Petrol'}
                              onChange={(e) => setEditingCar({ ...editingCar, fuel: e.target.value as FuelType })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            >
                              <option value="Petrol">Petrol</option>
                              <option value="Diesel">Diesel</option>
                              <option value="CNG">CNG</option>
                              <option value="Electric">Electric</option>
                            </select>
                          </div>

                          {/* Transmission */}
                          <div>
                            <label className="block font-bold mb-1">Transmission</label>
                            <select
                              value={editingCar.transmission || 'Manual'}
                              onChange={(e) => setEditingCar({ ...editingCar, transmission: e.target.value as TransmissionType })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            >
                              <option value="Manual">Manual</option>
                              <option value="Automatic">Automatic</option>
                            </select>
                          </div>

                          {/* Body Type */}
                          <div>
                            <label className="block font-bold mb-1">Body Type</label>
                            <select
                              value={editingCar.bodyType || 'SUV'}
                              onChange={(e) => setEditingCar({ ...editingCar, bodyType: e.target.value as BodyType })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            >
                              <option value="SUV">SUV</option>
                              <option value="Sedan">Sedan</option>
                              <option value="Hatchback">Hatchback</option>
                              <option value="MUV">MUV</option>
                              <option value="Van">Van</option>
                            </select>
                          </div>

                          {/* Ownership */}
                          <div>
                            <label className="block font-bold mb-1">Ownership</label>
                            <select
                              value={editingCar.owners || '1st Owner'}
                              onChange={(e) => setEditingCar({ ...editingCar, owners: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            >
                              <option value="1st Owner">1st Owner</option>
                              <option value="2nd Owner">2nd Owner</option>
                              <option value="3rd Owner">3rd Owner</option>
                              <option value="4th+ Owner">4th+ Owner</option>
                            </select>
                          </div>

                          {/* Registration Number */}
                          <div>
                            <label className="block font-bold mb-1">Registration No. (RTO)</label>
                            <input
                              type="text"
                              placeholder="e.g. MH 15 EX 8082"
                              value={editingCar.registration || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, registration: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                            />
                          </div>

                          {/* Color */}
                          <div>
                            <label className="block font-bold mb-1">Exterior Color</label>
                            <input
                              type="text"
                              placeholder="e.g. Pearl White, Silver, Black"
                              value={editingCar.color || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, color: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {/* Passing Validity */}
                          <div>
                            <label className="block font-bold mb-1">Passing Validity</label>
                            <input
                              type="text"
                              placeholder="e.g. Dec 2033 Valid (5 Years Valid)"
                              value={editingCar.passingValidUntil || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, passingValidUntil: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>

                          {/* Insurance */}
                          <div>
                            <label className="block font-bold mb-1">Insurance Status</label>
                            <input
                              type="text"
                              placeholder="e.g. Comprehensive Valid / Zero Depreciation"
                              value={editingCar.insurance || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, insurance: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Photos Management (Phone Upload + Presets + URLs) */}
                      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                            <span>3. Car Photos ({(editingCar.images || []).length} added)</span>
                          </h4>
                          <span className="text-[11px] text-slate-400">First photo is used as main cover</span>
                        </div>

                        {/* Current Photos Strip */}
                        <div className="flex flex-wrap gap-2.5">
                          {(editingCar.images || []).map((img, idx) => (
                            <div key={idx} className="relative w-24 h-16 rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 group bg-slate-950 shadow-sm">
                              <img src={img} alt="car" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              {idx === 0 && (
                                <span className="absolute top-1 left-1 bg-[#FFC727] text-[#0B2447] text-[9px] font-extrabold px-1 rounded">
                                  Cover
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = (editingCar.images || []).filter((_, i) => i !== idx);
                                  setEditingCar({ ...editingCar, images: filtered });
                                }}
                                className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Upload from Phone / Device */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                          <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-blue-400/70 hover:border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-[#0B2447] dark:text-[#FFC727] cursor-pointer font-bold transition-all">
                            <Upload className="w-4 h-4" />
                            <span>Upload Photos from Phone / PC</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>

                          {/* Add by URL */}
                          <div className="flex gap-1.5">
                            <input
                              type="url"
                              placeholder="Or paste image URL..."
                              value={customPhotoUrl}
                              onChange={(e) => setCustomPhotoUrl(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                            />
                            <button
                              type="button"
                              onClick={addCustomPhotoUrl}
                              className="px-3 py-2 bg-[#0B2447] text-[#FFC727] font-bold rounded-xl text-xs hover:bg-[#061833] cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* Pick from showroom stock gallery */}
                        <div className="pt-1">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Quick select from JK Motors showroom stock photos:</span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {PRESET_SHOWROOM_PHOTOS.map((p, i) => (
                              <button
                                type="button"
                                key={i}
                                onClick={() => {
                                  const current = editingCar.images || [];
                                  if (!current.includes(p)) {
                                    setEditingCar({ ...editingCar, images: [...current, p] });
                                  }
                                }}
                                className="w-10 h-8 rounded-lg border border-slate-300 dark:border-slate-700 overflow-hidden hover:scale-110 transition-transform cursor-pointer"
                                title="Click to add photo"
                              >
                                <img src={p} alt="preset" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Video Walkthrough & Instagram Reel */}
                      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Play className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                          <span>4. Video Walkthrough & Instagram Reel Link</span>
                        </h4>

                        <div className="space-y-2">
                          <div>
                            <label className="block font-bold mb-1">Video Walkthrough URL / Local Asset</label>
                            <input
                              type="text"
                              placeholder="e.g. /assets/aistudio/VID-20261104-WA0016_ea2651b3.mp4"
                              value={editingCar.videoUrl || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, videoUrl: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-xs"
                            />
                            {/* Preset Walkthrough options */}
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {PRESET_SHOWROOM_VIDEOS.map((v, i) => (
                                <button
                                  type="button"
                                  key={i}
                                  onClick={() => setEditingCar({ ...editingCar, videoUrl: v.url })}
                                  className="px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded text-[11px] cursor-pointer"
                                >
                                  + {v.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold mb-1">Instagram Reel Link (for customer social proof)</label>
                            <input
                              type="url"
                              placeholder="https://www.instagram.com/reel/..."
                              value={editingCar.reelUrl || ''}
                              onChange={(e) => setEditingCar({ ...editingCar, reelUrl: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 5: Features Chips & Description */}
                      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                          <span>5. Key Features & Vehicle Description</span>
                        </h4>

                        {/* Common feature toggles */}
                        <div>
                          <label className="block font-bold mb-1.5">Click to toggle common features:</label>
                          <div className="flex flex-wrap gap-1.5">
                            {COMMON_FEATURES.map((feat) => {
                              const isSelected = (editingCar.features || []).includes(feat);
                              return (
                                <button
                                  type="button"
                                  key={feat}
                                  onClick={() => toggleFeature(feat)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#FFC727] text-[#0B2447] font-bold shadow-sm'
                                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                                  }`}
                                >
                                  {isSelected ? '✓ ' : '+ '}
                                  {feat}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Add custom feature */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add other custom feature..."
                            value={customFeatureInput}
                            onChange={(e) => setCustomFeatureInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addCustomFeature();
                              }
                            }}
                            className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                          />
                          <button
                            type="button"
                            onClick={addCustomFeature}
                            className="px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            Add Feature
                          </button>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block font-bold mb-1">Vehicle Description & History</label>
                          <textarea
                            rows={3}
                            value={editingCar.description || ''}
                            onChange={(e) => setEditingCar({ ...editingCar, description: e.target.value })}
                            placeholder="Describe overall condition, service history, paint, tyres, and documentation..."
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Section 6: Status Toggles (Sold, Price Negotiable, Featured) */}
                      <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer font-bold">
                          <input
                            type="checkbox"
                            checked={Boolean(editingCar.priceNegotiable)}
                            onChange={(e) => setEditingCar({ ...editingCar, priceNegotiable: e.target.checked })}
                            className="w-4 h-4 rounded text-[#0B2447] accent-[#0B2447]"
                          />
                          <span>Price is Negotiable (वाटाघाटी शक्य)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-bold text-red-600 dark:text-red-400">
                          <input
                            type="checkbox"
                            checked={Boolean(editingCar.isSold)}
                            onChange={(e) => setEditingCar({ ...editingCar, isSold: e.target.checked })}
                            className="w-4 h-4 rounded text-red-600 accent-red-600"
                          />
                          <span>Mark as SOLD (गाडी विकली गेली)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0B2447] dark:text-[#FFC727]">
                          <input
                            type="checkbox"
                            checked={Boolean(editingCar.isFeatured)}
                            onChange={(e) => setEditingCar({ ...editingCar, isFeatured: e.target.checked })}
                            className="w-4 h-4 rounded text-[#FFC727] accent-[#FFC727]"
                          />
                          <span>Show on Hero Header (Featured Arrival)</span>
                        </label>
                      </div>

                      {/* Live Preview Card */}
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-[#0B2447] dark:text-[#FFC727]" />
                          Live Card Preview for Buyers:
                        </span>
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="font-heading font-extrabold text-slate-900 dark:text-white">
                              {editingCar.title || 'Car Title Here'}
                            </span>
                            <span className="text-xs text-slate-400 ml-2">({editingCar.year || 2018} · {editingCar.fuel} · {formatKm(editingCar.km || 0)})</span>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                              {formatINR(editingCar.price || 0)}
                            </span>
                            {editingCar.priceNegotiable && (
                              <span className="text-[10px] text-slate-400 ml-1">(Negotiable)</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Submit Actions */}
                      <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => setEditingCar(null)}
                          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#FFC727] hover:bg-[#e6b21f] text-[#0B2447] rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isAddingNew ? 'Add Car to Inventory' : 'Save Changes'}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Cars List Table / Inventory */
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                            Showroom Cars Inventory ({cars.length})
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Add new arrivals, update prices, mark vehicles as sold, or remove stock.
                          </p>
                        </div>

                        <button
                          onClick={startAddNewCar}
                          className="px-4 py-2.5 bg-[#0B2447] hover:bg-[#061833] text-[#FFC727] rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Add New Car</span>
                        </button>
                      </div>

                      {/* Cars List */}
                      <div className="grid grid-cols-1 gap-2.5">
                        {cars.map((c) => (
                          <div
                            key={c.id}
                            className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              c.isSold
                                ? 'bg-slate-100/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                                <img
                                  src={c.images[0] || PRESET_SHOWROOM_PHOTOS[0]}
                                  alt={c.title}
                                  className="w-full h-full object-cover"
                                />
                                {c.isSold && (
                                  <div className="absolute inset-0 bg-red-600/70 text-white text-[9px] font-extrabold flex items-center justify-center uppercase">
                                    SOLD
                                  </div>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                                    {c.title}
                                  </span>
                                  {c.isFeatured && (
                                    <span className="text-[10px] bg-[#FFC727] text-[#0B2447] px-1.5 py-0.2 rounded font-bold">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-mono">
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatINR(c.price)}
                                  </span>
                                  <span>·</span>
                                  <span>{c.registration}</span>
                                  <span>·</span>
                                  <span>{c.fuel}</span>
                                  <span>·</span>
                                  <span>{c.year}</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                              <button
                                onClick={() => handleToggleSold(c)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                  c.isSold
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                {c.isSold ? 'Make Available' : 'Mark SOLD'}
                              </button>

                              <button
                                onClick={() => startEditCar(c)}
                                className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteCar(c.id)}
                                className="p-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SHOWROOM SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                        Showroom Information & Contact Details
                      </h3>
                      <p className="text-xs text-slate-500">
                        Update showroom name, primary WhatsApp booking number, timings, and map location.
                      </p>
                    </div>

                    {settingsSaved && (
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Settings Saved!
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold mb-1">Showroom Name (English)</label>
                      <input
                        type="text"
                        value={settingsForm.name}
                        onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Showroom Name (Devanagari / Marathi)</label>
                      <input
                        type="text"
                        value={settingsForm.marathiName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, marathiName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Proprietor Name</label>
                      <input
                        type="text"
                        value={settingsForm.proprietor}
                        onChange={(e) => setSettingsForm({ ...settingsForm, proprietor: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Primary WhatsApp Number</label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono font-bold text-[#0B2447] dark:text-[#FFC727]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Call / Alternate Number</label>
                      <input
                        type="text"
                        value={settingsForm.callNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, callNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={settingsForm.instagramUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1">Showroom Tagline</label>
                      <textarea
                        rows={2}
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1">Showroom Address</label>
                      <input
                        type="text"
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold mb-1">Showroom Working Hours & Timings</label>
                      <input
                        type="text"
                        value={settingsForm.timings}
                        onChange={(e) => setSettingsForm({ ...settingsForm, timings: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#FFC727] hover:bg-[#e6b21f] text-[#0B2447] font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Showroom Settings</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: FIREBASE & DEPLOYMENT GUIDE */}
              {activeTab === 'deploy' && (
                <div className="space-y-5 text-xs">
                  {/* Status Banner */}
                  <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#FFC727] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-[#0B2447] dark:text-[#FFC727]">
                        Cloud Firebase & Free Vercel/Netlify Deployment
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        This showroom website is pre-configured with persistent dual-layer storage: all new cars and edits are immediately saved to client storage, and seamlessly synchronize with Firebase Firestore when your keys are saved below.
                      </p>
                    </div>
                  </div>

                  {/* Firebase Config Form */}
                  <form onSubmit={handleSaveFirebaseConfig} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>Firebase Project Credentials</span>
                    </h4>

                    {firebaseStatusMsg && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                        {firebaseStatusMsg}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                      <div>
                        <label className="block text-slate-500 font-sans mb-1">apiKey</label>
                        <input
                          type="text"
                          value={firebaseConfig.apiKey}
                          onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-sans mb-1">projectId</label>
                        <input
                          type="text"
                          value={firebaseConfig.projectId}
                          onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-sans mb-1">authDomain</label>
                        <input
                          type="text"
                          value={firebaseConfig.authDomain}
                          onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-500 font-sans mb-1">storageBucket</label>
                        <input
                          type="text"
                          value={firebaseConfig.storageBucket}
                          onChange={(e) => setFirebaseConfig({ ...firebaseConfig, storageBucket: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[11px] text-slate-500">
                        {firebaseConfig.isConfigured ? '✓ Firebase connected' : 'Local caching currently active'}
                      </span>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0B2447] text-[#FFC727] font-bold rounded-xl text-xs hover:bg-[#061833] cursor-pointer"
                      >
                        Save Firebase Configuration
                      </button>
                    </div>
                  </form>

                  {/* Firestore Security Rules Card */}
                  <div className="p-4 bg-slate-900 rounded-2xl text-slate-200 space-y-2 font-mono text-[11px]">
                    <div className="flex items-center justify-between font-sans text-xs">
                      <span className="font-bold text-[#FFC727]">firestore.rules (Firestore Security Rules)</span>
                      <button
                        onClick={copyFirestoreRules}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCode ? 'Copied' : 'Copy Rules'}</span>
                      </button>
                    </div>
                    <pre className="overflow-x-auto p-2 bg-slate-950 rounded-lg text-slate-300">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{carId} {
      allow read: if true;
      allow write: if true;
    }
    match /settings/{settingId} {
      allow read: if true;
      allow write: if true;
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
