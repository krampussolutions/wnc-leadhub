"use client";

import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const sp = useSearchParams();
  const next = sp.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setOk("");

    try {
      if (!email) throw new Error("Enter your email");

      // Send user to callback, which finalizes session then redirects to `next`
      const redirectTo =
        `${window.location.origin}/auth/callback?next=` + encodeURIComponent(next);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });

      if (error) throw error;

      setOk("Check your email for the login link.");
      setEmail("");
    } catch (e: any) {
      setErr(e?.message || "Login failed");
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h1>Business Login</h1>
      <p style={{ opacity: 0.8 }}>Enter your email and we’ll send a sign-in link.</p>

      {err && <p style={{ color: "tomato" }}>{err}</p>}
      {ok && <p style={{ color: "limegreen" }}>{ok}</p>}

      <form onSubmit={sendLink} style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
            placeholder="you@business.com"
          />
        </label>

        <button type="submit" style={{ padding: 10 }}>
          Send login link
        </button>
      </form>

      <p style={{ marginTop: 16, opacity: 0.8 }}>
        After signing in, you’ll go to: <b>{next}</b>
      </p>
    </main>
  );
}
