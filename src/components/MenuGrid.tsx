import { useMemo, useState } from "react";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import { menu, type MenuItem } from "@/data/menu";
import { productImages } from "@/data/productImages";
import { useCart } from "@/lib/cart-store";


// Category-based fallback photos (Unsplash CDN, stable IDs).
// Used when a Wolt image URL fails to load — keeps the grid visually intact.
const FALLBACKS: Record<string, string[]> = {
  "ΚΑΦΕΔΕΣ": [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=70&auto=format&fit=crop",
  ],
  "ΡΟΦΗΜΑΤΑ ΣΟΚΟΛΑΤΑΣ": [
    "https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542990253-a781e04c0082?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=70&auto=format&fit=crop",
  ],
  "ΦΥΣΙΚΟΙ ΧΥΜΟΙ": [
    "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=70&auto=format&fit=crop",
  ],
  "SMOOTHIES": [
    "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1638176067000-9e2ff6a3a8d9?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=600&q=70&auto=format&fit=crop",
  ],
  "MILKSHAKES": [
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1626202378086-7c3e9f0c2f1c?w=600&q=70&auto=format&fit=crop",
  ],
  "SNACKS": [
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=70&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600&q=70&auto=format&fit=crop",
  ],
};
const GENERIC_FALLBACK = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=70&auto=format&fit=crop";

function pickFallback(category: string, i: number): string {
  const pool = FALLBACKS[category];
  if (!pool || pool.length === 0) return GENERIC_FALLBACK;
  return pool[i % pool.length];
}

function formatPrice(p: number) {
  return p > 0 ? `${p.toFixed(2).replace(".", ",")} €` : "—";
}

function Card({ item, i }: { item: MenuItem; i: number }) {
  const productPhoto = productImages[item.name];
  const fallback = pickFallback(item.category, i);
  const initial = item.image || productPhoto || fallback;
  const [src, setSrc] = useState<string>(initial);
  const [triedFallback, setTriedFallback] = useState(initial !== item.image);

  const qty = useCart((s) => s.items.find((it) => it.name === item.name)?.qty ?? 0);
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);

  const disabled = item.price <= 0;
  const cartImage = productPhoto || (item.image && !item.image.includes("wolt.com") ? item.image : undefined);

  return (
    <article
      className="group flex flex-col overflow-hidden rounded-2xl glass shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] animate-fade-up"
      style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
    >
      <div className={`relative aspect-[4/3] overflow-hidden ${productPhoto ? "bg-white" : "bg-black/40"}`}>
        <img
          src={src}
          alt={item.name}
          loading="lazy"
          onError={() => {
            if (!triedFallback) {
              setTriedFallback(true);
              setSrc(productPhoto || fallback);
            }
          }}
          className={`h-full w-full transition-transform duration-500 group-hover:scale-105 ${productPhoto ? "object-contain p-2" : "object-cover"}`}
        />
        <div className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground shadow-lg">
          {formatPrice(item.price)}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-snug text-white">{item.name}</h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-white/60">{item.description}</p>
        )}
        <div className="mt-4">
          {qty === 0 ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => add({ name: item.name, price: item.price, image: cartImage, category: item.category })}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" /> Προσθήκη
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2 rounded-xl bg-primary/15 px-2 py-1.5">
              <button type="button" onClick={() => setQty(item.name, qty - 1)} className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90" aria-label="Μείωση">
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-semibold text-white">{qty}</span>
              <button type="button" onClick={() => add({ name: item.name, price: item.price, image: cartImage, category: item.category })} className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-90" aria-label="Προσθήκη">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function MenuGrid() {
  const grouped = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const m of menu) {
      if (!map.has(m.category)) map.set(m.category, []);
      map.get(m.category)!.push(m);
    }
    return Array.from(map.entries());
  }, []);

  const [active, setActive] = useState<string>(grouped[0]?.[0] ?? "");

  return (
    <section id="menu" className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-white/60">Our menu</p>
        <h2 className="mt-2 text-3xl sm:text-5xl font-semibold text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.5)]">Made fresh, every day</h2>
      </div>

      {/* Category pills */}
      <div className="sticky top-[57px] z-20 -mx-4 mb-10 overflow-x-auto bg-black/40 px-4 py-3 backdrop-blur-md border-y border-white/10">
        <div className="flex gap-2 whitespace-nowrap">
          {grouped.map(([cat]) => (
            <a
              key={cat}
              href={`#cat-${encodeURIComponent(cat)}`}
              onClick={() => setActive(cat)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
                active === cat
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-white/15 bg-white/5 text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </a>
          ))}
        </div>
      </div>

      <div className="space-y-16">
        {grouped.map(([cat, items]) => (
          <div key={cat} id={`cat-${encodeURIComponent(cat)}`} className="scroll-mt-24">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h3 className="text-xl sm:text-2xl font-semibold text-white">{cat}</h3>
              <div className="h-px flex-1 bg-white/15" />
              <span className="text-xs text-white/55">{items.length} items</span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((it, i) => (
                <Card key={it.name + i} item={it} i={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
