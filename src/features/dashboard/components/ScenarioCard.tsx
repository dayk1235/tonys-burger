"use client";

import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { TradeoffCard } from "./TradeoffCard";

interface ScenarioCardProps {
  title: string;
  control: ReactNode;
  isActive: boolean;
  benefits: string[];
  risks: string[];
  confidence: "High" | "Medium" | "Low";
}

export function ScenarioCard({ 
  title, 
  control, 
  isActive, 
  benefits, 
  risks, 
  confidence 
}: ScenarioCardProps) {
  return (
    <div className="border-b border-border/50 py-8 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <h3 className="text-lg font-medium text-text-primary">{title}</h3>
        <div className="flex items-center justify-end w-full sm:w-[200px] shrink-0">
          {control}
        </div>
      </div>
      <AnimatePresence>
        {isActive && (
          <TradeoffCard 
            benefits={benefits} 
            risks={risks} 
            confidence={confidence} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
