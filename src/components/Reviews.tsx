import { useEffect, useState, useCallback } from "react";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const reviews = [
  {
    id: "review-1",
    name: "Aarav Mehta",
    role: "Food Critic, The Palate",
    text: "Al Naaz isn't a restaurant — it's a journey through the courts of old India. Every bite of the Nizami biryani made me close my eyes.",
    avatar: "https://i.pravatar.cc/200?img=12",
    rating: 5,
  },
  {
    id: "review-2",
    name: "Priya Khanna",
    role: "Bride, 2025",
    text: "We hosted 400 guests for our wedding banquet. The team turned our evening into something out of a Sabyasachi film. Flawless.",
    avatar: "https://i.pravatar.cc/200?img=47",
    rating: 5,
  },
  {
    id: "review-3",
    name: "Rohan Iyer",
    role: "Repeat Guest",
    text: "The galouti kebabs alone are worth crossing the city for. Service is unobtrusive, the room glows, the wine list is considered.",
    avatar: "https://i.pravatar.cc/200?img=33",
    rating: 5,
  },
];

export function Reviews() {
  const [i, setI] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Auto-rotate reviews
  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(() => setI((v) => (v + 1) % reviews.length), 6000);
    return () => clearInterval(t);
  }, [autoplay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const goToNext = useCallback(() => {
    setI((v) => (v + 1) % reviews.length);
    setAutoplay(false);
  }, []);

  const goToPrevious = useCallback(() => {
    setI((v) => (v - 1 + reviews.length) % reviews.length);
    setAutoplay(false);
  }, []);

  return (
    <section id="reviews" className="relative py-28 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]" />
      <div className="mx-auto max-w-5xl px-6">
        <div className="reveal text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Guest Reviews</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            Voices of <span className="text-gradient-gold italic">Our Guests</span>
          </h2>
          <div className="gold-divider mx-auto my-8 w-32" />
        </div>

        <div
          className="reveal relative mt-12 min-h-[340px]"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          {reviews.map((r, idx) => (
            <article
              key={r.id}
              className={cn(
                "absolute inset-0 glass-strong rounded-3xl p-10 luxury-shadow transition-all duration-700 md:p-14",
                idx === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
              )}
            >
              <Quote className="h-10 w-10 text-primary/70" />
              <p className="mt-6 font-display text-2xl leading-snug md:text-3xl">
                "{r.text}"
              </p>
              <div className="mt-8 flex items-center gap-4">
                <img
                  src={r.avatar}
                  alt={r.name}
                  loading="lazy"
                  className="h-14 w-14 rounded-full border-2 border-primary/40 object-cover"
                />
                <div>
                  <div className="font-display text-lg">{r.name}</div>
                  <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{r.role}</div>
                </div>
                <div className="ml-auto flex gap-1 text-primary">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={goToPrevious}
            aria-label="Previous review"
            className="flex h-10 w-10 items-center justify-center rounded-full glass text-foreground/80 transition-all hover:text-primary hover:gold-glow"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to review ${idx + 1}`}
                onClick={() => {
                  setI(idx);
                  setAutoplay(false);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  idx === i ? "w-10 bg-primary" : "w-4 bg-primary/30"
                )}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            aria-label="Next review"
            className="flex h-10 w-10 items-center justify-center rounded-full glass text-foreground/80 transition-all hover:text-primary hover:gold-glow"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
