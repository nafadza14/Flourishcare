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

// Flag global: menandai user memang klik "Keluar" secara eksplisit.
// Selama flag ini false, jangan clear session pada event apapun kecuali error hard.
let userInitiatedSignOut = false;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const currentUserIdRef = useRef<string | null>(null);
  const loadedForUserIdRef = useRef<string | null>(null);

  const loadProfile = useCallback(async (userId: string, forceReload = false) => {
    if (!forceReload && loadedForUserIdRef.current === userId) return;
    setProfileLoading(true);
    currentUserIdRef.current = userId;
    try {
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
        const query = supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
        const { data } = await withTimeout(
          query as unknown as Promise<{ data: Profile | null; error: unknown }>,
          6000,
          { data: null, error: null } as { data: Profile | null; error: unknown }
        );
        profileData = (data as Profile | null) ?? null;
      }

      if (currentUserIdRef.current !== userId) return;
      // PENTING: kalau profile sudah ada dan re-fetch return null (kemungkinan RLS glitch/timeout),
      // JANGAN reset ke null. Pertahankan profile lama.
      if (profileData) {
        setProfile(profileData);
        loadedForUserIdRef.current = userId;
      }
      // eslint-disable-next-line no-console
      console.log("[AuthProvider] Profile loaded:", profileData?.role ?? "kept previous");
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("loadProfile error:", e);
      // JANGAN clear profile on error — pertahankan state terakhir yang valid
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
      if (data.session) {
        setSession(data.session);
        if (data.session.user?.id) {
          await loadProfile(data.session.user.id, true);
        }
      }
      // Kalau getSession return null tapi user TIDAK explicit logout,
      // JANGAN clear state — mungkin cuma transient error.
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("refresh error:", e);
    }
  }, [loadProfile]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await withTimeout(
          supabase.auth.getSession(),
          4000,
          { data: { session: null } } as { data: { session: Session | null } }
        );
        if (!mounted) return;
        setSession(data.session);
        if (data.session?.user?.id) {
          await loadProfile(data.session.user.id);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, s) => {
      // eslint-disable-next-line no-console
      console.log("[AuthProvider] onAuthStateChange:", event, s?.user?.email, "userInitiatedSignOut:", userInitiatedSignOut);

      if (event === "SIGNED_IN") {
        setSession(s);
        if (s?.user?.id && loadedForUserIdRef.current !== s.user.id) {
          await loadProfile(s.user.id);
        }
        return;
      }

      if (event === "SIGNED_OUT") {
        // Hanya clear kalau user memang klik Keluar (userInitiatedSignOut = true).
        // Ini mencegah "auto logout" saat token refresh gagal atau race condition.
        if (userInitiatedSignOut) {
          currentUserIdRef.current = null;
          loadedForUserIdRef.current = null;
          setSession(null);
          setProfile(null);
          setProfileLoading(false);
          userInitiatedSignOut = false;
        } else {
          // Silent recovery: coba ambil session lagi dari storage.
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            setSession(data.session);
            // eslint-disable-next-line no-console
            console.log("[AuthProvider] SIGNED_OUT ignored - session recovered");
          }
        }
        return;
      }

      if (event === "TOKEN_REFRESHED") {
        // Update session reference dengan token baru, JANGAN reload profile.
        if (s) setSession(s);
        return;
      }

      if (event === "USER_UPDATED") {
        if (s) setSession(s);
        return;
      }

      // INITIAL_SESSION: biarkan initial useEffect yang handle
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    // Tandai bahwa ini logout dari user
    userInitiatedSignOut = true;
    await supabase.auth.signOut();
    currentUserIdRef.current = null;
    loadedForUserIdRef.current = null;
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
