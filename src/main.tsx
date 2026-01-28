
/// <reference types="./vite-env.d.ts" />
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { Analytics } from "@vercel/analytics/react";
import { initMetaPixel, trackPageView } from "./utils/metaPixel";

// Initialize Meta Pixel if Pixel ID is configured
const pixelId = import.meta.env.VITE_META_PIXEL_ID;
if (pixelId) {
  initMetaPixel(pixelId);
  trackPageView();
}

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
    <Analytics />
  </AuthProvider>
);
  