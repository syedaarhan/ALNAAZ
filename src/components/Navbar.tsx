import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

const links = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Events", href: "#events" },
  { label: "Reviews", href: "#reviews" },
  { label: "Reservation", href: "#reservation" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrolled(currentScrollY > 40);
          
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(totalHeight > 0 ? (currentScrollY / totalHeight) * 100 : 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-6"
      )}
    >
      {/* Scroll Progress Indicator */}
      <div 
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-300"
        style={{ width: `${progress}%` }}
      />

      <div
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500",
          scrolled
            ? "glass-strong rounded-full luxury-shadow mx-4 md:mx-auto py-2.5"
            : "bg-transparent py-2"
        )}
      >
        <a href="#home" className="group flex items-center gap-3" aria-label="Al Naaz Home">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-primary/20 transition-transform duration-500 group-hover:scale-110">
            <img src={logo} alt="" className="h-full w-full object-cover" />
          </div>
          <span className="font-display text-2xl tracking-[0.18em] text-gradient-gold">
            AL&nbsp;NAAZ
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="underline-gold text-sm font-medium uppercase tracking-[0.14em] text-foreground/80 transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="glass flex h-10 w-10 items-center justify-center rounded-full lg:hidden focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden",
          "transition-all duration-500",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-x-4 top-[88px] z-50 origin-top rounded-3xl glass-strong luxury-shadow lg:hidden",
          "transition-all duration-500",
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
          scrolled ? "top-[72px]" : "top-[88px]"
        )}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <nav className="flex flex-col gap-1 p-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={handleLinkClick}
              className="rounded-xl px-4 py-3 text-sm font-medium uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
