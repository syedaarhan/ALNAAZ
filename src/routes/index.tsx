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
  head: () => ({
    meta: [
      { title: "Al Naaz — Royal Indian Fine Dining" },
      { name: "description", content: "Al Naaz is a luxury Indian fine dining restaurant blending royal heritage cuisine with cinematic modern elegance. Reserve your evening." },
      { property: "og:title", content: "Al Naaz — Royal Indian Fine Dining" },
      { property: "og:description", content: "A heritage of flavour & finesse. Reserve your evening at Al Naaz." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  component: Index,
});

function Index() {
  useReveal();

  // JSON-LD Schema for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Al Naaz",
    "description": "Luxury Indian fine dining restaurant blending royal heritage cuisine with cinematic modern elegance",
    "url": "https://alnaaz.com",
    "telephone": "+91 98765 43210",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "12 Heritage Mile, Banjara Hills",
      "addressLocality": "Hyderabad",
      "postalCode": "500034",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "17.4129",
      "longitude": "78.4257"
    },
    "image": "https://alnaaz.com/hero.jpg",
    "priceRange": "₹₹₹",
    "servesCuisine": "Indian",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "230"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "12:00",
        "closes": "23:30"
      }
    ]
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
