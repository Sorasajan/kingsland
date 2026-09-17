"use client";

import { useEffect, useState } from "react";
import type { Role } from "@/lib/permissions";

interface AdminSession {
  sub: string;
  email: string;
  name: string;
  role: Role;
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setSession(data?.user ?? null))
      .finally(() => setLoading(false));
  }, []);

  return { session, loading };
}
