"use client";

import { supabase } from "@/lib/supabase";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function LoginClient() {
  const sp = useSearchParams();
  const router = useRouter();

  const nextPath = useMemo(() => sp.get("next") || "/dashboard", [sp]);

  const [email, setEmail] = useState("");
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setOk("");
    setErr("");

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
          : undefined;

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) throw new Error(error.message);

      setOk("Magic link sent! Check your email.");
      setEmail("");
    } catch (e: any) {
      setErr(e?.message || "Failed to send magic link");
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Login</h1>
      <p style={{ opacity: 0.8 }}>We’ll email you a magic sign-in link.</p>

      {err && <p style={{ color: "tomato" }}>{err}</p>}
      {ok && <p style={{ color: "limegreen" }}>{ok}</p>}

      <form onSubmit={sendMagicLink} style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            style={{ width: "100%", padding: 8 }}
            placeholder="you@business.com"
          />
        </label>

        <button type="submit" style={{ padding: 10 }}>
          Send magic link
        </button>

        <button
          type="button"
          style={{ padding: 10, opacity: 0.8 }}
          onClick={() => router.push("/")}
        >
          Back to home
        </button>
      </form>
    </main>
  );
}
