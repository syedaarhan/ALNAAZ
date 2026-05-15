import { supabase } from './supabase';
import dishStarter from "@/assets/dish-starter.jpg";
import dishBiryani from "@/assets/dish-biryani.jpg";
import dishBbq from "@/assets/dish-bbq.jpg";
import dishDessert from "@/assets/dish-dessert.jpg";
import dishDrink from "@/assets/dish-drink.jpg";

export type Dish = {
  id: string;
  name: string;
  desc: string;
  price: string;
  priceNum: number;
  rating: number;
  img: string;
  chef?: boolean;
  cat: string;
  ingredients?: string[];
  spiceLevel?: 0 | 1 | 2 | 3;
  prepTime?: string;
};

export const defaultDishes: Dish[] = [
  { id: "paneer-tikka", cat: "Starters", name: "Paneer Shahi Tikka", desc: "Smoky paneer marinated in royal spices, kissed by tandoor flame.", price: "₹ 480", priceNum: 480, rating: 4.9, img: dishStarter, chef: true, ingredients: ["Organic Paneer", "Kashmiri Chili", "Garam Masala", "Hung Curd"], spiceLevel: 2, prepTime: "20 min" },
  { id: "galouti-kebab", cat: "Starters", name: "Galouti Kebab", desc: "104 spices, melt-in-mouth lamb mince, a Lucknowi treasure.", price: "₹ 620", priceNum: 620, rating: 4.8, img: dishBbq, ingredients: ["Minced Lamb", "Papaya Paste", "Signature Spice Blend", "Saffron"], spiceLevel: 1, prepTime: "25 min" },
  { id: "hyderabadi-biryani", cat: "Biryani", name: "Hyderabadi Dum Biryani", desc: "Saffron-laced basmati slow-cooked in copper handi.", price: "₹ 720", priceNum: 720, rating: 5.0, img: dishBiryani, chef: true, ingredients: ["Long-grain Basmati", "Spring Lamb", "Persian Saffron", "Native Ghee"], spiceLevel: 3, prepTime: "45 min" },
  { id: "lucknowi-biryani", cat: "Biryani", name: "Lucknowi Awadhi Biryani", desc: "Subtle, fragrant, layered — a poem on the palate.", price: "₹ 690", priceNum: 690, rating: 4.9, img: dishBiryani, ingredients: ["Aromatic Rice", "Yogurt", "Star Anise", "Mace"], spiceLevel: 1, prepTime: "40 min" },
  { id: "seekh-khaas", cat: "BBQ", name: "Seekh-e-Khaas", desc: "Hand-minced kebabs grilled over coal, finished with butter.", price: "₹ 560", priceNum: 560, rating: 4.8, img: dishBbq, chef: true, ingredients: ["Hand-minced Lamb", "Green Chilies", "Cilantro", "White Butter"], spiceLevel: 2, prepTime: "30 min" },
  { id: "tandoori-raan", cat: "BBQ", name: "Tandoori Raan", desc: "Whole leg of lamb, slow roasted with whole spices.", price: "₹ 1480", priceNum: 1480, rating: 4.9, img: dishBbq, ingredients: ["Whole Lamb Leg", "Malt Vinegar", "Black Cumin", "Garlic"], spiceLevel: 2, prepTime: "60 min" },
  { id: "gulab-jamun", cat: "Desserts", name: "Shahi Gulab Jamun", desc: "Pillowy khoya dumplings in cardamom-rose syrup.", price: "₹ 320", priceNum: 320, rating: 4.9, img: dishDessert, chef: true, ingredients: ["Fresh Khoya", "Green Cardamom", "Rose Petals", "Pistachio"], spiceLevel: 0, prepTime: "15 min" },
  { id: "phirni-royale", cat: "Desserts", name: "Phirni Royale", desc: "Slow-set saffron rice pudding with edible silver.", price: "₹ 290", priceNum: 290, rating: 4.7, img: dishDessert, ingredients: ["Basmati Rice", "Full Cream Milk", "Saffron", "Silver Vark"], spiceLevel: 0, prepTime: "20 min" },
  { id: "mango-lassi", cat: "Drinks", name: "Royal Mango Lassi", desc: "Alphonso mango churned with hung yogurt, saffron dust.", price: "₹ 240", priceNum: 240, rating: 4.9, img: dishDrink, chef: true, ingredients: ["Alphonso Mango", "Creamy Yogurt", "Honey", "Saffron Threads"], spiceLevel: 0, prepTime: "10 min" },
  { id: "kahwa", cat: "Drinks", name: "Kashmiri Kahwa", desc: "Green tea, almonds, cinnamon — the warmth of the valley.", price: "₹ 180", priceNum: 180, rating: 4.8, img: dishDrink, ingredients: ["Green Tea Leaves", "Kashmiri Saffron", "Almond Slivers", "Cinnamon"], spiceLevel: 0, prepTime: "10 min" },
];

export const categories = ["All", "Starters", "Biryani", "BBQ", "Desserts", "Drinks"];

// ========== IN-MEMORY CACHE (works instantly within the same session) ==========
let _menuCache: Dish[] | null = null;
let _reservationsCache: Reservation[] | null = null;

// Custom event name for same-tab notifications
const MENU_UPDATED_EVENT = "alnaaz_menu_updated";
const RESERVATIONS_UPDATED_EVENT = "alnaaz_reservations_updated";

/** Subscribe to menu changes (works in same tab + across tabs) */
export function onMenuUpdate(callback: () => void): () => void {
  // Same-tab custom event
  window.addEventListener(MENU_UPDATED_EVENT, callback);
  // Cross-tab storage event
  const storageHandler = (e: StorageEvent) => {
    if (e.key === "alnaaz_menu") callback();
  };
  window.addEventListener("storage", storageHandler);
  // Visibility change (user switched back to tab)
  const visHandler = () => {
    if (document.visibilityState === "visible") callback();
  };
  document.addEventListener("visibilitychange", visHandler);

  return () => {
    window.removeEventListener(MENU_UPDATED_EVENT, callback);
    window.removeEventListener("storage", storageHandler);
    document.removeEventListener("visibilitychange", visHandler);
  };
}

// ========== STORAGE KEYS ==========
const LS_MENU = "alnaaz_menu";
const LS_RESERVATIONS = "alnaaz_reservations";

// ========== SUPABASE HEALTH ==========
let _dbReady: boolean | null = null;

async function checkDb(): Promise<boolean> {
  if (_dbReady !== null) return _dbReady;
  try {
    const { error } = await supabase.from('menu').select('id').limit(1);
    _dbReady = !error;
    if (error) console.warn("Supabase tables not ready:", error.message);
  } catch {
    _dbReady = false;
  }
  return _dbReady;
}

// ========== LOCAL STORAGE HELPERS ==========

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn("localStorage write failed for", key, "— likely quota exceeded", e);
    return false;
  }
}

// ========== IMAGE COMPRESSION ==========

/** Compress a base64 image to max 800px width, JPEG quality 0.6 (~50-100KB) */
export function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl.startsWith("data:image")) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const MAX = 800;
      let w = img.width;
      let h = img.height;
      if (w > MAX) {
        h = (h * MAX) / w;
        w = MAX;
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

// ========== MENU CRUD ==========

export const getMenu = async (): Promise<Dish[]> => {
  // 1. In-memory cache (instant, always fresh in same session)
  if (_menuCache) return _menuCache;

  // 2. Try Supabase
  const dbOk = await checkDb();
  if (dbOk) {
    try {
      const { data, error } = await supabase.from('menu').select('*').order('name');
      if (!error && data && data.length > 0) {
        _menuCache = data;
        setLocal(LS_MENU, data);
        return data;
      }
    } catch { /* fall through */ }
  }

  // 3. localStorage
  const local = getLocal<Dish[]>(LS_MENU, []);
  if (local.length > 0) {
    _menuCache = local;
    return local;
  }

  // 4. Defaults
  _menuCache = defaultDishes;
  return defaultDishes;
};

export const saveMenu = async (dishes: Dish[]): Promise<{ ok: boolean; error?: string }> => {
  // Always update in-memory cache first
  _menuCache = dishes;

  // Notify all listeners in the same tab
  window.dispatchEvent(new Event(MENU_UPDATED_EVENT));

  // Save to localStorage
  setLocal(LS_MENU, dishes);

  // Try cloud sync
  const dbOk = await checkDb();
  if (dbOk) {
    try {
      const { error } = await supabase.from('menu').upsert(dishes);
      if (error) console.warn("Cloud menu save failed:", error.message);
    } catch { /* ignore */ }
  }

  return { ok: true };
};

export const deleteDishFromDb = async (id: string): Promise<{ ok: boolean; error?: string }> => {
  // Update cache
  _menuCache = (_menuCache || []).filter(d => d.id !== id);
  window.dispatchEvent(new Event(MENU_UPDATED_EVENT));
  setLocal(LS_MENU, _menuCache);

  const dbOk = await checkDb();
  if (dbOk) {
    try {
      await supabase.from('menu').delete().eq('id', id);
    } catch { /* ignore */ }
  }
  return { ok: true };
};

// ========== RESERVATION TYPES ==========

export type Reservation = {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  requests: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at?: string;
};

// ========== RESERVATION CRUD ==========

export const getReservations = async (): Promise<Reservation[]> => {
  if (_reservationsCache) return _reservationsCache;

  const dbOk = await checkDb();
  if (dbOk) {
    try {
      const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const local = getLocal<Reservation[]>(LS_RESERVATIONS, []);
        const cloudIds = new Set(data.map(r => r.id));
        const merged = [...data, ...local.filter(r => !cloudIds.has(r.id))];
        _reservationsCache = merged;
        setLocal(LS_RESERVATIONS, merged);
        return merged;
      }
    } catch { /* fall through */ }
  }

  const local = getLocal<Reservation[]>(LS_RESERVATIONS, []);
  _reservationsCache = local;
  return local;
};

export const saveReservation = async (res: Omit<Reservation, "id" | "status" | "created_at">): Promise<{ ok: boolean; error?: string }> => {
  const newRes: Reservation = {
    ...res,
    id: crypto.randomUUID(),
    status: "pending",
    created_at: new Date().toISOString(),
  };

  // Update cache
  _reservationsCache = [newRes, ...(_reservationsCache || [])];
  window.dispatchEvent(new Event(RESERVATIONS_UPDATED_EVENT));
  setLocal(LS_RESERVATIONS, _reservationsCache);

  // Try cloud
  const dbOk = await checkDb();
  if (dbOk) {
    try {
      await supabase.from('reservations').insert([{
        name: newRes.name, phone: newRes.phone, date: newRes.date,
        time: newRes.time, guests: newRes.guests, requests: newRes.requests,
        status: newRes.status,
      }]);
    } catch { /* ignore */ }
  }
  return { ok: true };
};

export const updateReservationStatus = async (id: string, status: Reservation["status"]): Promise<{ ok: boolean; error?: string }> => {
  _reservationsCache = (_reservationsCache || []).map(r => r.id === id ? { ...r, status } : r);
  setLocal(LS_RESERVATIONS, _reservationsCache);

  const dbOk = await checkDb();
  if (dbOk) {
    try {
      await supabase.from('reservations').update({ status }).eq('id', id);
    } catch { /* ignore */ }
  }
  return { ok: true };
};
