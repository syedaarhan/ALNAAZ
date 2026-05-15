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

// ---------- DATABASE HEALTH CHECK ----------

/** Test if Supabase is reachable and tables exist */
let _dbHealthy: boolean | null = null;

async function isDbHealthy(): Promise<boolean> {
  if (_dbHealthy !== null) return _dbHealthy;
  try {
    // A lightweight probe — just try to read 1 row from 'menu'
    const { error } = await supabase.from('menu').select('id').limit(1);
    _dbHealthy = !error;
    if (error) console.warn("Supabase not available:", error.message);
  } catch {
    _dbHealthy = false;
  }
  return _dbHealthy;
}

/** Reset health cache (call after fixing config) */
export function resetDbHealth() {
  _dbHealthy = null;
}

// ---------- MENU CRUD ----------

export const getMenu = async (): Promise<Dish[]> => {
  if (!(await isDbHealthy())) return defaultDishes;

  try {
    const { data, error } = await supabase.from('menu').select('*').order('name');
    if (error) {
      console.warn("getMenu error, using defaults:", error.message);
      return defaultDishes;
    }
    if (!data || data.length === 0) return defaultDishes;
    return data;
  } catch (err) {
    console.warn("getMenu exception, using defaults:", err);
    return defaultDishes;
  }
};

export const saveMenu = async (dishes: Dish[]): Promise<{ ok: boolean; error?: string }> => {
  if (!(await isDbHealthy())) {
    return { ok: false, error: "Database is not connected. Your changes are saved locally until the session ends." };
  }

  try {
    const { error } = await supabase.from('menu').upsert(dishes);
    if (error) {
      console.error("saveMenu error:", error.message, error.details, error.hint);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    console.error("saveMenu exception:", err);
    return { ok: false, error: err.message || "Unknown error" };
  }
};

export const deleteDishFromDb = async (id: string): Promise<{ ok: boolean; error?: string }> => {
  if (!(await isDbHealthy())) {
    return { ok: false, error: "Database is not connected." };
  }

  try {
    const { error } = await supabase.from('menu').delete().eq('id', id);
    if (error) {
      console.error("deleteDish error:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "Unknown error" };
  }
};

// ---------- RESERVATION TYPES ----------

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

// ---------- RESERVATION CRUD ----------

export const getReservations = async (): Promise<Reservation[]> => {
  if (!(await isDbHealthy())) return [];

  try {
    const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn("getReservations error:", error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn("getReservations exception:", err);
    return [];
  }
};

export const saveReservation = async (res: Omit<Reservation, "id" | "status" | "created_at">): Promise<{ ok: boolean; error?: string }> => {
  if (!(await isDbHealthy())) {
    return { ok: false, error: "Database is not connected. Please contact the restaurant directly to make a reservation." };
  }

  const newRes = {
    ...res,
    status: "pending",
  };

  try {
    const { error } = await supabase.from('reservations').insert([newRes]);
    if (error) {
      console.error("saveReservation error:", error.message, error.details, error.hint);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    console.error("saveReservation exception:", err);
    return { ok: false, error: err.message || "Unknown error" };
  }
};

export const updateReservationStatus = async (id: string, status: Reservation["status"]): Promise<{ ok: boolean; error?: string }> => {
  if (!(await isDbHealthy())) {
    return { ok: false, error: "Database is not connected." };
  }

  try {
    const { error } = await supabase.from('reservations').update({ status }).eq('id', id);
    if (error) {
      console.error("updateReservationStatus error:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || "Unknown error" };
  }
};
