"use client";

import { Toaster } from "@/components/ui/toaster";
import { APIProviderWrapper } from "@/components/google-maps-provider";
import { AuthProvider } from "@/components/auth/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <APIProviderWrapper>
        {children}
        <Toaster />
      </APIProviderWrapper>
    </AuthProvider>
  );
}
