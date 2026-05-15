import { ArrowUpRight, Building2, Cake, HeartHandshake, Users2 } from "lucide-react";

const events = [
  {
    icon: HeartHandshake,
    title: "Wedding Catering",
    text: "Bespoke royal banquets for the most cherished evening of your life.",
    img: "from-rose-500/20 to-amber-500/10",
  },
  {
    icon: Cake,
    title: "Birthday Soirées",
    text: "Intimate celebrations elevated by personal menus and golden touches.",
    img: "from-amber-500/20 to-yellow-500/10",
  },
  {
    icon: Building2,
    title: "Corporate Dining",
    text: "Refined private rooms for conversations that move worlds forward.",
    img: "from-stone-500/20 to-amber-500/10",
  },
  {
    icon: Users2,
    title: "Family Gatherings",
    text: "Long tables, warm lights, and dishes that feel like home — only finer.",
    img: "from-amber-600/20 to-orange-500/10",
  },
];

export function Events() {
  return (
    <section id="events" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Events &amp; Catering</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            Occasions, <span className="text-gradient-gold italic">Crafted</span> with Care
          </h2>
          <div className="gold-divider mx-auto my-8 w-32" />
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {events.map((e, i) => (
            <article
              key={e.title}
              className="hover-lift group relative overflow-hidden rounded-3xl glass-strong p-7"
              style={{ animation: `fade-up 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 90}ms both` }}
            >
              <div
                className={`absolute -inset-px rounded-3xl bg-gradient-to-br ${e.img} opacity-60`}
              />
              <div className="relative">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <e.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl">{e.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.text}</p>
                <a
                  href="#reservation"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary transition-all hover:gap-3"
                >
                  Book Now <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
