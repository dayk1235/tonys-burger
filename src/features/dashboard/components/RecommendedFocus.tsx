"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/localization";

interface RecommendedFocusProps {
  title: string;
  description: string;
  expectedImpact?: string;
  href: string;
}

export function RecommendedFocus({ title, description, expectedImpact, href }: RecommendedFocusProps) {
  const { t } = useTranslation();
  if (!title) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-wider text-text-muted">
        {t("focus.title")}
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-brand-primary/20 bg-gradient-to-br from-brand-primary/[0.04] to-transparent p-6 transition-all duration-300 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 sm:p-7"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-text-primary sm:text-xl">
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-text-muted">
              {description}
            </p>
          </div>

          {expectedImpact && (
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
              <span className="text-xs font-medium text-emerald-400">
                {t("focus.expectedImpact")}
              </span>
              <span className="text-xs text-emerald-400/80">
                {expectedImpact}
              </span>
            </div>
          )}

          <Link
            href={href}
            className="group inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-brand-primary-hover"
          >
            {t("focus.review")}
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
