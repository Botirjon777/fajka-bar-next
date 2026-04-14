'use client';

import { useState, useEffect } from "react";
import { Menu, Phone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === "pl" ? "en" : "pl";
    i18n.changeLanguage(nextLang);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-90 transition-all duration-500 px-6 py-4",
        isScrolled
          ? "glass py-3 border-none shadow-2xl"
          : "bg-transparent py-6 border-none",
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group">
          <span className="text-2xl md:text-3xl font-serif font-black gold-gradient tracking-tighter italic">
            {t("common.brand")}
          </span>
          <div className="h-4 w-px bg-white/20 mx-2 hidden sm:block group-hover:bg-primary transition-colors" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 hidden sm:block">
            {t("common.city")}
          </span>
        </a>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-xl text-[10px] font-bold tracking-widest transition-all uppercase"
          >
            <Globe size={12} />
            {i18n.language === "pl" ? "EN" : "PL"}
          </button>


          <button
            onClick={onMenuClick}
            className="flex items-center justify-center bg-primary hover:bg-primary-hover text-black w-10 h-10 md:w-12 md:h-12 rounded-xl transition-all transform hover:scale-110 shadow-lg shadow-primary/20 active:scale-95"
          >
            <Menu size={22} strokeWidth={3} />
          </button>
        </div>
      </div>
    </nav>
  );
}
