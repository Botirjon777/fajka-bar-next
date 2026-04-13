"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

interface MenuItem {
  name: string;
  desc: string;
  price: string;
  tag: string;
  image: string;
}

interface Category {
  name: string;
  items: MenuItem[];
}

interface MenuData {
  brand: string;
  title: string;
  subtitle: string;
  categories: Category[];
}

const STORAGE_KEY = "fajka-stable-menu-data-v1";
const SPLASH_DURATION_MS = 2000;
const LOGO_IMG_PATH = "/images/logo.webp";

const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1551024709-8f23befc6cf7?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
];

function fallbackImage(index: number): string {
  return IMAGE_POOL[index % IMAGE_POOL.length];
}

function safeId(text: string, index: number): string {
  const cleaned = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `${cleaned || "section"}-${index}`;
}

function createInitialData(): MenuData {
  return {
    brand: "Fajka Lounge",
    title: "Signature Shisha Experience",
    subtitle:
      "Elegant QR menu concept with premium styling, compact thumbnails, and stable live editing.",
    categories: [
      {
        name: "Signature",
        items: [
          {
            name: "Fajka Gold",
            desc: "Smooth, rich, house signature mix",
            price: "95 zł",
            tag: "Most Popular",
            image: fallbackImage(0),
          },
          {
            name: "Dark Velvet",
            desc: "Deep grape and mint profile",
            price: "92 zł",
            tag: "Premium",
            image: fallbackImage(1),
          },
          {
            name: "Royal Night",
            desc: "Berry, ice, elegant finish",
            price: "98 zł",
            tag: "Recommended",
            image: fallbackImage(2),
          },
        ],
      },
      {
        name: "Classic",
        items: [
          {
            name: "Love 66",
            desc: "Fresh, sweet, balanced classic",
            price: "80 zł",
            tag: "",
            image: fallbackImage(3),
          },
          {
            name: "Mint",
            desc: "Clean cooling classic flavour",
            price: "75 zł",
            tag: "",
            image: fallbackImage(4),
          },
          {
            name: "Blueberry",
            desc: "Soft fruit profile, smooth smoke",
            price: "78 zł",
            tag: "",
            image: fallbackImage(5),
          },
        ],
      },
      {
        name: "Drinks",
        items: [
          {
            name: "Berry Mojito 0%",
            desc: "Fresh mint, berry, lime",
            price: "24 zł",
            tag: "",
            image: fallbackImage(6),
          },
          {
            name: "Golden Lemonade",
            desc: "Elegant citrus house cooler",
            price: "22 zł",
            tag: "",
            image: fallbackImage(7),
          },
          {
            name: "Espresso",
            desc: "Short intense coffee shot",
            price: "12 zł",
            tag: "",
            image: fallbackImage(0),
          },
        ],
      },
      {
        name: "Premium Mix",
        items: [
          {
            name: "Golden Smoke",
            desc: "Luxury house blend, velvety draw",
            price: "99 zł",
            tag: "Premium",
            image: fallbackImage(1),
          },
          {
            name: "Noir Edition",
            desc: "Dark fruit and spice character",
            price: "102 zł",
            tag: "",
            image: fallbackImage(2),
          },
          {
            name: "Amber Reserve",
            desc: "Refined sweet premium composition",
            price: "104 zł",
            tag: "",
            image: fallbackImage(3),
          },
        ],
      },
      {
        name: "Ice Mix",
        items: [
          {
            name: "Frozen Sky",
            desc: "Icy mint with blueberry notes",
            price: "88 zł",
            tag: "",
            image: fallbackImage(4),
          },
          {
            name: "Polar Love",
            desc: "Love 66 with extra cooling",
            price: "89 zł",
            tag: "",
            image: fallbackImage(5),
          },
          {
            name: "Ice Queen",
            desc: "Elegant fruit blend, cold finish",
            price: "90 zł",
            tag: "",
            image: fallbackImage(6),
          },
        ],
      },
      {
        name: "Fruit Mix",
        items: [
          {
            name: "Berry Bloom",
            desc: "Mixed berries with soft sweetness",
            price: "84 zł",
            tag: "",
            image: fallbackImage(7),
          },
          {
            name: "Tropical Silk",
            desc: "Mango, peach, exotic finish",
            price: "86 zł",
            tag: "",
            image: fallbackImage(0),
          },
          {
            name: "Citrus Garden",
            desc: "Fresh lemon-lime fruit mix",
            price: "82 zł",
            tag: "",
            image: fallbackImage(1),
          },
        ],
      },
      {
        name: "Tea",
        items: [
          {
            name: "Moroccan Mint",
            desc: "Fresh aromatic mint infusion",
            price: "18 zł",
            tag: "",
            image: fallbackImage(2),
          },
          {
            name: "Black Tea",
            desc: "Strong and classic serving",
            price: "16 zł",
            tag: "",
            image: fallbackImage(3),
          },
          {
            name: "Fruit Tea",
            desc: "Warm sweet-fruit tea blend",
            price: "19 zł",
            tag: "",
            image: fallbackImage(4),
          },
        ],
      },
      {
        name: "Coffee",
        items: [
          {
            name: "Cappuccino",
            desc: "Smooth milk foam texture",
            price: "16 zł",
            tag: "",
            image: fallbackImage(5),
          },
          {
            name: "Latte",
            desc: "Balanced creamy coffee",
            price: "17 zł",
            tag: "",
            image: fallbackImage(6),
          },
          {
            name: "Iced Latte",
            desc: "Cold creamy coffee option",
            price: "18 zł",
            tag: "",
            image: fallbackImage(7),
          },
        ],
      },
      {
        name: "Mocktails",
        items: [
          {
            name: "Lounge Sunset",
            desc: "Orange, passion fruit, ice",
            price: "25 zł",
            tag: "",
            image: fallbackImage(0),
          },
          {
            name: "Golden Citrus",
            desc: "Elegant citrus house cooler",
            price: "23 zł",
            tag: "",
            image: fallbackImage(1),
          },
          {
            name: "Berry Fresh",
            desc: "Fresh berries and fontawesome icons",
            price: "24 zł",
            tag: "",
            image: fallbackImage(2),
          },
        ],
      },
      {
        name: "Desserts",
        items: [
          {
            name: "San Sebastian",
            desc: "Creamy cheesecake, premium slice",
            price: "22 zł",
            tag: "",
            image: fallbackImage(3),
          },
          {
            name: "Chocolate Dream",
            desc: "Dark chocolate layered dessert",
            price: "21 zł",
            tag: "",
            image: fallbackImage(4),
          },
          {
            name: "Tiramisu",
            desc: "Classic soft coffee dessert",
            price: "20 zł",
            tag: "",
            image: fallbackImage(5),
          },
        ],
      },
      {
        name: "Food",
        items: [
          {
            name: "Chicken Wrap",
            desc: "Light warm lounge snack",
            price: "28 zł",
            tag: "",
            image: fallbackImage(6),
          },
          {
            name: "Crispy Fries",
            desc: "Golden side, easy to share",
            price: "16 zł",
            tag: "",
            image: fallbackImage(7),
          },
          {
            name: "Club Sandwich",
            desc: "Simple premium snack option",
            price: "30 zł",
            tag: "",
            image: fallbackImage(0),
          },
        ],
      },
    ],
  };
}

function isValidMenuData(data: unknown): data is MenuData {
  if (!data || typeof data !== "object") return false;
  const x = data as Record<string, unknown>;
  return (
    typeof x.brand === "string" &&
    typeof x.title === "string" &&
    typeof x.subtitle === "string" &&
    Array.isArray(x.categories)
  );
}

export default function TestPage() {
  const { t, i18n } = useTranslation();
  const [menuData, setMenuData] = useState<MenuData>(createInitialData);
  const [editMode, setEditMode] = useState(true);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(90);
  const [showSplash, setShowSplash] = useState(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const categoryScrollRef = useRef<HTMLDivElement | null>(null);
  const indicatorTrackRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShowSplash(false),
      SPLASH_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (isValidMenuData(parsed)) setMenuData(parsed);
    } catch {
      // ignore broken saved data
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(menuData));
    } catch {
      // ignore storage failures
    }
  }, [menuData]);

  const sectionLinks = useMemo(
    () =>
      menuData.categories.map((cat, i) => ({
        ...cat,
        id: safeId(cat.name, i),
      })),
    [menuData.categories],
  );

  const selectedCategory =
    menuData.categories[
      Math.max(
        0,
        Math.min(selectedCategoryIndex, menuData.categories.length - 1),
      )
    ];
  const selectedItem =
    selectedCategory?.items[
      Math.max(
        0,
        Math.min(selectedItemIndex, (selectedCategory?.items.length || 1) - 1),
      )
    ];

  const updateIndicator = () => {
    const slider = categoryScrollRef.current;
    const track = indicatorTrackRef.current;
    if (!slider || !track) return;

    const maxScroll = Math.max(0, slider.scrollWidth - slider.clientWidth);
    const trackWidth = track.clientWidth;
    const visibleRatio =
      slider.scrollWidth > 0 ? slider.clientWidth / slider.scrollWidth : 1;
    const thumbWidth = Math.max(56, trackWidth * Math.min(visibleRatio, 1));
    const maxLeft = Math.max(0, trackWidth - thumbWidth);
    const left = maxScroll > 0 ? (slider.scrollLeft / maxScroll) * maxLeft : 0;

    setIndicatorWidth(thumbWidth);
    setIndicatorLeft(left);
  };

  useEffect(() => {
    updateIndicator();
    const slider = categoryScrollRef.current;
    if (!slider) return;
    slider.addEventListener("scroll", updateIndicator, { passive: true });
    window.addEventListener("resize", updateIndicator);
    return () => {
      slider.removeEventListener("scroll", updateIndicator);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [menuData.categories.length]);

  const setRootField = (
    field: keyof Omit<MenuData, "categories">,
    value: string,
  ) => {
    setMenuData((prev) => ({ ...prev, [field]: value }));
  };

  const setCategoryName = (value: string) => {
    setMenuData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === selectedCategoryIndex ? { ...cat, name: value } : cat,
      ),
    }));
  };

  const setItemField = (field: keyof MenuItem, value: string) => {
    setMenuData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat, i) => {
        if (i !== selectedCategoryIndex) return cat;
        return {
          ...cat,
          items: cat.items.map((item, j) =>
            j === selectedItemIndex ? { ...item, [field]: value } : item,
          ),
        };
      }),
    }));
  };

  const uploadImage = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setItemField("image", String(reader.result));
    reader.readAsDataURL(file);
  };

  const addCategory = () => {
    setMenuData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          name: `New Category ${prev.categories.length + 1}`,
          items: [
            {
              name: "New Item",
              desc: "New description",
              price: "00 zł",
              tag: "",
              image: fallbackImage(prev.categories.length),
            },
          ],
        },
      ],
    }));
    setSelectedCategoryIndex(menuData.categories.length);
    setSelectedItemIndex(0);
  };

  const addItem = () => {
    if (!selectedCategory) return;
    setMenuData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === selectedCategoryIndex
          ? {
              ...cat,
              items: [
                ...cat.items,
                {
                  name: "New Item",
                  desc: "New description",
                  price: "00 zł",
                  tag: "",
                  image: fallbackImage(cat.items.length + i),
                },
              ],
            }
          : cat,
      ),
    }));
    setSelectedItemIndex(selectedCategory.items.length);
  };

  const removeCategory = () => {
    if (menuData.categories.length <= 1) return;
    setMenuData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, i) => i !== selectedCategoryIndex),
    }));
    setSelectedCategoryIndex(0);
    setSelectedItemIndex(0);
  };

  const removeItem = () => {
    if (!selectedCategory || selectedCategory.items.length <= 1) return;
    setMenuData((prev) => ({
      ...prev,
      categories: prev.categories.map((cat, i) =>
        i === selectedCategoryIndex
          ? {
              ...cat,
              items: cat.items.filter((_, j) => j !== selectedItemIndex),
            }
          : cat,
      ),
    }));
    setSelectedItemIndex(0);
  };

  const moveCategory = (dir: -1 | 1) => {
    const next = selectedCategoryIndex + dir;
    if (next < 0 || next >= menuData.categories.length) return;
    setMenuData((prev) => {
      const categories = [...prev.categories];
      [categories[selectedCategoryIndex], categories[next]] = [
        categories[next],
        categories[selectedCategoryIndex],
      ];
      return { ...prev, categories };
    });
    setSelectedCategoryIndex(next);
    setSelectedItemIndex(0);
  };

  const moveItem = (dir: -1 | 1) => {
    if (!selectedCategory) return;
    const next = selectedItemIndex + dir;
    if (next < 0 || next >= selectedCategory.items.length) return;
    setMenuData((prev) => {
      const categories = [...prev.categories];
      const category = { ...categories[selectedCategoryIndex] };
      const items = [...category.items];
      [items[selectedItemIndex], items[next]] = [
        items[next],
        items[selectedItemIndex],
      ];
      category.items = items;
      categories[selectedCategoryIndex] = category;
      return { ...prev, categories };
    });
    setSelectedItemIndex(next);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(menuData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fajka-menu-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (isValidMenuData(parsed)) {
          setMenuData(parsed);
          setSelectedCategoryIndex(0);
          setSelectedItemIndex(0);
        }
      } catch {
        // ignore invalid file
      }
    };
    reader.readAsText(file);
  };

  const resetAll = () => {
    setMenuData(createInitialData());
    setSelectedCategoryIndex(0);
    setSelectedItemIndex(0);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
  };

  const onScrollMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = categoryScrollRef.current;
    if (!slider) return;
    dragRef.current = {
      isDown: true,
      startX: e.pageX - slider.offsetLeft,
      scrollLeft: slider.scrollLeft,
    };
  };

  const onScrollMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const slider = categoryScrollRef.current;
    if (!slider || !dragRef.current.isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    slider.scrollLeft =
      dragRef.current.scrollLeft - (x - dragRef.current.startX) * 1.2;
    updateIndicator();
  };

  const stopDrag = () => {
    dragRef.current.isDown = false;
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#F5F2EA]">
      {showSplash ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black">
          <img
            src={LOGO_IMG_PATH}
            alt="Fajka Bar Lounge logo"
            className="w-full max-w-[520px] object-contain px-6"
          />
        </div>
      ) : null}
      <div
        className={`mx-auto grid max-w-7xl gap-6 p-4 lg:justify-center lg:p-6 ${editMode ? "lg:grid-cols-[340px_minmax(0,430px)]" : "lg:grid-cols-[430px]"}`}
      >
        <div className="fixed right-5 top-5 z-60 flex items-center gap-3">
          <button
            onClick={() => {
              const nextLang = i18n.language === "pl" ? "en" : "pl";
              i18n.changeLanguage(nextLang);
            }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1B1B1B] px-3 py-2 text-xs font-medium text-white hover:bg-white/5 transition-all uppercase"
          >
            <Globe size={14} />
            {i18n.language === "pl" ? "EN" : "PL"}
          </button>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="rounded-xl border border-[#D6B36A]/25 bg-[#1B1B1B] px-4 py-2 text-sm font-medium text-[#D6B36A] hover:bg-[#D6B36A]/10 transition-all font-[inherit]"
            >
              {t("editor.editor")}
            </button>
          ) : (
            <button
              onClick={() => setEditMode(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all font-[inherit]"
            >
              {t("editor.preview")}
            </button>
          )}
        </div>

        {editMode && (
          <aside className="rounded-[24px] border border-[#D6B36A]/20 bg-[#111111] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.28)] lg:sticky lg:top-4 lg:h-fit">
            <div className="mb-4 flex items-center justify-between text-white">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#D6B36A]">
                  {t("editor.liveEditor")}
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  {t("editor.controlPanel")}
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/5 bg-[#1B1B1B] p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#D6B36A]">
                  Data
                </p>
                <div className="grid gap-2">
                  <button
                    onClick={exportJson}
                    className="w-full rounded-xl bg-[#D6B36A] px-3 py-2 text-sm font-medium text-black"
                  >
                    {t("editor.exportJson")}
                  </button>
                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm">
                    {t("editor.importJson")}
                    <input
                      type="file"
                      accept="application/json"
                      onChange={importJson}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={resetAll}
                    className="w-full rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200"
                  >
                    {t("editor.resetAll")}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#1B1B1B] p-4 space-y-3">
                <label className="block text-xs uppercase tracking-[0.2em] text-[#D6B36A]">
                  {t("editor.brand")}
                </label>
                <input
                  value={menuData.brand}
                  onChange={(e) => setRootField("brand", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm outline-none text-white font-[inherit]"
                />
                <label className="block text-xs uppercase tracking-[0.2em] text-[#D6B36A]">
                  {t("editor.title")}
                </label>
                <input
                  value={menuData.title}
                  onChange={(e) => setRootField("title", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm outline-none text-white font-[inherit]"
                />
                <label className="block text-xs uppercase tracking-[0.2em] text-[#D6B36A]">
                  {t("editor.subtitle")}
                </label>
                <textarea
                  value={menuData.subtitle}
                  onChange={(e) => setRootField("subtitle", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm outline-none text-white font-[inherit]"
                />
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#1B1B1B] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#D6B36A]">
                    {t("editor.categories")}
                  </label>
                  <button
                    onClick={addCategory}
                    className="rounded-xl bg-[#D6B36A] px-3 py-2 text-xs font-medium text-black"
                  >
                    {t("editor.add")}
                  </button>
                </div>
                <div className="grid gap-2">
                  {menuData.categories.map((cat, i) => (
                    <button
                      key={`cat-${i}`}
                      onClick={() => {
                        setSelectedCategoryIndex(i);
                        setSelectedItemIndex(0);
                      }}
                      className={`rounded-xl border px-3 py-2 text-left text-sm font-[inherit] ${i === selectedCategoryIndex ? "border-[#D6B36A]/40 bg-[#222222] text-white" : "border-white/5 bg-[#101010] text-[#A6A6A6]"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => moveCategory(-1)}
                    className="rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm text-white"
                  >
                    {t("editor.up")}
                  </button>
                  <button
                    onClick={() => moveCategory(1)}
                    className="rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm text-white"
                  >
                    {t("editor.down")}
                  </button>
                </div>
                <input
                  value={selectedCategory?.name || ""}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm outline-none text-white font-[inherit]"
                />
                <button
                  onClick={removeCategory}
                  className="mt-3 w-full rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200"
                >
                  {t("editor.removeCategory")}
                </button>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#1B1B1B] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.2em] text-[#D6B36A]">
                    {t("editor.items")}
                  </label>
                  <button
                    onClick={addItem}
                    className="rounded-xl bg-[#D6B36A] px-3 py-2 text-xs font-medium text-black"
                  >
                    {t("editor.add")}
                  </button>
                </div>
                <div className="grid gap-2">
                  {selectedCategory?.items.map((item, i) => (
                    <button
                      key={`item-${i}`}
                      onClick={() => setSelectedItemIndex(i)}
                      className={`rounded-xl border px-3 py-2 text-left text-sm font-[inherit] ${i === selectedItemIndex ? "border-[#D6B36A]/40 bg-[#222222] text-white" : "border-white/5 bg-[#101010] text-[#A6A6A6]"}`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => moveItem(-1)}
                    className="rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm text-white"
                  >
                    {t("editor.up")}
                  </button>
                  <button
                    onClick={() => moveItem(1)}
                    className="rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm text-white"
                  >
                    {t("editor.down")}
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  <input
                    value={selectedItem?.name || ""}
                    onChange={(e) => setItemField("name", e.target.value)}
                    placeholder={t("editor.itemName")}
                    className="w-full rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm outline-none text-white font-[inherit]"
                  />
                  <input
                    value={selectedItem?.desc || ""}
                    onChange={(e) => setItemField("desc", e.target.value)}
                    placeholder={t("editor.description")}
                    className="w-full rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm outline-none text-white font-[inherit]"
                  />
                  <input
                    value={selectedItem?.price || ""}
                    onChange={(e) => setItemField("price", e.target.value)}
                    placeholder={t("editor.price")}
                    className="w-full rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm outline-none text-white font-[inherit]"
                  />
                  <input
                    value={selectedItem?.tag || ""}
                    onChange={(e) => setItemField("tag", e.target.value)}
                    placeholder={t("editor.tag")}
                    className="w-full rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm outline-none text-white font-[inherit]"
                  />
                  <div className="grid gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm text-white"
                    >
                      {t("editor.uploadImage")}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => uploadImage(e.target.files?.[0])}
                    />
                    {selectedItem?.image ? (
                      <img
                        src={selectedItem.image}
                        alt={selectedItem.name}
                        className="h-24 w-full rounded-xl border border-white/10 object-cover"
                      />
                    ) : null}
                  </div>
                </div>
                <button
                  onClick={removeItem}
                  className="mt-3 w-full rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200"
                >
                  {t("editor.removeItem")}
                </button>
              </div>
            </div>
          </aside>
        )}

        <div className="mx-auto w-full max-w-md overflow-hidden rounded-[34px] border border-[#D6B36A]/10 bg-[#090909] shadow-[0_24px_70px_rgba(0,0,0,0.48)]">
          {!editMode && (
            <div className="p-4 pb-0 text-right">
              <button
                onClick={() => setEditMode(true)}
                className="rounded-xl border border-[#D6B36A]/25 bg-[#1B1B1B] px-3 py-2 text-xs font-medium text-[#D6B36A]"
              >
                {t("editor.editor")}
              </button>
            </div>
          )}

          <section
            id="top"
            className="relative overflow-hidden rounded-t-[34px] border-b border-[#D6B36A]/15 bg-[#090909]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,179,106,0.18),transparent_36%)]" />
            <div className="relative px-6 pb-8 pt-9 text-center">
              <div className="inline-flex items-center justify-center rounded-full border border-[#D6B36A]/35 bg-[linear-gradient(180deg,rgba(26,26,26,0.98),rgba(14,14,14,0.98))] px-6 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.34)]">
                <span className="text-[10px] uppercase tracking-[0.38em] text-[#E7CC8B]">
                  {menuData.brand}
                </span>
              </div>
              <p className="mt-7 text-[10px] uppercase tracking-[0.34em] text-[#D6B36A]">
                {t("common.exploreMenu")}
              </p>
              <h1 className="mt-3 text-[38px] font-semibold leading-[1.02] tracking-[-0.03em] text-[#F5F2EA]">
                {menuData.title}
              </h1>
              <div className="mx-auto mt-4 h-px w-24 bg-linear-to-r from-transparent via-[#D6B36A]/70 to-transparent" />
              <p className="mx-auto mt-5 max-w-[320px] text-[14px] leading-7 text-[#A6A6A6]">
                {menuData.subtitle}
              </p>
            </div>
          </section>

          <section className="sticky top-0 z-20 border-b border-white/5 bg-[#090909]/95 backdrop-blur-xl shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-linear-to-r from-[#090909] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-linear-to-l from-[#090909] via-[#090909]/95 to-transparent" />
              <div className="flex items-center justify-between px-4 pb-1 pt-2">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#8B836F]">
                  {t("common.browseCategories")}
                </p>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#D6B36A]">
                  <span>{t("common.swipe")}</span>
                  <span className="text-xs">→</span>
                </div>
              </div>

              <div
                ref={categoryScrollRef}
                onMouseDown={onScrollMouseDown}
                onMouseLeave={stopDrag}
                onMouseUp={stopDrag}
                onMouseMove={onScrollMouseMove}
                className="flex cursor-grab gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing select-none"
              >
                {sectionLinks.map((cat) => (
                  <a
                    key={cat.id}
                    href={`#${cat.id}`}
                    className="whitespace-nowrap rounded-full border border-[#D6B36A]/14 bg-[linear-gradient(180deg,#191919,#131313)] px-4 py-2.5 text-[13px] text-[#E7CC8B] shadow-[0_6px_18px_rgba(0,0,0,0.16)]"
                  >
                    {cat.name}
                  </a>
                ))}
                <div className="w-6 shrink-0" />
              </div>

              <div className="px-4 pb-3">
                <div
                  ref={indicatorTrackRef}
                  className="relative h-[3px] overflow-hidden rounded-full bg-white/8"
                >
                  <div
                    className="absolute top-0 h-full rounded-full bg-[#D6B36A]/80 shadow-[0_0_14px_rgba(214,179,106,0.32)] transition-[left,width] duration-150"
                    style={{
                      width: `${indicatorWidth}px`,
                      left: `${indicatorLeft}px`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          <main className="space-y-8 px-4 py-5">
            {sectionLinks.map((cat, idx) => (
              <div key={cat.id} className="space-y-4">
                <section
                  id={cat.id}
                  className="rounded-[30px] border border-white/4 shadow-[0_10px_30px_rgba(0,0,0,0.14)] bg-white/1 px-4 py-5"
                >
                  <div className="mb-6 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.30em] text-[#CFAF6D]">
                        {idx === 0
                          ? t("editor.mainCategory")
                          : t("editor.selection")}
                      </p>
                      <h2 className="mt-1 text-[27px] font-semibold tracking-[-0.03em] text-[#F7F3EB]">
                        {cat.name}
                      </h2>
                    </div>
                    <span className="text-[11px] tracking-[0.08em] text-[#8F8F8F]">
                      {t("editor.itemsCount", { count: cat.items.length })}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {cat.items.map((item, i) => (
                      <div
                        key={`${cat.id}-${i}`}
                        className="rounded-[24px] border border-white/5 bg-[linear-gradient(180deg,rgba(28,28,28,0.96),rgba(18,18,18,0.96))] px-3.5 py-3.5 shadow-[0_10px_26px_rgba(0,0,0,0.16)]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[16px] border border-white/8 bg-[#111111] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                            <img
                              src={item.image || fallbackImage(i + idx * 3)}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="truncate text-[16px] font-medium tracking-[-0.01em] text-[#F7F3EB]">
                                    {item.name}
                                  </h3>
                                  {item.tag ? (
                                    <span className="rounded-full border border-[#D6B36A]/12 bg-[#D6B36A]/8 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-[#D6B36A]">
                                      {item.tag}
                                    </span>
                                  ) : null}
                                </div>
                                <p className="mt-1 line-clamp-2 text-[13px] leading-[1.65] text-[#A8A29A]">
                                  {item.desc}
                                </p>
                              </div>

                              <div className="whitespace-nowrap rounded-full border border-[#D6B36A]/12 bg-[linear-gradient(180deg,#141414,#101010)] px-3 py-1.5 text-[12px] font-semibold text-[#E7CC8B] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                                {item.price}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="flex justify-center pt-1">
                  <a
                    href="#top"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#D6B36A]/14 bg-[linear-gradient(180deg,#181818,#111111)] px-3.5 py-2 text-[10px] uppercase tracking-[0.18em] text-[#CFAF6D] shadow-[0_6px_18px_rgba(0,0,0,0.14)]"
                  >
                    <span>{t("common.backToMenu")}</span>
                    <span className="text-[10px] text-[#8B836F]">↑</span>
                  </a>
                </div>
              </div>
            ))}
          </main>

          <a
            href="#top"
            className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-[#D6B36A]/16 bg-[linear-gradient(180deg,rgba(24,24,24,0.96),rgba(14,14,14,0.96))] px-4 py-3 text-[13px] text-[#E7CC8B] shadow-[0_12px_28px_rgba(0,0,0,0.24)] backdrop-blur-xl"
          >
            <span>{t("common.menu")}</span>
            <span className="text-xs text-[#B3B3B3]">↑</span>
          </a>
        </div>
      </div>
    </div>
  );
}
