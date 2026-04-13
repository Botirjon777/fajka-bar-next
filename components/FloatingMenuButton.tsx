'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function FloatingMenuButton() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href="#menu"
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-primary text-black px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_20px_50px_rgba(212,175,55,0.4)] group"
        >
          <Sparkles size={14} className="group-hover:animate-pulse" />
          {t("common.exploreMenu")}
        </motion.a>
      )}
    </AnimatePresence>
  );
}
