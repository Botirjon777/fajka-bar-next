'use client';

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function SplashScreen() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-200 flex items-center justify-center bg-black"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-64 h-64 md:w-96 md:h-96"
      >
        <img
          src="/images/logo.webp"
          alt={`${t('common.brand')} Logo`}
          className="w-full h-full object-contain"
        />
        <motion.div
          className="absolute inset-0 bg-primary/10 blur-[50px] -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
