import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Successfully authenticated
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 rounded-[2rem] shadow-lg border border-primary/10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img 
              src="https://i.pinimg.com/736x/e2/11/9a/e2119a970264b1116bf8c76318d1265a.jpg" 
              alt="FlourishCare Logo" 
              className="h-16 w-auto object-contain mix-blend-multiply mx-auto" 
              referrerPolicy="no-referrer" 
            />
          </Link>
          <h1 className="text-2xl font-heading font-bold text-text-primary">Selamat Datang Kembali</h1>
          <p className="text-text-secondary mt-2">Silakan login untuk mengakses sistem FlourishCare.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@flourishcare.id" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-text-primary">Password</label>
              <a href="#" className="text-xs text-primary hover:underline">Lupa password?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="your password" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full rounded-xl py-6 text-lg shadow-md shadow-primary/20">
            {loading ? "Memproses..." : "Masuk ke Dashboard"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-text-secondary">
          <p>Hanya untuk internal FlourishCare.</p>
        </div>
      </motion.div>
    </div>
  );
}
