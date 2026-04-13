'use client';

import { useEffect } from 'react';

// Initialize i18n on client side only
function I18nInit() {
  useEffect(() => {
    import('@/i18n/config');
  }, []);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <I18nInit />
      {children}
    </>
  );
}
