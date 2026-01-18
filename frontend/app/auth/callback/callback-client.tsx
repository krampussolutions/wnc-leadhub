"use client";

import { supabase } from "@/src/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CallbackClient() {
  const sp = useSearchParams();
  const next = useMemo(() => sp.get("next") || "/dashboard", [sp]);
  const code = sp.get("code"); // some flows use code param

  const [status, setStatus] = useState("Completing sign-in...");

  useEffect(() => {
    (async () => {
      try {
        // If code exists, exchange it (PKCE)
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        // Ensure session exists
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setStatus("No active session found. Try signing in again.");
          return;
        }

        window.location.replace(next);
      } catch (e: any) {
        setStatus(e?.message || "Auth callback failed. Try again.");
      }
    })();
  }, [code, next]);

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Signing you in…</h1>
      <p style={{ opacity: 0.8 }}>{status}</p>
    </main>
  );
}
