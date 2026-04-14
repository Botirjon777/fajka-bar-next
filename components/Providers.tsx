'use client';

import '@/i18n/config';

// Sanitize Cloudinary environment variable to remove literal quotes
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.replace(/^["']|["']$/g, '');
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
