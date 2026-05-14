import { useEffect, useState, useRef } from "react";
import hero from "@/assets/hero.jpg";
import { ArrowRight, UtensilsCrossed, Sparkles } from "lucide-react";

export function Hero() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setMousePos({
        x: (clientX / window.innerWidth - 0.5) * 20,
        y: (clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section 
      id="home" 
      ref={sectionRef}
      className="relative isolate flex min-h-screen items-center overflow-hidden"
    >
      <div 
        className="absolute inset-0 z-0 will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.4}px, 0)` }}
      >
        <img
          src={hero}
          alt="Al Naaz luxury Indian restaurant interior"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
          style={{ transform: `scale(${1 + scrollY * 0.0005})` }}
        />
      </div>
      
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/70 via-background/40 to-background" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background/80 via-background/30 to-transparent" />

      {/* floating glow orbs with mouse reactivity */}
      <div 
        className="pointer-events-none absolute -left-20 top-1/3 z-[2] h-72 w-72 rounded-full bg-primary/30 blur-[120px] animate-[glow_4s_ease-in-out_infinite]" 
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      />
      <div 
        className="pointer-events-none absolute -right-20 bottom-20 z-[2] h-96 w-96 rounded-full bg-primary/20 blur-[140px] animate-[glow_5s_ease-in-out_infinite]" 
        style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)` }}
      />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 z-[3]">
        <Particle x={20} y={40} delay={0} size={1} />
        <Particle x={70} y={20} delay={1} size={2} />
        <Particle x={40} y={80} delay={2} size={1} />
        <Particle x={90} y={60} delay={3} size={2} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 pb-24">
        <div 
          className="max-w-3xl animate-[fade-up_1.2s_cubic-bezier(0.22,1,0.36,1)_both]"
          style={{ transform: `translateY(${-scrollY * 0.1}px)` }}
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-3 w-3 animate-pulse" />
            Fine Indian Dining · Est. 1987
          </div>
          <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-[88px]">
            Experience{" "}
            <span className="text-gradient-gold italic">Royal</span>
            <br />
            Dining
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Where centuries-old recipes from the courts of Hyderabad and Lucknow meet modern
            elegance. Every plate, a heritage; every evening, a celebration.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#reservation"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:gold-glow"
            >
              Reserve Table
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#menu"
              className="group inline-flex items-center gap-3 rounded-full glass px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition-all duration-500 hover:border-primary"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Explore Menu
            </a>
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm text-muted-foreground">
            <Stat n="38" label="Years of Heritage" />
            <span className="hidden h-8 w-px bg-border sm:block" />
            <Stat n="120+" label="Signature Dishes" />
            <span className="hidden h-8 w-px bg-border sm:block" />
            <Stat n="4.9★" label="Guest Rating" />
          </div>
        </div>
      </div>

      {/* curved divider */}
      <svg
        className="absolute bottom-0 left-0 right-0 z-20 w-full text-background"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,40 C480,120 960,-20 1440,60 L1440,100 L0,100 Z" fill="currentColor" />
      </svg>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="reveal">
      <div className="font-display text-3xl text-gradient-gold">{n}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.2em]">{label}</div>
    </div>
  );
}

function Particle({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <div 
      className="absolute animate-[float_8s_ease-in-out_infinite] rounded-full bg-primary/20 blur-[1px]"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`, 
        width: `${size * 4}px`, 
        height: `${size * 4}px`,
        animationDelay: `${delay}s` 
      }}
    />
  );
}
