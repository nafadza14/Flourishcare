import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import BookApp from "./BookApp";
import AssessmentApp from "./AssessmentApp";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

// Deteksi subdomain untuk pilih app root.
// Dev override: `?book=1` atau `?assessment=1` untuk paksa render tanpa DNS.
function pickApp(): typeof App {
  if (typeof window === "undefined") return App;
  const host = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  if (host.startsWith("book.") || params.get("book") === "1") return BookApp;
  if (host.startsWith("assessment.") || params.get("assessment") === "1") return AssessmentApp;
  return App;
}

const RootApp = pickApp();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <RootApp />
    </ErrorBoundary>
  </StrictMode>
);
