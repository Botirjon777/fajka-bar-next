"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  GripVertical,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { useMenuStore } from "@/store/menuStore";

export default function MenuOrderPage() {
  const { menu, fetchMenu } = useMenuStore();
  const [items, setItems] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  useEffect(() => {
    if (menu) {
      setItems([...menu].sort((a, b) => (a.order || 0) - (b.order || 0)));
    }
  }, [menu]);

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setItems(newItems);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const orderData = items.map((item, index) => ({
        id: item._id,
        order: index,
      }));

      await axios.post("/api/admin/reorder", {
        type: "category",
        items: orderData,
      });

      await fetchMenu(true);
    } catch (error) {
      console.error("Failed to save order:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-2xl md:text-4xl font-serif font-black italic uppercase tracking-tighter mb-2 text-white">
            Menu Structure
          </h2>
          <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.3em]">
            Drag-and-order your sections
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-black font-black uppercase tracking-[0.2em] px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-3 text-[10px]"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <Save size={16} /> Save Order
            </>
          )}
        </button>
      </div>

      <div className="bg-bg-card border border-white/10 rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-3 md:p-4 bg-white/2 border-b border-white/5 flex justify-between items-center px-5 md:px-8">
          <span className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-white/20">
            Category List
          </span>
          <button
            onClick={() => fetchMenu(true)}
            className="text-white/20 hover:text-white transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        <div className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {items.map((cat, index) => (
              <motion.div
                key={cat._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group flex items-center justify-between p-3.5 md:p-6 hover:bg-white/2 transition-colors"
              >
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="text-white/10 group-hover:text-primary transition-colors cursor-grab active:cursor-grabbing">
                    <GripVertical className="size-[18px] md:size-5" />
                  </div>
                  {cat.image ? (
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                      <img
                        src={cat.image}
                        alt={cat.title.en}
                        className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-white/10 uppercase font-black text-[6px]">
                      No Img
                    </div>
                  )}
                  <div>
                    <h4 className="text-base md:text-xl font-serif font-black italic text-white">
                      {cat.title.en}
                    </h4>
                    <p className="text-[8px] md:text-[9px] text-white/20 uppercase font-bold tracking-widest">
                      {cat.anchorId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 md:gap-3">
                  <button
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="p-2 md:p-3 rounded-lg md:rounded-xl bg-white/5 text-white/40 hover:text-primary hover:bg-primary/10 disabled:opacity-0 transition-all active:scale-95"
                  >
                    <ArrowUp className="size-4 md:size-[18px]" />
                  </button>
                  <button
                    onClick={() => moveItem(index, "down")}
                    disabled={index === items.length - 1}
                    className="p-2 md:p-3 rounded-lg md:rounded-xl bg-white/5 text-white/40 hover:text-primary hover:bg-primary/10 disabled:opacity-0 transition-all active:scale-95"
                  >
                    <ArrowDown className="size-4 md:size-[18px]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-3 p-5 md:p-8 bg-primary/5 border border-primary/10 rounded-2xl md:rounded-3xl">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
          <ChevronRight size={20} />
        </div>
        <p className="text-xs text-white/60 leading-relaxed font-medium">
          Changes made here will affect the display order on the{" "}
          <span className="text-primary italic font-bold">Public Website</span>{" "}
          as well as the{" "}
          <span className="text-primary italic font-bold">
            Sidebar Navigation
          </span>
          .
        </p>
      </div>
    </div>
  );
}
