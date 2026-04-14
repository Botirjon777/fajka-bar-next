"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Image as ImageIcon,
  Check,
  Loader2,
  RefreshCw,
  Upload,
} from "lucide-react";
import axios from "axios";
import { CldImage } from 'next-cloudinary';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imagePath: string) => void;
  currentValue?: string;
}

export default function ImagePickerModal({
  isOpen,
  onClose,
  onSelect,
  currentValue,
}: ImagePickerModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/images");
      setImages(response.data);
    } catch (error) {
      console.error("Failed to fetch images:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const filteredImages = images.filter((img) =>
    img.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchImages();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/admin/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      const newImageUrl = response.data.secure_url;
      setImages(prev => [newImageUrl, ...prev]);
      // Auto-select the newly uploaded image
      onSelect(newImageUrl);
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-2.5 md:p-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-4xl bg-bg-card border border-white/10 rounded-2xl md:rounded-[3rem] overflow-hidden relative z-10 shadow-2xl flex flex-col max-h-[85vh] custom-scrollbar"
          >
            {/* Header */}
            <div className="p-5 md:p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
              <div>
                <h3 className="text-2xl font-serif font-black italic uppercase tracking-tighter mb-1">
                  Select Asset
                </h3>
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">
                  Cloudinary Library
                </p>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
                <button
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                  {uploading ? "Uploading..." : "Upload New"}
                </button>
                <button
                  onClick={handleRefresh}
                  className={`p-3 rounded-xl bg-white/5 text-white/40 hover:text-white transition-all ${refreshing ? "animate-spin" : ""}`}
                >
                  <RefreshCw size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-3 rounded-xl bg-white/5 text-white/20 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-6 bg-black/20 border-b border-white/5">
              <div className="relative">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20"
                  size={18}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search images..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-primary/50 transition-all font-bold text-sm"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              {loading && !refreshing ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-primary" size={40} />
                  <p className="text-white/20 uppercase tracking-widest font-black text-[10px]">
                    Connecting to Cloudinary...
                  </p>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/20">
                  <ImageIcon size={48} strokeWidth={1} />
                  <p className="uppercase tracking-widest font-black text-[10px]">
                    No images found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {filteredImages.map((imgUrl) => {
                    const isSelected = currentValue === imgUrl;
                    const fileName = imgUrl.split('/').pop()?.split('?')[0] || "image";
                    
                    return (
                      <motion.button
                        key={imgUrl}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          onSelect(imgUrl);
                          onClose();
                        }}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? "border-primary"
                            : "border-white/5 hover:border-white/20"
                        }`}
                      >
                        {imgUrl.includes('cloudinary') ? (
                          <CldImage
                            src={imgUrl}
                            alt={fileName}
                            width={300}
                            height={300}
                            crop="fill"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <img
                            src={imgUrl}
                            alt={fileName}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        )}
                        <div
                          className={`absolute inset-0 bg-primary/20 transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="absolute bottom-3 left-3 right-3 truncate text-[9px] font-black uppercase tracking-tighter text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {fileName}
                        </div>

                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-primary text-black rounded-full flex items-center justify-center shadow-lg">
                            <Check size={14} strokeWidth={4} />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-white/1 flex justify-between items-center">
              <p className="text-[9px] text-white/20 uppercase font-bold">
                {filteredImages.length} items found
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-white/5 text-white/60 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
