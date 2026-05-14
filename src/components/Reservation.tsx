import { useState } from "react";
import { CalendarDays, Clock, Sparkles, Users, CheckCircle, AlertCircle, User, Phone } from "lucide-react";
import about from "@/assets/about.jpg";
import { cn } from "@/lib/utils";

interface ReservationFormData {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  requests: string;
}

interface FormErrors {
  [key: string]: string;
}

export function Reservation() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<ReservationFormData>({
    name: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    requests: "",
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!/^[\d\s+-]{7,}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
    if (!formData.date) newErrors.date = "Date is required";

    const selectedDate = new Date(formData.date);
    selectedDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      newErrors.date = "Date cannot be in the past";
    }

    if (!formData.time) newErrors.time = "Time is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, send to backend:
      // const response = await fetch('/api/reservations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      setSubmitted(true);
      setFormData({ name: "", phone: "", date: "", time: "", guests: "2", requests: "" });

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setErrors({ submit: "Failed to submit reservation. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reservation" className="relative isolate overflow-hidden py-28 md:py-36">
      <img
        src={about}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      <div className="pointer-events-none absolute right-10 top-20 h-72 w-72 rounded-full bg-primary/25 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center">
        <div className="reveal">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Reservation</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            Reserve Your <span className="text-gradient-gold italic">Evening</span>
          </h2>
          <div className="gold-divider my-8 w-32" />
          <p className="max-w-md text-muted-foreground">
            Tables are limited and curated. Share a few details and our concierge will confirm your
            reservation within the hour.
          </p>
          <div className="mt-10 space-y-5 text-sm">
            <Bullet icon={CalendarDays}>Open daily, 12:00 — 23:30</Bullet>
            <Bullet icon={Sparkles}>Smart elegant attire appreciated</Bullet>
            <Bullet icon={Users}>Private rooms for parties of 8+</Bullet>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="reveal glass-strong rounded-3xl p-7 luxury-shadow md:p-10"
        >
          {submitted && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-green-500/15 px-4 py-3 text-sm text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Reservation received! We'll confirm within the hour.</span>
            </div>
          )}

          {errors.submit && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" error={errors.name}>
              <div className={cn("input-luxury flex items-center gap-3", errors.name ? "border-red-500" : "")}>
                <User className="h-4 w-4 shrink-0 text-primary" />
                <input
                  required
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </Field>
            <Field label="Phone" error={errors.phone}>
              <div className={cn("input-luxury flex items-center gap-3", errors.phone ? "border-red-500" : "")}>
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </Field>
            <Field label="Date" error={errors.date}>
              <div className={cn("input-luxury flex items-center gap-3", errors.date ? "border-red-500" : "")}>
                <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </Field>
            <Field label="Time" error={errors.time}>
              <div className={cn("input-luxury flex items-center gap-3", errors.time ? "border-red-500" : "")}>
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                <input
                  required
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </Field>
            <Field label="Guests" className="sm:col-span-2">
              <div className="input-luxury flex items-center gap-3">
                <Users className="h-4 w-4 shrink-0 text-primary" />
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full bg-transparent outline-none appearance-none"
                >
                  {[1,2,3,4,5,6,7,8,"9+"].map((n)=>(<option key={String(n)} value={String(n)} className="bg-background text-foreground">{n} {Number(n)===1?"Guest":"Guests"}</option>))}
                </select>
              </div>
            </Field>
            <Field label="Special Requests" className="sm:col-span-2">
              <textarea
                rows={3}
                placeholder="Allergies, occasion, preferences…"
                value={formData.requests}
                onChange={(e) => setFormData({ ...formData, requests: e.target.value })}
                className="input-luxury resize-none"
              />
            </Field>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="group mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all duration-500 hover:gold-glow disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : submitted ? "Reservation Received ✦" : "Confirm Reservation"}
          </button>
        </form>
      </div>

      <style>{`
        .input-luxury {
          width: 100%;
          background: color-mix(in oklab, var(--background) 60%, transparent);
          border: 1px solid var(--border);
          border-radius: 9999px;
          padding: 12px 18px;
          font-size: 14px;
          color: var(--foreground);
          outline: none;
          transition: border-color .3s, box-shadow .3s, background .3s;
          cursor: text;
        }
        .input-luxury:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--primary) 20%, transparent);
          background: color-mix(in oklab, var(--background) 80%, transparent);
        }
        textarea.input-luxury { border-radius: 22px; padding: 14px 18px; }
        .input-luxury input::placeholder, 
        .input-luxury textarea::placeholder { 
          color: var(--muted-foreground); 
          opacity: 0.7;
        }
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          background: transparent;
          bottom: 0;
          color: transparent;
          cursor: pointer;
          height: auto;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: auto;
        }
      `}</style>
    </section>
  );
}

function Field({ label, children, className = "", error }: { label: string; children: React.ReactNode; className?: string; error?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        {label}
        {error && <span className="ml-2 text-red-500">*</span>}
      </span>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
}

function Bullet({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-foreground/85">{children}</span>
    </div>
  );
}
