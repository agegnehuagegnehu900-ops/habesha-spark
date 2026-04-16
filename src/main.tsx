import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeAdMob } from "./lib/admob";

// Initialize AdMob when running as native app
initializeAdMob().catch(console.error);

createRoot(document.getElementById("root")!).render(<App />);
