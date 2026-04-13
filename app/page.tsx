'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import SplashScreen from '@/components/SplashScreen';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Hero from '@/components/Hero';
import Menu from '@/components/Menu';
import Footer from '@/components/Footer';
import FloatingMenuButton from '@/components/FloatingMenuButton';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Scroll Progress Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-black min-h-screen selection:bg-primary selection:text-black">
      <AnimatePresence>
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!loading && (
        <>
          {/* Scroll Progress Bar */}
          <motion.div
            className="fixed top-0 left-0 right-0 h-[3px] bg-primary origin-left z-100 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
            style={{ scaleX }}
          />

          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <main className="relative z-0">
            <Hero />
            <div className="relative">
              {/* Radial gradient overlay for section transition */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-screen bg-primary/5 blur-[120px] rounded-full -z-10 opacity-50 pointer-events-none" />
              <Menu />
            </div>
          </main>

          <Footer />
          <FloatingMenuButton />
        </>
      )}
    </div>
  );
}
