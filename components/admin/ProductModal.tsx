"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Save,
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import ImagePickerModal from "./ImagePickerModal";
import { CldImage } from "next-cloudinary";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData?: any;
  categories: any[];
  title: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
  title,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: { pl: "", en: "" },
    desc: { pl: "", en: "" },
    price: "",
    prices: [] as { label: string; value: string }[],
    image: "",
    category: "",
    subcategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || { pl: "", en: "" },
        desc: initialData.desc || { pl: "", en: "" },
        price: initialData.price || "",
        prices: initialData.prices || [],
        image: initialData.image || "",
        category: initialData.category?._id || initialData.category || "",
        subcategory:
          initialData.subcategory?._id || initialData.subcategory || "",
      });
    } else {
      setFormData({
        name: { pl: "", en: "" },
        desc: { pl: "", en: "" },
        price: "",
        prices: [],
        image: "",
        category: categories[0]?._id || "",
        subcategory: "",
      });
    }
  }, [initialData, isOpen, categories]);

  const selectedCategoryData = categories.find(
    (c) => c._id === formData.category,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Clean up empty fields
      const dataToSave = { ...formData };
      if (!dataToSave.subcategory) delete (dataToSave as any).subcategory;
      if (!dataToSave.price) delete (dataToSave as any).price;

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addPriceOption = () => {
    setFormData({
      ...formData,
      prices: [...formData.prices, { label: "", value: "" }],
    });
  };

  const removePriceOption = (index: number) => {
    setFormData({
      ...formData,
      prices: formData.prices.filter((_, i) => i !== index),
    });
  };

  const updatePriceOption = (
    index: number,
    field: "label" | "value",
    value: string,
  ) => {
    const newPrices = [...formData.prices];
    newPrices[index][field] = value;
    setFormData({ ...formData, prices: newPrices });
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
              className="w-full max-w-4xl bg-bg-card border border-white/10 rounded-3xl md:rounded-[3.5rem] p-5 md:p-10 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
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
                      Name (PL)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name.pl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: { ...formData.name, pl: e.target.value },
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
                      Name (EN)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: { ...formData.name, en: e.target.value },
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
                      Description (PL)
                    </label>
                    <textarea
                      value={formData.desc.pl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          desc: { ...formData.desc, pl: e.target.value },
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all min-h-[100px] resize-none font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
                      Description (EN)
                    </label>
                    <textarea
                      value={formData.desc.en}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          desc: { ...formData.desc, en: e.target.value },
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all min-h-[100px] resize-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
                        Base Price (e.g., 30zł)
                      </label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all font-bold"
                        placeholder="Leave empty if using price options"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
                        Category
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => {
                          const catId = e.target.value;
                          setFormData({
                            ...formData,
                            category: catId,
                            subcategory: "",
                          });
                        }}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer font-bold"
                      >
                        <option value="" disabled className="bg-bg-card">
                          Select a Category
                        </option>
                        {categories.map((cat) => (
                          <option
                            key={cat._id}
                            value={cat._id}
                            className="bg-bg-card"
                          >
                            {cat.title.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedCategoryData &&
                      selectedCategoryData.subcategories &&
                      selectedCategoryData.subcategories.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-2"
                        >
                          <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
                            Subcategory (Optional)
                          </label>
                          <select
                            value={formData.subcategory}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subcategory: e.target.value,
                              })
                            }
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer font-bold"
                          >
                            <option value="" className="bg-bg-card">
                              No Subcategory
                            </option>
                            {selectedCategoryData.subcategories.map(
                              (sub: any) => (
                                <option
                                  key={sub._id}
                                  value={sub._id}
                                  className="bg-bg-card"
                                >
                                  {sub.title.en}
                                </option>
                              ),
                            )}
                          </select>
                        </motion.div>
                      )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center ml-4">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40">
                        Price Options (Bundles)
                      </label>
                      <button
                        type="button"
                        onClick={addPriceOption}
                        className="text-primary hover:text-white transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {formData.prices.map((p, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            placeholder="Label (e.g., 10 shots)"
                            value={p.label}
                            onChange={(e) =>
                              updatePriceOption(i, "label", e.target.value)
                            }
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs text-white font-bold"
                          />
                          <input
                            placeholder="Price (e.g., 50zł)"
                            value={p.value}
                            onChange={(e) =>
                              updatePriceOption(i, "value", e.target.value)
                            }
                            className="w-24 bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs text-white font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => removePriceOption(i)}
                            className="p-2 text-white/20 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
                    Product Visual
                  </label>
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                      {formData.image ? (
                        formData.image.includes('cloudinary.com') ? (
                          <CldImage
                            src={formData.image}
                            alt="Preview"
                            width={300}
                            height={300}
                            crop="fill"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        )
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
                          value={formData.image}
                          onChange={(e) =>
                            setFormData({ ...formData, image: e.target.value })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-[11px] text-white/40 focus:outline-none focus:border-primary/50 focus:text-white transition-all font-bold"
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
                        <Save size={20} /> Save Product
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
