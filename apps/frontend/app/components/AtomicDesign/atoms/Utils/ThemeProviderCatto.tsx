'use client';

import { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Theme Provider Catto - app/components/AtomicDesign/atoms/Utils/ThemeProviderCatto.tsx
// next-themes automatically handles:
// - localStorage persistence (key: 'theme')
// - System preference detection
// - Hydration/SSR handling

interface Props {
  children: ReactNode;
}

const ThemeProviderCatto: React.FC<Props> = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      enableSystem={true}
      defaultTheme="dark"
      storageKey="theme"
    >
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProviderCatto;
