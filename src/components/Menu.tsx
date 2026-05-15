import { useState, useMemo, useEffect } from "react";
import { Star, Search, Filter, X, Info, Flame, Clock as ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer } from "vaul";
import { motion, AnimatePresence } from "framer-motion";
import { getMenu, onMenuUpdate, Dish, categories } from "@/lib/data";

export function Menu() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        setDishes(data);
      } catch (err) {
        console.warn("Menu fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();

    // Auto-refresh when menu is updated (same tab, other tabs, or tab switch)
    const unsubscribe = onMenuUpdate(() => fetchMenu());
    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    let result = [...dishes];

    // Filter by category
    if (active !== "All") {
      result = result.filter((d) => d.cat === active);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) =>
        d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.priceNum - b.priceNum);
        break;
      case "price-high":
        result.sort((a, b) => b.priceNum - a.priceNum);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.chef ? 1 : 0) - (a.chef ? 1 : 0));
    }

    return result;
  }, [dishes, active, search, sortBy]);

  return (
    <section id="menu" className="relative py-28 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Signature Menu</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            A Banquet of <span className="text-gradient-gold italic">Curated</span> Indulgence
          </h2>
          <div className="gold-divider mx-auto my-8 w-32" />
          <p className="text-muted-foreground">
            Each dish is a chapter in our culinary memoir — rare, refined, unforgettable.
          </p>
        </div>

        {/* Search Bar */}
        <div className="reveal mt-10 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search menu items"
              className="w-full rounded-full bg-card/60 border border-border/60 py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="reveal mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={cn(
                "rounded-full px-6 py-2.5 text-xs uppercase tracking-[0.2em] transition-all duration-500",
                active === c
                  ? "bg-primary text-primary-foreground gold-glow"
                  : "glass text-foreground/70 hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="reveal mt-6 flex flex-wrap items-center justify-center gap-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            aria-label="Sort menu items"
            className="rounded-full bg-card/60 border border-border/60 px-4 py-2 text-xs uppercase tracking-[0.1em] outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="featured">Featured</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Results Count */}
        <div className="reveal mt-4 text-center text-xs text-muted-foreground">
          Showing {filtered.length} of {dishes.length} dishes
        </div>

        {/* Dishes Grid */}
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((d, i) => (
                <motion.article
                  key={d.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={() => setSelectedDish(d)}
                  className="hover-lift group glass-strong relative cursor-pointer overflow-hidden rounded-3xl"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={d.img}
                      alt={d.name}
                      width={1024}
                      height={1024}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-70" />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      {d.chef && (
                        <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground gold-glow">
                          Chef's Pick
                        </span>
                      )}
                      {d.spiceLevel && d.spiceLevel > 0 && (
                        <span className="flex items-center gap-0.5 rounded-full bg-red-500/20 px-2 py-1 text-[10px] font-semibold text-red-400 backdrop-blur-md border border-red-500/30">
                          {Array.from({ length: d.spiceLevel }).map((_, s) => (
                            <Flame key={s} className="h-3 w-3 fill-current" />
                          ))}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full glass opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <Info className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl">{d.name}</h3>
                      <span className="font-display text-lg text-gradient-gold">{d.price}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">{d.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-primary">
                        {Array.from({ length: 5 }).map((_, k) => (
                          <Star
                            key={k}
                            className={cn("h-4 w-4", k < Math.round(d.rating) ? "fill-primary" : "opacity-30")}
                            aria-hidden="true"
                          />
                        ))}
                        <span className="ml-2 text-xs text-muted-foreground">{d.rating.toFixed(1)}</span>
                      </div>
                      {d.prepTime && (
                        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          <ClockIcon className="h-3 w-3" />
                          {d.prepTime}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-12 text-center text-muted-foreground"
              >
                <p>No dishes found. Try adjusting your filters.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick View Drawer */}
      <Drawer.Root open={!!selectedDish} onOpenChange={(open) => !open && setSelectedDish(null)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 flex flex-col rounded-t-[32px] bg-background p-6 outline-none max-h-[92vh]">
            <div className="mx-auto mb-8 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
            
            {selectedDish && (
              <div className="mx-auto w-full max-w-2xl overflow-y-auto pb-8">
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="relative aspect-square overflow-hidden rounded-2xl luxury-shadow">
                    <img 
                      src={selectedDish.img} 
                      alt={selectedDish.name} 
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      {selectedDish.chef && (
                        <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground gold-glow">
                          Signature Dish
                        </span>
                      )}
                      {selectedDish.spiceLevel && selectedDish.spiceLevel > 0 && (
                        <span className="flex items-center gap-0.5 rounded-full bg-red-500/20 px-2 py-1 text-[10px] font-semibold text-red-400 backdrop-blur-md border border-red-500/30">
                          {Array.from({ length: selectedDish.spiceLevel }).map((_, s) => (
                            <Flame key={s} className="h-3 w-3 fill-current" />
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-3xl leading-tight">{selectedDish.name}</h3>
                      <span className="font-display text-2xl text-gradient-gold">{selectedDish.price}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, k) => (
                            <Star key={k} className={cn("h-4 w-4", k < Math.round(selectedDish.rating) ? "fill-primary text-primary" : "text-muted-foreground/30")} />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{selectedDish.rating}</span>
                      </div>
                      {selectedDish.prepTime && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                          <ClockIcon className="h-3.5 w-3.5" />
                          {selectedDish.prepTime} prep
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-6 text-base leading-relaxed text-muted-foreground">{selectedDish.desc}</p>
                    
                    {selectedDish.ingredients && (
                      <div className="mt-8">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Ingredients</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {selectedDish.ingredients.map(ing => (
                            <span key={ing} className="rounded-full glass px-3 py-1 text-xs text-foreground/80">{ing}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-10 grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => setSelectedDish(null)}
                        className="rounded-full glass-strong py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all hover:bg-white/5"
                      >
                        Close
                      </button>
                      <a 
                        href="#reservation"
                        onClick={() => setSelectedDish(null)}
                        className="inline-flex items-center justify-center rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:gold-glow hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Reserve Table
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </section>
  );
}
