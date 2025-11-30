
  /// <reference types="./vite-env.d.ts" />
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { AuthProvider } from "./contexts/AuthContext";
  import { initGA } from "./utils/analytics";

  // Initialize Google Analytics
  initGA();

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  