'use client';

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Martini,
  Droplets,
  Zap,
  Beer,
  GlassWater,
  Wine,
  ChevronRight,
  Coffee,
  Utensils,
  Cookie,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useMenuStore } from "@/store/menuStore";

interface PriceOption {
  label: string;
  value: string;
}

interface MenuItemProps {
  name: string;
  price?: string;
  prices?: PriceOption[];
  desc?: string;
  image?: string;
}

import { CldImage } from 'next-cloudinary';

const MenuItem = ({ name, price, prices, desc, image }: MenuItemProps) => {
  const isCloudinary = image?.includes('cloudinary.com');

  return (
    <div className="group flex items-center gap-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-lg">
      {image && (
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 group-hover:border-primary transition-colors bg-white/5">
          {isCloudinary ? (
            <CldImage
              src={image}
              alt={name}
              width={100}
              height={100}
              crop="fill"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={image}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-1">
          <div className="flex flex-col">
            <h4 className="text-base md:text-lg font-serif text-white group-hover:text-primary transition-colors pr-4">
              {name}
            </h4>
            {desc && (
              <p className="text-white/40 text-[10px] italic font-light mt-0.5 max-w-[200px] md:max-w-xs">
                {desc}
              </p>
            )}
          </div>

          <div className="flex-1 border-b border-dotted border-white/10 mx-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity" />

          <div
            className={cn(
              "flex flex-col items-end gap-1",
              prices && "translate-y-1",
            )}
          >
            {price && (
              <span className="text-primary font-black text-lg whitespace-nowrap">
                {price}
              </span>
            )}
            {prices?.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-tighter text-white/40 font-bold">
                  {p.label}
                </span>
                <span className="text-primary font-black text-lg md:text-xl whitespace-nowrap">
                  {p.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({
  title,
  icon,
  id,
}: {
  title: string;
  icon: React.ReactNode;
  id: string;
}) => (
  <div
    id={id}
    className="sticky top-[64px] z-20 py-6 bg-bg-dark/95 backdrop-blur-3xl mb-8 border-b border-white/5 scroll-mt-24"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
        {icon}
      </div>
      <h3 className="text-2xl md:text-5xl font-serif font-black text-white uppercase tracking-tighter italic">
        {title}
      </h3>
    </div>
  </div>
);

const SubCategoryTitle = ({
  title,
  price,
}: {
  title: string;
  price?: string;
}) => (
  <div className="flex justify-between items-end mt-12 mb-6 border-l-2 border-primary pl-4">
    <h4 className="text-xl md:text-2xl font-serif font-bold text-white uppercase tracking-wider">
      {title}
    </h4>
    {price && (
      <span className="text-primary font-black text-xl mb-0.5">{price}</span>
    )}
  </div>
);

const CategoryCard = ({
  title,
  image,
  id,
}: {
  title: string;
  image: string;
  id: string;
}) => {
  const isCloudinary = image?.includes('cloudinary.com');

  return (
    <motion.a
      href={`#${id}`}
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative aspect-[2.4/1] rounded-3xl overflow-hidden border border-white/10 group bg-white/5"
    >
      {isCloudinary ? (
        <CldImage
          src={image}
          alt={title}
          width={800}
          height={400}
          crop="fill"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500"
        />
      ) : (
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center justify-between">
          <h4 className="text-xl md:text-2xl font-serif font-black text-white italic tracking-tighter uppercase">
            {title}
          </h4>
          <ChevronRight
            className="text-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all"
            size={24}
          />
        </div>
      </div>
    </motion.a>
  );
};

const iconMap: Record<string, React.ReactNode> = {
  "section-shisha": <Flame size={20} />,
  "section-beer": <Beer size={20} />,
  "section-whiskey": <GlassWater size={20} />,
  "section-shots": <Zap size={20} />,
  "section-cocktails": <Martini size={20} />,
  "section-alcohol": <Wine size={20} />,
  "section-mocktails": <Droplets size={20} />,
  "section-cold-drinks": <Droplets size={20} />,
  "section-hot-drinks": <Coffee size={20} />,
  "section-food": <Utensils size={20} />,
  "section-desserts": <Cookie size={20} />,
};

export default function Menu() {
  const { t, i18n } = useTranslation();
  const { menu, fetchMenu, loading, error } = useMenuStore();
  const lang = (i18n.language === "pl" ? "pl" : "en") as "pl" | "en";

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  if (loading && menu.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-white/20 uppercase tracking-[0.4em] font-black text-[10px]">Preparing Experience...</p>
      </div>
    );
  }

  return (
    <section id="menu" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-24">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-primary uppercase tracking-[0.6em] text-[10px] font-black mb-4 block"
        >
          {t("menu.signature")}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl font-serif font-black text-white italic tracking-tighter"
        >
          {t("common.menu")}
          <span className="text-primary">.</span>
        </motion.h2>
      </div>

      {error && (
        <div className="text-center mb-12 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 font-bold uppercase tracking-widest text-xs">
          Offline Mode: Using Cache ({error})
        </div>
      )}

      {/* Category Selection Grid */}
      <div id="category-selection" className="mb-32 scroll-mt-24">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20 whitespace-nowrap">
            {t("menu.choosePoison")}
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menu.map((cat) => (
            <CategoryCard 
              key={cat._id} 
              title={cat.title[lang]} 
              image={cat.image} 
              id={cat.anchorId} 
            />
          ))}
        </div>
      </div>

      <div className="space-y-32">
        {menu.map((category) => (
          <div key={category._id} id={category.anchorId}>
            <SectionTitle
              title={category.title[lang]}
              icon={iconMap[category.anchorId] || <Droplets size={20} />}
              id={category.anchorId}
            />
            
            <div className="space-y-12">
              {/* Products without subcategory */}
              {category.products.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                  {category.products.map((item) => (
                    <MenuItem
                      key={item._id}
                      name={item.name[lang]}
                      price={item.price}
                      prices={item.prices}
                      desc={item.desc?.[lang]}
                      image={item.image}
                    />
                  ))}
                </div>
              )}

              {/* Subcategories */}
              {category.subcategories.map((sub) => (
                <div key={sub._id}>
                  <SubCategoryTitle title={sub.title[lang]} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                    {sub.products.map((item) => (
                      <MenuItem
                        key={item._id}
                        name={item.name[lang]}
                        price={item.price}
                        prices={item.prices}
                        desc={item.desc?.[lang]}
                        image={item.image}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
