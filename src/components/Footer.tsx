import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Events", href: "#events" },
  { label: "Reservation", href: "#reservation" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 pt-20 pb-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-3xl gold-divider" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="mb-6 flex items-center gap-4">
            <div className="h-14 w-14 overflow-hidden rounded-full border border-primary/20">
              <img src={logo} alt="Al Naaz Logo" className="h-full w-full object-cover" />
            </div>
            <div className="font-display text-3xl tracking-[0.2em] text-gradient-gold">
              AL&nbsp;NAAZ
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Where every plate tells the story of an empire. A modern temple to the ancient art of
            Indian fine dining.
          </p>
          <div className="mt-6 flex gap-3" role="list">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${label}`}
                className="flex h-10 w-10 items-center justify-center rounded-full glass text-foreground/80 transition-all hover:text-primary hover:gold-glow focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="underline-gold inline-block text-foreground/80 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded px-1 py-0.5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-primary">
            Visit
          </p>
          <ul className="mt-4 space-y-2 text-sm text-foreground/80">
            <li>Robertsonpet Road</li>
            <li>Oorgaumpet, KGF</li>
            <li>
              <a href="tel:+918153123456" className="hover:text-foreground transition-colors">
                +91 8153 123456
              </a>
            </li>
            <li>
              <a
                href="mailto:concierge@alnaaz.com"
                className="hover:text-foreground transition-colors"
              >
                concierge@alnaaz.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl px-6">
        <div className="gold-divider mb-6" />
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Al Naaz Fine Dining. All rights reserved.</p>
          <p className="tracking-[0.2em] uppercase">Crafted with golden devotion</p>
        </div>
      </div>
    </footer>
  );
}
