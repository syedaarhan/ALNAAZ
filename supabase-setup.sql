-- =============================================
-- AL NAAZ RESTAURANT — Supabase Database Setup
-- =============================================
-- Run this ENTIRE script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/clszkizgqlhavarnruad/sql
-- =============================================

-- 1. CREATE MENU TABLE
CREATE TABLE IF NOT EXISTS menu (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "desc" TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '₹ 0',
  "priceNum" INTEGER NOT NULL DEFAULT 0,
  rating REAL NOT NULL DEFAULT 5.0,
  img TEXT NOT NULL DEFAULT '',
  chef BOOLEAN DEFAULT false,
  cat TEXT NOT NULL DEFAULT 'Starters',
  ingredients TEXT[] DEFAULT '{}',
  "spiceLevel" INTEGER DEFAULT 0,
  "prepTime" TEXT DEFAULT ''
);

-- 2. CREATE RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  guests TEXT NOT NULL DEFAULT '2',
  requests TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 4. DROP OLD POLICIES (safe to run even if they don't exist)
DROP POLICY IF EXISTS "Public read menu" ON menu;
DROP POLICY IF EXISTS "Public full menu" ON menu;
DROP POLICY IF EXISTS "Public insert reservation" ON reservations;
DROP POLICY IF EXISTS "Public read reservations" ON reservations;
DROP POLICY IF EXISTS "Public update reservations" ON reservations;
DROP POLICY IF EXISTS "Public delete menu" ON menu;

-- 5. CREATE RLS POLICIES

-- Menu: Anyone can read
CREATE POLICY "Public read menu" ON menu
  FOR SELECT USING (true);

-- Menu: Anyone can insert/update (for admin panel using anon key)
CREATE POLICY "Public full menu" ON menu
  FOR ALL USING (true) WITH CHECK (true);

-- Menu: Anyone can delete
CREATE POLICY "Public delete menu" ON menu
  FOR DELETE USING (true);

-- Reservations: Anyone can insert (public form)
CREATE POLICY "Public insert reservation" ON reservations
  FOR INSERT WITH CHECK (true);

-- Reservations: Anyone can read (admin panel)
CREATE POLICY "Public read reservations" ON reservations
  FOR SELECT USING (true);

-- Reservations: Anyone can update status (admin panel)
CREATE POLICY "Public update reservations" ON reservations
  FOR UPDATE USING (true) WITH CHECK (true);

-- 6. SEED DEFAULT MENU (only if table is empty)
INSERT INTO menu (id, name, "desc", price, "priceNum", rating, img, chef, cat, ingredients, "spiceLevel", "prepTime")
SELECT * FROM (VALUES
  ('paneer-tikka', 'Paneer Shahi Tikka', 'Smoky paneer marinated in royal spices, kissed by tandoor flame.', '₹ 480', 480, 4.9, '', true, 'Starters', ARRAY['Organic Paneer', 'Kashmiri Chili', 'Garam Masala', 'Hung Curd'], 2, '20 min'),
  ('galouti-kebab', 'Galouti Kebab', '104 spices, melt-in-mouth lamb mince, a Lucknowi treasure.', '₹ 620', 620, 4.8, '', false, 'Starters', ARRAY['Minced Lamb', 'Papaya Paste', 'Signature Spice Blend', 'Saffron'], 1, '25 min'),
  ('hyderabadi-biryani', 'Hyderabadi Dum Biryani', 'Saffron-laced basmati slow-cooked in copper handi.', '₹ 720', 720, 5.0, '', true, 'Biryani', ARRAY['Long-grain Basmati', 'Spring Lamb', 'Persian Saffron', 'Native Ghee'], 3, '45 min'),
  ('lucknowi-biryani', 'Lucknowi Awadhi Biryani', 'Subtle, fragrant, layered — a poem on the palate.', '₹ 690', 690, 4.9, '', false, 'Biryani', ARRAY['Aromatic Rice', 'Yogurt', 'Star Anise', 'Mace'], 1, '40 min'),
  ('seekh-khaas', 'Seekh-e-Khaas', 'Hand-minced kebabs grilled over coal, finished with butter.', '₹ 560', 560, 4.8, '', true, 'BBQ', ARRAY['Hand-minced Lamb', 'Green Chilies', 'Cilantro', 'White Butter'], 2, '30 min'),
  ('tandoori-raan', 'Tandoori Raan', 'Whole leg of lamb, slow roasted with whole spices.', '₹ 1480', 1480, 4.9, '', false, 'BBQ', ARRAY['Whole Lamb Leg', 'Malt Vinegar', 'Black Cumin', 'Garlic'], 2, '60 min'),
  ('gulab-jamun', 'Shahi Gulab Jamun', 'Pillowy khoya dumplings in cardamom-rose syrup.', '₹ 320', 320, 4.9, '', true, 'Desserts', ARRAY['Fresh Khoya', 'Green Cardamom', 'Rose Petals', 'Pistachio'], 0, '15 min'),
  ('phirni-royale', 'Phirni Royale', 'Slow-set saffron rice pudding with edible silver.', '₹ 290', 290, 4.7, '', false, 'Desserts', ARRAY['Basmati Rice', 'Full Cream Milk', 'Saffron', 'Silver Vark'], 0, '20 min'),
  ('mango-lassi', 'Royal Mango Lassi', 'Alphonso mango churned with hung yogurt, saffron dust.', '₹ 240', 240, 4.9, '', true, 'Drinks', ARRAY['Alphonso Mango', 'Creamy Yogurt', 'Honey', 'Saffron Threads'], 0, '10 min'),
  ('kahwa', 'Kashmiri Kahwa', 'Green tea, almonds, cinnamon — the warmth of the valley.', '₹ 180', 180, 4.8, '', false, 'Drinks', ARRAY['Green Tea Leaves', 'Kashmiri Saffron', 'Almond Slivers', 'Cinnamon'], 0, '10 min')
) AS v(id, name, "desc", price, "priceNum", rating, img, chef, cat, ingredients, "spiceLevel", "prepTime")
WHERE NOT EXISTS (SELECT 1 FROM menu LIMIT 1);

-- Done! Your database is ready. ✦
