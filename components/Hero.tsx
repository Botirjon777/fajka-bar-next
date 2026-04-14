'use client';

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CldImage } from 'next-cloudinary';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-8 bg-primary/40" />
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="text-primary uppercase tracking-[0.8em] text-[10px] font-black">
              {t('common.address')}
            </span>
            <div className="h-px w-8 bg-primary/40" />
          </div>

          <CldImage 
            src="https://res.cloudinary.com/dwmodrs7i/image/upload/v1776147870/fajka-bar/logo.webp" 
            alt="Fajka Bar Logo" 
            width={700}
            height={400}
            priority
            className="w-full max-w-[400px] md:max-w-[700px] mx-auto mb-12 opacity-90 brightness-110 drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]"
          />

          <p className="text-lg md:text-2xl text-white/40 mb-14 max-w-xl mx-auto font-light leading-relaxed uppercase tracking-widest px-4">
            {t('hero.subtitle')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
