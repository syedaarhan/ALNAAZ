import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { 
  LayoutDashboard, 
  Utensils, 
  CalendarCheck, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ChevronRight,
  TrendingUp,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getMenu, saveMenu, getReservations, updateReservationStatus, Dish, Reservation, categories } from "@/lib/data";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"menu" | "reservations">("menu");
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("alnaaz_auth");
    if (auth !== "true") {
      navigate({ to: "/admin/login" });
    }
    setDishes(getMenu());
    setReservations(getReservations());
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("alnaaz_auth");
    navigate({ to: "/admin/login" });
  };

  const deleteDish = (id: string) => {
    const updated = dishes.filter(d => d.id !== id);
    setDishes(updated);
    saveMenu(updated);
  };

  const handleStatusChange = (id: string, status: Reservation["status"]) => {
    updateReservationStatus(id, status);
    setReservations(getReservations());
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-xl flex flex-col">
        <div className="p-8">
          <h2 className="font-display text-2xl text-gradient-gold">Al Naaz</h2>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Management</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => setActiveTab("menu")}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all",
              activeTab === "menu" ? "bg-primary text-primary-foreground gold-glow" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <Utensils className="h-4 w-4" />
            Menu Editor
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all",
              activeTab === "reservations" ? "bg-primary text-primary-foreground gold-glow" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
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
              {activeTab === "menu" ? "Curate the royal dining experience" : "Manage guest bookings and seating"}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              Live Server
            </div>
          </div>
        </header>

        {activeTab === "menu" ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard icon={Utensils} label="Total Dishes" value={dishes.length} />
              <StatCard icon={TrendingUp} label="Popular Category" value="Biryani" />
              <StatCard icon={Users} label="Active Guests" value="24" />
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-display">Dish Registry</h3>
              <button 
                onClick={() => alert("Add Dish feature coming soon!")}
                className="flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/20 transition-all"
              >
                <Plus className="h-4 w-4" /> Add New Dish
              </button>
            </div>

            <div className="grid gap-4">
              {dishes.map((dish) => (
                <div key={dish.id} className="glass-strong rounded-2xl p-4 flex items-center gap-6 group transition-all hover:border-primary/30">
                  <img src={dish.img} className="h-16 w-16 rounded-xl object-cover" alt="" />
                  <div className="flex-1">
                    <h4 className="font-medium">{dish.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{dish.desc}</p>
                  </div>
                  <div className="text-right px-6 border-x border-border/50">
                    <p className="text-gradient-gold font-display text-lg">{dish.price}</p>
                    <p className="text-[10px] uppercase tracking-tighter text-muted-foreground">{dish.cat}</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-primary"><Edit3 className="h-4 w-4" /></button>
                    <button onClick={() => deleteDish(dish.id)} className="p-2 hover:bg-red-500/10 rounded-full text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
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
                          <span className="glass px-3 py-1 rounded-full text-xs">{res.guests} Guests</span>
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
                            <button className="p-2 rounded-full hover:bg-white/5 text-muted-foreground"><ChevronRight className="h-5 w-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic">
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

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) {
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
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20"
  };
  
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider border", styles[status])}>
      {status}
    </span>
  );
}
