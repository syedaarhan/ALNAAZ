import { useState, useEffect, useTransition } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Utensils,
  CalendarCheck,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  RefreshCw,
  Loader2,
  ImagePlus,
  Upload,
  Pencil,
  ChefHat,
  Flame,
  MessageSquare,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getMenu,
  saveMenu,
  deleteDishFromDb,
  getReservations,
  updateReservationStatus,
  deleteReservation,
  compressImage,
  clearCache,
  Dish,
  Reservation,
  categories,
} from "@/lib/data";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"menu" | "reservations">("menu");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [expandedRes, setExpandedRes] = useState<string | null>(null);

  const emptyDish: Partial<Dish> = {
    name: "",
    desc: "",
    price: "",
    cat: "Starters",
    img: "",
    priceNum: 0,
    rating: 5.0,
    chef: false,
    spiceLevel: 0,
    prepTime: "",
    ingredients: [],
  };
  const [newDish, setNewDish] = useState<Partial<Dish>>(emptyDish);

  const isModalOpen = isAdding || !!editingDish;
  const modalDish = newDish;
  const closeModal = () => { setIsAdding(false); setEditingDish(null); setNewDish(emptyDish); };

  // Initial load — uses cache, doesn't lose data
  const loadData = async () => {
    setIsLoading(true);
    const [menuData, resData] = await Promise.all([getMenu(), getReservations()]);
    setDishes(menuData);
    setReservations(resData);
    setIsLoading(false);
  };

  // Manual refresh — clears cache, re-fetches everything fresh
  const refreshData = async () => {
    setIsLoading(true);
    clearCache();
    const [menuData, resData] = await Promise.all([getMenu(), getReservations()]);
    setDishes(menuData);
    setReservations(resData);
    setIsLoading(false);
  };

  useEffect(() => {
    const auth = localStorage.getItem("alnaaz_auth");
    if (auth !== "true") {
      navigate({ to: "/admin/login" });
      return;
    }
    loadData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("alnaaz_auth");
    navigate({ to: "/admin/login" });
  };

  const showSaveSuccess = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const deleteDish = async (id: string) => {
    const updated = dishes.filter((d) => d.id !== id);
    setDishes(updated);
    const result = await deleteDishFromDb(id);
    if (!result.ok) {
      // Also try the upsert approach
      await saveMenu(updated);
    }
    showSaveSuccess("Dish removed from menu");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const raw = ev.target?.result as string;
      const compressed = await compressImage(raw);
      setNewDish((prev) => ({ ...prev, img: compressed }));
    };
    reader.readAsDataURL(file);
  };

  const openEditModal = (dish: Dish) => {
    setNewDish({ ...dish });
    setEditingDish(dish);
  };

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    const dish: Dish = {
      ...(newDish as Dish),
      id: editingDish ? editingDish.id :
        newDish.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || Math.random().toString(36).substr(2, 9),
      priceNum: parseInt(newDish.price?.replace(/[^0-9]/g, "") || "0"),
      rating: newDish.rating || 5.0,
      img: newDish.img || "",
      chef: newDish.chef || false,
      spiceLevel: (newDish.spiceLevel || 0) as 0|1|2|3,
      prepTime: newDish.prepTime || "",
      ingredients: newDish.ingredients || [],
    };

    const updated = editingDish
      ? dishes.map((d) => (d.id === editingDish.id ? dish : d))
      : [...dishes, dish];
    setDishes(updated);

    const result = await saveMenu(updated);
    setIsSaving(false);

    if (!result.ok) {
      setSaveError(result.error || "Failed to save.");
    }

    closeModal();
    showSaveSuccess(editingDish ? `"${dish.name}" updated` : `"${dish.name}" added to menu`);
  };

  const handleStatusChange = async (id: string, status: Reservation["status"]) => {
    // Optimistic update
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

    const result = await updateReservationStatus(id, status);
    if (!result.ok) {
      setSaveError(result.error || "Failed to update status.");
      // Revert
      const fresh = await getReservations();
      setReservations(fresh);
    } else {
      showSaveSuccess(`Reservation ${status}`);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (!confirm("Delete this reservation?")) return;
    setReservations((prev) => prev.filter((r) => r.id !== id));
    const result = await deleteReservation(id);
    if (!result.ok) {
      setSaveError("Failed to delete reservation.");
      loadData();
    } else {
      showSaveSuccess("Reservation deleted");
    }
  };

  const openAddModal = () => {
    setNewDish(emptyDish);
    startTransition(() => { setIsAdding(true); });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Add Dish Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
          onClick={closeModal}
        >
          <div
            className="glass-strong w-full max-w-lg rounded-3xl p-8 luxury-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display">{editingDish ? "Edit Dish" : "New Culinary Creation"}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/5 rounded-full text-muted-foreground">
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Dish Name
                  </label>
                  <input
                    required
                    className="w-full rounded-2xl bg-white/5 border border-white/10 py-3 px-4 text-sm outline-none focus:border-primary transition-all"
                    placeholder="e.g. Royal Shahi Paneer"
                    value={newDish.name}
                    onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Category
                  </label>
                  <select
                    className="w-full rounded-2xl bg-white/5 border border-white/10 py-3 px-4 text-sm outline-none focus:border-primary transition-all appearance-none"
                    value={newDish.cat}
                    onChange={(e) => setNewDish({ ...newDish, cat: e.target.value })}
                  >
                    {categories
                      .filter((c) => c !== "All")
                      .map((c) => (
                        <option key={c} value={c} className="bg-background">
                          {c}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Price (₹)
                  </label>
                  <input
                    required
                    className="w-full rounded-2xl bg-white/5 border border-white/10 py-3 px-4 text-sm outline-none focus:border-primary transition-all"
                    placeholder="e.g. ₹ 450"
                    value={newDish.price}
                    onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    className="w-full rounded-2xl bg-white/5 border border-white/10 py-3 px-4 text-sm outline-none focus:border-primary transition-all resize-none"
                    placeholder="Tell the story of this dish..."
                    value={newDish.desc}
                    onChange={(e) => setNewDish({ ...newDish, desc: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Dish Photo <span className="text-muted-foreground/50">(optional, max 2MB)</span>
                  </label>
                  {newDish.img ? (
                    <div className="relative group">
                      <img
                        src={newDish.img}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-2xl border border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => setNewDish({ ...newDish, img: "" })}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                      <ImagePlus className="h-8 w-8 text-muted-foreground/40 mb-2" />
                      <span className="text-xs text-muted-foreground">Click to upload image</span>
                      <span className="text-[10px] text-muted-foreground/50 mt-1">
                        JPG, PNG, WebP
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Advanced Options */}
              <details className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                <summary className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer">Advanced Options</summary>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={!!newDish.chef} onChange={(e) => setNewDish({...newDish, chef: e.target.checked})} className="rounded" />
                    <ChefHat className="h-4 w-4 text-primary" />
                    <span className="text-sm">Chef's Pick</span>
                  </label>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Spice Level</label>
                    <div className="flex gap-1">
                      {[0,1,2,3].map((lvl) => (
                        <button key={lvl} type="button" onClick={() => setNewDish({...newDish, spiceLevel: lvl as 0|1|2|3})}
                          className={cn("p-2 rounded-lg transition-all", (newDish.spiceLevel || 0) >= lvl && lvl > 0 ? "bg-red-500/20 text-red-400" : "bg-white/5 text-muted-foreground")}>
                          {lvl === 0 ? "None" : <Flame className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Prep Time</label>
                    <input className="w-full rounded-xl bg-white/5 border border-white/10 py-2 px-3 text-sm outline-none" placeholder="e.g. 25 min"
                      value={newDish.prepTime || ""} onChange={(e) => setNewDish({...newDish, prepTime: e.target.value})} />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Ingredients (comma-separated)</label>
                    <input className="w-full rounded-xl bg-white/5 border border-white/10 py-2 px-3 text-sm outline-none" placeholder="e.g. Paneer, Spices, Cream"
                      value={(newDish.ingredients || []).join(", ")} onChange={(e) => setNewDish({...newDish, ingredients: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} />
                  </div>
                </div>
              </details>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full group mt-4 flex items-center justify-center gap-3 rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:gold-glow disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>{editingDish ? "Save Changes ✦" : "Launch to Menu ✦"}</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-xl flex flex-col">
        <div className="p-8">
          <h2 className="font-display text-2xl text-gradient-gold">Al Naaz</h2>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
            Management
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => setActiveTab("menu")}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all",
              activeTab === "menu"
                ? "bg-primary text-primary-foreground gold-glow"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            <Utensils className="h-4 w-4" />
            Menu Editor
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all",
              activeTab === "reservations"
                ? "bg-primary text-primary-foreground gold-glow"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )}
          >
            <CalendarCheck className="h-4 w-4" />
            Reservations
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-display">
              {activeTab === "menu" ? "Signature Menu Management" : "Live Reservations"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeTab === "menu"
                ? "Curate the royal dining experience"
                : "Manage guest bookings and seating"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="glass px-4 py-2 rounded-full flex items-center gap-2 text-xs hover:bg-white/5 transition-all disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
              Refresh
            </button>
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
          </div>
        </header>

        {/* Status Messages */}

        {saveError && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
            <XCircle className="h-5 w-5 shrink-0" />
            <span>{saveError}</span>
            <button
              onClick={() => setSaveError(null)}
              className="ml-auto p-1 hover:bg-white/5 rounded-full"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}

        {saveSuccess && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-400">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : activeTab === "menu" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard icon={Utensils} label="Total Dishes" value={dishes.length} />
              <StatCard
                icon={TrendingUp}
                label="Categories"
                value={new Set(dishes.map((d) => d.cat)).size}
              />
              <StatCard icon={Users} label="Reservations" value={reservations.length} />
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display">Dish Registry</h3>
              <button
                onClick={openAddModal}
                disabled={isPending}
                className="flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/20 transition-all disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add New Dish
              </button>
            </div>

            <div className="grid gap-4">
              {dishes.length > 0 ? (
                dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="glass-strong rounded-2xl p-4 flex items-center gap-6 group transition-all hover:border-primary/30"
                  >
                    {dish.img ? (
                      <img
                        src={dish.img}
                        className="h-16 w-16 rounded-xl object-cover"
                        alt={dish.name}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Utensils className="h-6 w-6 text-primary/40" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{dish.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{dish.desc}</p>
                    </div>
                    <div className="text-right px-6 border-x border-border/50">
                      <p className="text-gradient-gold font-display text-lg">{dish.price}</p>
                      <p className="text-[10px] uppercase tracking-tighter text-muted-foreground">
                        {dish.cat}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(dish)}
                        className="p-2 hover:bg-primary/10 rounded-full text-muted-foreground hover:text-primary"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteDish(dish.id)}
                        className="p-2 hover:bg-red-500/10 rounded-full text-muted-foreground hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-muted-foreground italic">
                  No dishes yet. Click "Add New Dish" to begin.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass-strong rounded-3xl overflow-hidden border border-border/50">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Pax</th>
                    <th className="px-6 py-4">Requests</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {reservations.length > 0 ? (
                    reservations.map((res) => (
                      <tr key={res.id} className="group hover:bg-white/[0.02] transition-all">
                        <td className="px-6 py-5">
                          <p className="font-medium">{res.name}</p>
                          <p className="text-xs text-muted-foreground">{res.phone}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3 text-primary" />
                            {res.date} at {res.time}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="glass px-3 py-1 rounded-full text-xs">
                            {res.guests} Guests
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {res.requests ? (
                            <button onClick={() => setExpandedRes(expandedRes === res.id ? null : res.id)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all">
                              <MessageSquare className="h-3 w-3 text-primary" />
                              {expandedRes === res.id ? res.requests : (res.requests.length > 30 ? res.requests.slice(0, 30) + "..." : res.requests)}
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground/40 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <StatusBadge status={res.status} />
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {res.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(res.id, "confirmed")}
                                  className="p-2 rounded-full hover:bg-green-500/10 text-green-500 transition-all"
                                  title="Confirm"
                                >
                                  <CheckCircle2 className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(res.id, "cancelled")}
                                  className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-all"
                                  title="Cancel"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteReservation(res.id)}
                              className="p-2 rounded-full hover:bg-red-500/10 text-red-400/50 hover:text-red-500 transition-all"
                              title="Delete reservation"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground italic">
                        No reservations recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="glass-strong rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Icon className="h-16 w-16" />
      </div>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-display text-gradient-gold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Reservation["status"] }) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
