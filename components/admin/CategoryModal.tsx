"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, Image as ImageIcon } from "lucide-react";
import ImagePickerModal from "./ImagePickerModal";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
  title: string;
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

export default function CategoryModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title,
}: CategoryModalProps) {
  const [formData, setFormData] = useState({
    title: { pl: "", en: "" },
    anchorId: "",
    image: "",
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || { pl: "", en: "" },
        anchorId: initialData.anchorId || "",
        image: initialData.image || "",
        order: initialData.order || 0,
      });
    } else {
      setFormData({
        title: { pl: "", en: "" },
        anchorId: "",
        image: "",
        order: 0,
      });
    }
  }, [initialData, isOpen]);

  // Auto-generate anchorId from English title (only when creating new)
  useEffect(() => {
    if (!initialData && formData.title.en) {
      setFormData((prev) => ({
        ...prev,
        anchorId: `section-${slugify(formData.title.en)}`,
      }));
    }
  }, [formData.title.en, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 md:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-bg-card border border-white/10 rounded-3xl md:rounded-[3.5rem] p-5 md:p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex justify-between items-center mb-6 md:mb-10">
                <h3 className="text-2xl md:text-3xl font-serif font-black italic uppercase tracking-tighter">
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-white/20 hover:text-white transition-colors"
                >
                  <X size={28} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
                      Title (PL)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title.pl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: { ...formData.title, pl: e.target.value },
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all font-bold"
                      placeholder="e.g., Klasyczne Koktajle"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
                      Title (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          title: { ...formData.title, en: e.target.value },
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all font-bold"
                      placeholder="e.g., Classic Cocktails"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
                    Anchor ID (Auto-generated)
                  </label>
                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white/30 font-mono text-xs cursor-not-allowed text-[max(12px,1em)]">
                    {formData.anchorId || "Enter English title..."}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
                    Category Visual
                  </label>
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {formData.image ? (
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-white/10" size={32} />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <button
                        type="button"
                        onClick={() => setShowPicker(true)}
                        className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <ImageIcon size={16} />
                        Select from Gallery
                      </button>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={formData.image}
                          onChange={(e) =>
                            setFormData({ ...formData, image: e.target.value })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-[11px] text-white/40 focus:outline-none focus:border-primary/50 focus:text-white transition-all font-[inherit]"
                          placeholder="Or paste URL here..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-black font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-lg shadow-primary/20 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Save size={20} /> Save Category
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ImagePickerModal
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(imagePath) => setFormData({ ...formData, image: imagePath })}
        currentValue={formData.image}
      />
    </>
  );
}
