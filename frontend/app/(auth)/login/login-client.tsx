"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function LoginClient() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setErr(error.message);
      return;
    }

    setMsg("Check your email for the magic link.");
  }

  return (
    <main style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
      <h1>Sign in</h1>

      {err && <p style={{ color: "tomato" }}>{err}</p>}
      {msg && <p style={{ color: "limegreen" }}>{msg}</p>}

      <form onSubmit={sendMagicLink} style={{ display: "grid", gap: 12 }}>
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10 }}
        />

        <button type="submit" style={{ padding: 10 }}>
          Send magic link
        </button>
      </form>
    </main>
  );
}
