import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import about from "@/assets/about.jpg";
import biryani from "@/assets/dish-biryani.jpg";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  span: string;
}

const items: GalleryItem[] = [
  { id: "royal-thali", src: g1, alt: "Royal thali", span: "row-span-2" },
  { id: "private-booth", src: g2, alt: "Private dining booth", span: "" },
  { id: "tandoor-chef", src: g3, alt: "Tandoor chef at work", span: "row-span-2" },
  { id: "interior", src: about, alt: "Restaurant interior", span: "" },
  { id: "table-setting", src: g4, alt: "Elegant table setting", span: "" },
  { id: "signature-biryani", src: biryani, alt: "Signature biryani", span: "" },
];

export function Gallery() {
  return (
    <section id="gallery" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-primary">Gallery</p>
          <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
            Moments in <span className="text-gradient-gold italic">Gold</span>
          </h2>
          <div className="gold-divider mx-auto my-8 w-32" />
        </div>

        <div className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {items.map((it, idx) => (
            <figure
              key={it.id}
              className={`reveal group relative overflow-hidden rounded-2xl luxury-shadow ${it.span}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <img
                src={it.src}
                alt={it.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 p-5 text-sm font-medium uppercase tracking-[0.2em] text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {it.alt}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
