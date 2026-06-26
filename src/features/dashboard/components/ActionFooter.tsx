"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/localization";

interface ActionFooterProps {
  backHref: string;
  experimentHref: string;
}

export function ActionFooter({ backHref, experimentHref }: ActionFooterProps) {
  const { t } = useTranslation();
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Link href={experimentHref}>
          <Button variant="cta" size="xl">
            {t("dashboard.actionCenter.createExperiment")}
          </Button>
        </Link>
        <Link href={backHref}>
          <Button variant="outline" size="xl">
            {t("dashboard.actionCenter.cancel")}
          </Button>
        </Link>
      </div>
    </motion.section>
  );
}
