"use client";

import React, { useRef, useState } from "react";
import { Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { CldImage } from "next-cloudinary";
import axios from "axios";

interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string) => void;
  onOpenGallery: () => void;
  label?: string;
}

export default function ImageUploadField({
  value,
  onChange,
  onOpenGallery,
  label = "Product Visual",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      onChange(newImageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-4">
        {label}
      </label>
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
          {value ? (
            value.includes("cloudinary.com") ? (
              <CldImage
                src={value}
                alt="Preview"
                width={300}
                height={300}
                crop="fill"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <ImageIcon className="text-white/10" size={32} />
          )}
        </div>
        <div className="flex-1 space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onOpenGallery}
              className="py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <ImageIcon size={16} />
              Select from Gallery
            </button>
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={uploading}
              className="py-4 bg-primary text-black font-bold uppercase text-[10px] tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Upload size={16} />
              )}
              {uploading ? "Uploading..." : "Upload New"}
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-[11px] text-white/40 focus:outline-none focus:border-primary/50 focus:text-white transition-all font-bold"
              placeholder="Or paste URL here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
