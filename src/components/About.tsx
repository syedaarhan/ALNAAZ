import about from "@/assets/about.jpg";
import { ChefHat, Crown, Sparkles, Users } from "lucide-react";

interface Feature {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}

const features: Feature[] = [
  { id: "authentic-recipes", icon: ChefHat, title: "Authentic Recipes", text: "Heirloom recipes from royal kitchens, untouched by time." },
  { id: "royal-ambience", icon: Crown, title: "Royal Ambience", text: "Hand-crafted interiors echoing the grandeur of nawabi courts." },
  { id: "luxury-catering", icon: Sparkles, title: "Luxury Catering", text: "Bespoke menus curated for your private celebrations." },
  { id: "family-dining", icon: Users, title: "Family Dining", text: "An intimate space where generations gather and stories unfold." },
];

export function About() {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div className="reveal relative">
          <div className="absolute -inset-6 rounded-3xl bg-primary/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl luxury-shadow">
            <img
              src={about}
              alt="Al Naaz fine dining hall with elegant royal interior decoration"
              width={1280}
              height={1280}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1.4s] hover:scale-105"
            />
          </div>
          <div className="glass absolute -bottom-8 -right-4 hidden rounded-2xl p-6 luxury-shadow md:block" aria-label="Heritage badge">
            <div className="font-display text-4xl text-gradient-gold">38</div>
            <div className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Years crafting<br />memorable evenings
            </div>
          </div>
        </div>

        <div className="reveal">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Our Story</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            A Heritage of <span className="text-gradient-gold italic">Flavour</span> &amp; Finesse
          </h2>
          <div className="gold-divider my-8 w-32" aria-hidden="true" />
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            Born from a passion to preserve the royal culinary arts of India, Al Naaz brings together
            generations of master chefs, rare spices, and a setting fit for nobility. Each dish is a
            love letter to tradition — slow-cooked, soulfully spiced, and presented with quiet
            opulence.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.id}
                  className="reveal hover-lift glass rounded-2xl p-5"
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary" aria-hidden="true">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
