// apps/frontend/app/layout.tsx
// Minimal root layout - actual layout is in [locale]/layout.tsx
// This is required by Next.js but delegates to the locale-specific layout

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Children will be the [locale]/layout.tsx which renders <html> and <body>
  return children;
}
