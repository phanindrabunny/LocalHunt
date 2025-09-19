/*import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { APIProviderWrapper } from '@/components/google-maps-provider';
import { AuthProvider } from '@/components/auth/auth-provider';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Local Hunt',
  description: 'Discover trusted local vendors, small businesses, and street shops in your vicinity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased')}>
        <AuthProvider>
          <APIProviderWrapper>
            {children}
            <Toaster />
          </APIProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
*/
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers"; // import new wrapper

export const metadata: Metadata = {
  title: "Local Hunt",
  description: "Discover trusted local vendors, small businesses, and street shops in your vicinity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("font-body antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
