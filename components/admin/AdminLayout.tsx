"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Sidebar from "./AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto h-screen custom-scrollbar">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 glass flex items-center justify-between sticky top-0 z-30">
          <h2 className="text-lg font-serif font-black italic tracking-tighter">
            FAJKA<span className="text-primary">ADMIN</span>
          </h2>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all outline-none"
          >
            <Menu size={20} />
          </button>
        </header>

        <div className="p-2.5 md:p-12 lg:p-20 max-w-7xl mx-auto">{children}</div>
      </main>

      <aside className="hidden lg:block w-[350px] shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] z-50 lg:hidden"
            >
              <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
