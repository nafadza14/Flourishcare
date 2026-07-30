import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Lock, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { GrainOverlay } from "@/components/GrainOverlay";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { session } = useAuth();

  const redirect = params.get("redirect") ?? "/dashboard";

  useEffect(() => {
    if (session) navigate(redirect, { replace: true });
  }, [session, redirect, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) throw err;
      navigate(redirect, { replace: true });
    } catch {
      setError("Email atau kata sandi salah.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot() {
    if (!email) {
      setError("Masukkan email dulu untuk mengirim tautan reset.");
      return;
    }
    setError(null);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (err) setError("Gagal mengirim tautan reset. Coba lagi nanti.");
    else setError("Tautan reset kata sandi telah dikirim ke email Anda.");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      <GrainOverlay />
      <div className="blob blob-peach w-[400px] h-[400px] -top-16 -right-16" />
      <div className="blob blob-mist w-[320px] h-[320px] -bottom-16 -left-16" />

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo className="h-24 w-auto" />
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-primary/10 shadow-warm-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-heading font-bold">
              Masuk <span className="font-accent text-primary text-4xl">Dashboard</span>
            </h1>
            <p className="text-sm text-text-secondary mt-1">Hanya untuk internal FlourishCare.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-primary/20 bg-background pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">Kata Sandi</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-primary/20 bg-background pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red bg-red/10 border border-red/20 rounded-2xl px-4 py-3">{error}</div>
            )}

            <Button type="submit" className="w-full rounded-full shadow-warm" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} /> Memproses…
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-2" /> Masuk
                </>
              )}
            </Button>

            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={handleForgot} className="text-primary hover:underline">
                Lupa kata sandi?
              </button>
              <Link to="/" className="text-text-secondary hover:text-primary">Kembali ke Beranda</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
