'use client';

import '@/i18n/config';
import { Toaster } from 'react-hot-toast';

// Sanitize Cloudinary environment variable to remove literal quotes
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.replace(/^["']|["']$/g, '');
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'inherit',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: '900',
            padding: '16px 24px',
            borderRadius: '16px',
          },
          success: {
            iconTheme: {
              primary: '#F0B32D',
              secondary: '#111',
            },
          },
        }}
      />
      {children}
    </>
  );
}
