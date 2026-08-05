"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RoleSlug } from "@/lib/rbac";
import { canAccessModule } from "@/lib/rbac";

export interface StaffSession {
  email: string;
  name: string;
  role: RoleSlug;
  roleLabel: string;
  avatar?: string;
}

export interface AuthContextType {
  session: StaffSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: RoleSlug) => boolean;
  hasAnyRole: (roles: RoleSlug[]) => boolean;
  canAccess: (resource: string, action?: string) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialSession?: StaffSession | null;
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [session, setSession] = useState<StaffSession | null>(initialSession ?? null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadSession() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setSession(null);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from("users")
          .select("*, roles(*)")
          .eq("id", user.id)
          .single() as unknown as {
          data: {
            name: string;
            avatar_url: string | null;
            roles: { name: string; slug: string } | null;
          } | null;
        };

        const roleSlug = (profile?.roles?.slug ?? "editor") as RoleSlug;

        setSession({
          email: user.email ?? "",
          name: profile?.name ?? user.email ?? "User",
          role: roleSlug,
          roleLabel: roleSlug,
          avatar: profile?.avatar_url ?? undefined,
        });
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, authUser) => {
      if (!authUser) {
        setSession(null);
        setLoading(false);
        return;
      }
      loadSession();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const isAuthenticated = session !== null;

  const hasRole = (role: RoleSlug): boolean => {
    return session?.role === role;
  };

  const hasAnyRole = (roles: RoleSlug[]): boolean => {
    return roles.includes(session?.role as RoleSlug);
  };

  const canAccess = (resource: string, _action?: string): boolean => {
    if (!session) return false;
    return canAccessModule(session.role, resource as any);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        isAuthenticated,
        hasRole,
        hasAnyRole,
        canAccess,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}