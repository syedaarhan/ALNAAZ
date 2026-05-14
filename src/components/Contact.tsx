import { Clock, Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Contact</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            Find Us at <span className="text-gradient-gold italic">Al Naaz</span>
          </h2>
          <div className="gold-divider mx-auto my-8 w-32" />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          <div className="reveal grid gap-5 lg:col-span-2">
            <Card icon={MapPin} title="Address" lines={["Opposite Robertsonpet Police Station", "Oorgaumpet, KGF, Karnataka 563122"]} />
            <Card icon={Phone} title="Reservations" lines={["+91 8153 123456", "+91 98765 43210"]} />
            <Card icon={Mail} title="Email" lines={["concierge@alnaaz.com", "events@alnaaz.com"]} />
            <Card icon={Clock} title="Opening Hours" lines={["Mon — Sun · 12:00 — 23:30", "Friday · 13:30 — 23:30"]} />

            <div className="glass rounded-2xl p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Follow</p>
              <div className="mt-3 flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full glass text-foreground/80 transition-all duration-500 hover:text-primary hover:gold-glow"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal relative overflow-hidden rounded-3xl luxury-shadow lg:col-span-3 min-h-[480px]">
            <iframe
              title="Al Naaz location on map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=78.267%2C12.955%2C78.275%2C12.960&amp;layer=mapnik&amp;marker=12.9577%2C78.2710"
              className="absolute inset-0 h-full w-full grayscale-[40%] contrast-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=12.957759,78.271032" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground gold-glow transition-transform hover:scale-105 active:scale-95"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ icon: Icon, title, lines }: { icon: React.ComponentType<{ className?: string }>; title: string; lines: string[] }) {
  return (
    <div className="hover-lift glass rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">{title}</p>
          {lines.map((l) => (
            <p key={l} className="mt-1 text-sm text-foreground/85">{l}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
