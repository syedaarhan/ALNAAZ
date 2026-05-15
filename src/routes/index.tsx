import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Menu } from "@/components/Menu";
import { SpecialDish } from "@/components/SpecialDish";
import { Gallery } from "@/components/Gallery";
import { Events } from "@/components/Events";
import { Reviews } from "@/components/Reviews";
import { Reservation } from "@/components/Reservation";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  useReveal();

  // JSON-LD Schema for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Al Naaz",
    description:
      "Luxury Indian fine dining restaurant blending royal heritage cuisine with cinematic modern elegance",
    url: "https://alnaaz.com",
    telephone: "+91 98765 43210",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Robertsonpet Road, Oorgaumpet",
      addressLocality: "KGF",
      postalCode: "563121",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "17.4129",
      longitude: "78.4257",
    },
    image: "https://alnaaz.com/hero.jpg",
    priceRange: "₹₹₹",
    servesCuisine: "Indian",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "230",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "12:00",
        closes: "23:30",
      },
    ],
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <Navbar />
      <main>
        <Hero />
        <About />
        <Menu />
        <SpecialDish />
        <Gallery />
        <Events />
        <Reviews />
        <Reservation />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
