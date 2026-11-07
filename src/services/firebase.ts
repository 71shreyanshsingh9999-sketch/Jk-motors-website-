import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  Firestore 
} from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Car, ShowroomConfig, FirebaseConfigState } from '../types';
import { INITIAL_CARS, DEFAULT_SHOWROOM_CONFIG } from '../data/defaultCars';

const STORAGE_KEYS = {
  CARS: 'jk_motors_cars_v1',
  CONFIG: 'jk_motors_showroom_config_v1',
  FIREBASE_CONFIG: 'jk_motors_firebase_config_v1',
};

// Check for env vars or stored config
export function getSavedFirebaseConfig(): FirebaseConfigState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read firebase config from storage', e);
  }

  // Fallback to Vite env vars if present
  const envKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  return {
    apiKey: envKey || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (envProjectId ? `${envProjectId}.firebaseapp.com` : ''),
    projectId: envProjectId || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (envProjectId ? `${envProjectId}.appspot.com` : ''),
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    isConfigured: Boolean(envKey && envProjectId),
  };
}

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;
let firebaseAuth: Auth | null = null;
let firebaseStorage: FirebaseStorage | null = null;

export function initFirebaseService(customConfig?: Partial<FirebaseConfigState>): boolean {
  try {
    const cfg = customConfig ? { ...getSavedFirebaseConfig(), ...customConfig } : getSavedFirebaseConfig();
    if (!cfg.apiKey || !cfg.projectId) {
      return false;
    }

    if (!getApps().length) {
      firebaseApp = initializeApp({
        apiKey: cfg.apiKey,
        authDomain: cfg.authDomain,
        projectId: cfg.projectId,
        storageBucket: cfg.storageBucket,
        messagingSenderId: cfg.messagingSenderId,
        appId: cfg.appId,
      });
    } else {
      firebaseApp = getApps()[0];
    }

    firestoreDb = getFirestore(firebaseApp);
    firebaseAuth = getAuth(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
    return true;
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return false;
  }
}

// Initial attempt
initFirebaseService();

// Local Storage Fallback helpers
export function getLocalCars(): Car[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CARS);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading local cars:', err);
  }
  // Save initial cars into storage on first load
  localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(INITIAL_CARS));
  return INITIAL_CARS;
}

export function saveLocalCars(cars: Car[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CARS, JSON.stringify(cars));
  } catch (err) {
    console.error('Error saving local cars:', err);
  }
}

export function getLocalShowroomConfig(): ShowroomConfig {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (data) {
      return { ...DEFAULT_SHOWROOM_CONFIG, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading showroom config:', err);
  }
  return DEFAULT_SHOWROOM_CONFIG;
}

export function saveLocalShowroomConfig(config: ShowroomConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (err) {
    console.error('Error saving showroom config:', err);
  }
}

// Unified Service: Syncs with Firestore if configured, otherwise uses reliable LocalStorage
export async function fetchAllCars(): Promise<Car[]> {
  const localList = getLocalCars();

  if (firestoreDb) {
    try {
      const colRef = collection(firestoreDb, 'cars');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const firestoreCars: Car[] = [];
        snap.forEach((docItem) => {
          firestoreCars.push({ id: docItem.id, ...docItem.data() } as Car);
        });
        saveLocalCars(firestoreCars);
        return firestoreCars;
      } else {
        // Seed firestore with initial cars if empty
        for (const car of localList) {
          await setDoc(doc(firestoreDb, 'cars', car.id), car);
        }
      }
    } catch (e) {
      console.warn('Firestore fetch failed, returning local cache:', e);
    }
  }

  return localList;
}

export async function upsertCar(car: Car): Promise<void> {
  const current = getLocalCars();
  const index = current.findIndex((c) => c.id === car.id);
  let updated: Car[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = car;
  } else {
    updated = [car, ...current];
  }
  saveLocalCars(updated);

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'cars', car.id), car, { merge: true });
    } catch (e) {
      console.warn('Firestore write failed, saved to local cache:', e);
    }
  }
}

export async function removeCar(carId: string): Promise<void> {
  const current = getLocalCars();
  const updated = current.filter((c) => c.id !== carId);
  saveLocalCars(updated);

  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'cars', carId));
    } catch (e) {
      console.warn('Firestore delete failed, removed from local cache:', e);
    }
  }
}

export async function toggleCarSold(carId: string, isSold: boolean): Promise<void> {
  const current = getLocalCars();
  const updated = current.map((c) => (c.id === carId ? { ...c, isSold } : c));
  saveLocalCars(updated);

  if (firestoreDb) {
    try {
      await updateDoc(doc(firestoreDb, 'cars', carId), { isSold });
    } catch (e) {
      console.warn('Firestore update failed, updated local cache:', e);
    }
  }
}

export async function fetchShowroomSettings(): Promise<ShowroomConfig> {
  const localConfig = getLocalShowroomConfig();

  if (firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'settings', 'showroom');
      const snap = await getDocs(collection(firestoreDb, 'settings'));
      const found = snap.docs.find((d) => d.id === 'showroom');
      if (found && found.exists()) {
        const data = found.data() as ShowroomConfig;
        saveLocalShowroomConfig(data);
        return data;
      } else {
        await setDoc(docRef, localConfig);
      }
    } catch (e) {
      console.warn('Firestore settings fetch failed, using local cache:', e);
    }
  }

  return localConfig;
}

export async function saveShowroomSettings(config: ShowroomConfig): Promise<void> {
  saveLocalShowroomConfig(config);

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'settings', 'showroom'), config, { merge: true });
    } catch (e) {
      console.warn('Firestore settings save failed, saved locally:', e);
    }
  }
}

export function saveFirebaseCredentials(config: FirebaseConfigState): boolean {
  try {
    localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(config));
    return initFirebaseService(config);
  } catch (err) {
    console.error('Failed saving Firebase config:', err);
    return false;
  }
}

export function isFirebaseConnected(): boolean {
  return Boolean(firestoreDb);
}
