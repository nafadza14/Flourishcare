import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Profile, UserRole } from "@/types/database";

type AuthState = {
  loading: boolean;
  profileLoading: boolean;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const currentUserIdRef = useRef<string | null>(null);

  const loadProfile = useCallback(async (userId: string) => {
    setProfileLoading(true);
    currentUserIdRef.current = userId;
    try {
      // Pakai RPC SECURITY DEFINER dulu (bypass RLS). Kalau gagal, fallback ke query biasa.
      const rpcRes = await withTimeout(
        supabase.rpc("get_my_profile") as unknown as Promise<{ data: unknown; error: unknown }>,
        8000,
        { data: null, error: null } as { data: unknown; error: unknown }
      );
      let profileData: Profile | null = null;
      const rpcRows = rpcRes.data as Array<Profile & { is_staff?: boolean }> | null;
      if (rpcRows && rpcRows.length > 0) {
        profileData = rpcRows[0];
      } else if (rpcRes.error) {
        // Fallback: query langsung
        const query = supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
        const { data } = await withTimeout(
          query as unknown as Promise<{ data: Profile | null; error: unknown }>,
          6000,
          { data: null, error: null } as { data: Profile | null; error: unknown }
        );
        profileData = (data as Profile | null) ?? null;
      }

      if (currentUserIdRef.current !== userId) return;
      setProfile(profileData);
      // eslint-disable-next-line no-console
      console.log("[AuthProvider] Profile loaded:", profileData);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("loadProfile error:", e);
      if (currentUserIdRef.current === userId) setProfile(null);
    } finally {
      if (currentUserIdRef.current === userId) setProfileLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const { data } = await withTimeout(
        supabase.auth.getSession(),
        4000,
        { data: { session: null } } as { data: { session: Session | null } }
      );
      setSession(data.session);
      if (data.session?.user?.id) {
        await loadProfile(data.session.user.id);
      } else {
        currentUserIdRef.current = null;
        setProfile(null);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("refresh error:", e);
      setSession(null);
      setProfile(null);
    }
  }, [loadProfile]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        await refresh();
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      if (s?.user?.id) {
        await loadProfile(s.user.id);
      } else {
        currentUserIdRef.current = null;
        setProfile(null);
        setProfileLoading(false);
      }
      // eslint-disable-next-line no-console
      console.log("[AuthProvider] onAuthStateChange:", event, s?.user?.email);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [refresh, loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    currentUserIdRef.current = null;
    setSession(null);
    setProfile(null);
    setProfileLoading(false);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      loading,
      profileLoading,
      session,
      profile,
      role: profile?.role ?? null,
      signOut,
      refresh,
    }),
    [loading, profileLoading, session, profile, signOut, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider.");
  return ctx;
}
