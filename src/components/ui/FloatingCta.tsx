"use client";

import { MessageCircle } from "lucide-react";
import { useClickTracking } from "@/features/analytics";
import { BUSINESS_CONFIG } from "@/config/business";

export function FloatingCta() {
  const trackClick = useClickTracking();
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp.number}?text=${encodeURIComponent(BUSINESS_CONFIG.whatsapp.message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackClick({ type: "whatsapp", source: "floating-cta" })}
      className="fixed bottom-5 right-5 z-overlay flex items-center gap-2.5 rounded-full bg-[#25D366] pl-4 pr-5 py-3 text-white shadow-lg transition-all duration-normal hover:bg-[#20BD5A] hover:shadow-xl hover:shadow-[#25D366]/30 active:scale-95 md:pl-5 md:pr-6 md:py-3.5"
      aria-label="Pedir por WhatsApp"
    >
      <MessageCircle size={20} aria-hidden="true" className="fill-white text-transparent" />
      <span className="hidden text-sm font-semibold md:inline">Pedir por WhatsApp</span>
    </a>
  );
}
