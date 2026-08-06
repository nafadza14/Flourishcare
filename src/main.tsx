import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import BookApp from "./BookApp";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

// Deteksi subdomain: kalau host mulai dengan "book." → render BookApp.
// Dev override: `?book=1` di URL juga memicu BookApp.
function isBookingSubdomain(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  if (host.startsWith("book.")) return true;
  const params = new URLSearchParams(window.location.search);
  return params.get("book") === "1";
}

const RootApp = isBookingSubdomain() ? BookApp : App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <RootApp />
    </ErrorBoundary>
  </StrictMode>
);
