"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import type { SessionUser } from "@/lib/types";

interface SessionState {
  user: SessionUser | null | undefined;
  refresh: () => Promise<void>;
  setUser: (user: SessionUser | null) => void;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);

  const refresh = useCallback(async () => {
    try {
      setUser(await api<SessionUser>("/api/auth/me"));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api<SessionUser>("/api/auth/me")
      .then((session) => {
        if (active) setUser(session);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({ user, refresh, setUser }),
    [user, refresh],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionState {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return session;
}
