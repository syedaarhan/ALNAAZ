import signature from "@/assets/signature.jpg";
import { ArrowRight, Flame } from "lucide-react";

export function SpecialDish() {
  return (
    <section className="relative isolate overflow-hidden py-28 md:py-36">
      <img
        src={signature}
        alt="Signature Hyderabadi biryani"
        width={1920}
        height={1080}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20 dark:from-background dark:via-background/85 dark:to-background/30" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-80 w-80 rounded-full bg-primary/30 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-xl reveal">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs uppercase tracking-[0.28em] text-primary">
            <Flame className="h-3.5 w-3.5" /> Chef's Signature
          </div>
          <h2 className="mt-6 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            The <span className="text-gradient-gold italic">Nizami</span> Dum&nbsp;Biryani
          </h2>
          <div className="gold-divider my-8 w-32" />
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Aged basmati layered with spice-infused lamb, sealed in a copper handi and slow-cooked
            on coals for four hours. Unveiled at your table — a moment of theatre, a taste of
            history.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <a
              href="#reservation"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-all duration-500 hover:gold-glow"
            >
              Reserve Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <div>
              <div className="font-display text-3xl text-gradient-gold">₹ 720</div>
              <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Serves Two
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
