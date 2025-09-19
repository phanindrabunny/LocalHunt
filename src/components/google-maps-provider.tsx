"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

export function APIProviderWrapper({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error(
      "Google Maps API key is missing. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local file."
    );
  }

  return <APIProvider apiKey={apiKey || ""}>{children}</APIProvider>;
}
