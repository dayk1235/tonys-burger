/**
 * Experience — Selector
 *
 * Premium appearance selector for the dashboard Topbar.
 * Allows the user to switch between Morning, Focus, and Auto modes.
 *
 * Visual design is consistent with Restaurant OS and mirrors
 * the LocalizationSettings pattern.
 *
 * Design:
 *   Morning ▼
 *   Options:
 *     ✓ Morning
 *       Focus
 *       Auto
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Sparkles, ChevronDown } from "lucide-react";
import { useExperience } from "@/experience";

const EXPERIENCE_OPTIONS = [
  {
    value: "morning" as const,
    label: "Morning",
    description: "Fresh, bright, calm",
    icon: Sun,
  },
  {
    value: "focus" as const,
    label: "Focus",
    description: "Elegant, professional, minimal",
    icon: Moon,
  },
  {
    value: "auto" as const,
    label: "Auto",
    description: "Adapts to time of day",
    icon: Sparkles,
  },
] as const;

export function ExperienceSelector() {
  const { experience, resolvedExperience, setExperience } = useExperience();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentOption = EXPERIENCE_OPTIONS.find((o) => o.value === experience);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-text-muted transition-colors hover:bg-bg-surface-alt hover:text-text-primary"
        aria-label="Appearance"
        aria-expanded={isOpen}
      >
        <Sun size={14} className={resolvedExperience === "focus" ? "hidden" : ""} />
        <Moon size={14} className={resolvedExperience === "focus" ? "" : "hidden"} />
        <span className="hidden sm:inline">{currentOption?.label ?? "Morning"}</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-56 origin-top-right rounded-2xl border border-border bg-bg-surface p-2 shadow-xl shadow-black/30"
          >
            <div className="space-y-1">
              {EXPERIENCE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = experience === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setExperience(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-bg-surface-alt ${
                      isSelected
                        ? "bg-brand-primary/10 text-text-primary"
                        : "text-text-muted"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isSelected ? "text-brand-primary-light" : "text-text-muted"}
                    />
                    <div className="flex-1">
                      <span className="font-medium">{option.label}</span>
                      <p className="text-[10px] text-text-muted/60">{option.description}</p>
                    </div>
                    {isSelected && (
                      <span className="text-brand-primary-light">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
