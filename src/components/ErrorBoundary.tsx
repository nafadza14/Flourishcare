import { Component, type ReactNode } from "react";

type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#FFFDE9", color: "#7A4C3D", fontFamily: "Poppins, sans-serif" }}>
          <div style={{ maxWidth: 520, background: "white", borderRadius: 24, padding: 32, border: "1px solid rgba(242,153,53,0.15)" }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Ada gangguan sementara</h1>
            <p style={{ fontSize: 14, color: "#9A6C5D", marginBottom: 16 }}>
              Aplikasi mengalami error saat memuat halaman. Coba muat ulang. Bila terus terjadi, hubungi admin.
            </p>
            {this.state.error && (
              <pre style={{ fontSize: 11, background: "#FFFDE9", padding: 12, borderRadius: 8, overflow: "auto", color: "#9A6C5D", whiteSpace: "pre-wrap" }}>
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: 16, padding: "10px 20px", background: "#F29935", color: "white", borderRadius: 999, border: "none", fontWeight: 600, cursor: "pointer" }}
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
