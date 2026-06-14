"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { PLACEHOLDER } from "@/content/placeholders";
import { BUSINESS_CONFIG } from "@/config/business";
import { useNavbarScroll } from "@/animations";
import { useClickTracking } from "@/features/analytics";

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Menú", href: "#menu-preview" },
  { label: "Galería", href: "#gallery" },
  { label: "Ubicación", href: "#location" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { headerRef } = useNavbarScroll();
  const trackClick = useClickTracking();

  return (
    <header
      ref={headerRef}
      className="fixed top-0 right-0 left-0 z-sticky border-b border-border bg-bg/95 backdrop-blur-md"
    >
      <nav
        className="mx-auto flex max-w-container-max items-center justify-between px-4 py-4 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-2xl tracking-wide text-text-primary transition-colors duration-fast hover:text-brand-primary"
aria-label={`${BUSINESS_CONFIG.name} — Inicio`}
          >
            {BUSINESS_CONFIG.name}
        </Link>

        {/* Desktop Links */}
        <ul className="hidden items-center gap-8 md:flex" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => trackClick({ type: "menu", source: "desktop-nav" })}
                className="font-sans text-sm font-medium text-text-secondary transition-colors duration-fast hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="#cta"
              onClick={() => trackClick({ type: "cta", label: "Pedir por WhatsApp", destination: "#cta" })}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-brand-primary px-4 font-sans text-sm font-semibold text-white transition-colors duration-fast hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              {PLACEHOLDER.HERO_CTA_PRIMARY}
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="flex items-center justify-center p-2 text-text-primary md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="border-t border-border bg-bg-surface px-4 pb-6 pt-4 md:hidden"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-4" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block font-sans text-base font-medium text-text-secondary transition-colors duration-fast hover:text-brand-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                onClick={() => {
                  setIsOpen(false);
                  trackClick({ type: "menu", source: "mobile-nav" });
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link
              href="#cta"
              className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-6 font-sans text-sm font-semibold text-white transition-colors duration-fast hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              onClick={() => {
                setIsOpen(false);
                trackClick({ type: "cta", label: "Pedir por WhatsApp", destination: "#cta" });
              }}
            >
              {PLACEHOLDER.HERO_CTA_PRIMARY}
            </Link>
          </li>
          </ul>
        </div>
      )}
    </header>
  );
}
