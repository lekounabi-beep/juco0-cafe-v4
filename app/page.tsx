"use client";

import { MapPin, Clock, Phone, Instagram } from "lucide-react";
import { ReviewGate } from "@/components/ReviewGate";
import { MenuGrid } from "@/components/MenuGrid";
import { EspressoBackground } from "@/components/EspressoBackground";
import { CartFab } from "@/components/CartFab";

export default function Index() {
  return (
    <div className="relative min-h-screen text-foreground">
      <EspressoBackground />

      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <a href="#" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">J</span>
            <span className="font-display text-lg font-semibold tracking-tight text-white">Juco</span>
          </a>
          <nav className="hidden gap-6 text-sm text-white/70 sm:flex">
            <a href="#menu" className="hover:text-white">Menu</a>
            <a href="#visit" className="hover:text-white">Visit</a>
          </nav>
          <a href="tel:+302634000000" className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90">
            Call us
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-5xl px-4 pt-16 pb-12 text-center sm:pt-24 sm:pb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/80 backdrop-blur animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Open today · Nafpaktos
          </span>
          <h1 className="mt-6 font-display text-6xl sm:text-8xl md:text-9xl font-bold tracking-tighter text-white animate-fade-up [text-shadow:0_4px_30px_rgba(0,0,0,0.6)]" style={{ animationDelay: "60ms" }}>
            Juco
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-white/80 animate-fade-up" style={{ animationDelay: "120ms" }}>
            Fresh Juices &amp; Quality Coffee — handcrafted, every single cup.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "180ms" }}>
            <a href="#menu" className="rounded-full glass-strong px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5">
              Browse the menu
            </a>
            <a href="tel:+302634000000" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition hover:-translate-y-0.5">
              Order direct
            </a>
          </div>
        </div>
      </section>

      {/* Review Gate */}
      <div className="pb-16">
        <ReviewGate />
      </div>

      {/* Menu */}
      <MenuGrid />

      {/* Footer */}
      <footer id="visit" className="border-t border-white/10 bg-black/50 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">J</span>
              <span className="font-display text-xl font-semibold text-white">Juco</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-white/70">
              Coffee &amp; Juice Bar — Nafpaktos. Made with real fruit, real beans, real care.
            </p>
          </div>
          <div className="space-y-3 text-sm text-white/85">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/60">Visit us</h4>
            <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> Nafpaktos, Greece</p>
            <p className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-primary" /> Mon–Sun · 07:00 – 23:00</p>
          </div>
          <div className="space-y-3 text-sm text-white/85">
            <h4 className="text-xs uppercase tracking-[0.2em] text-white/60">Contact</h4>
            <a href="tel:+302634000000" className="flex items-start gap-2 hover:text-white">
              <Phone className="mt-0.5 h-4 w-4 text-primary" /> +30 26340 00000
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-start gap-2 hover:text-white">
              <Instagram className="mt-0.5 h-4 w-4 text-primary" /> @juco.nafpaktos
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Juco Coffee &amp; Juice Bar · Nafpaktos
        </div>
      </footer>
      <CartFab />
    </div>
  );
}
