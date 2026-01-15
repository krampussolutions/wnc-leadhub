"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "http://localhost:3000/dashboard" },
    });

    if (error) setMsg(error.message);
    else setMsg("Check your email for the login link.");
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", padding: 16 }}>
      <h2>Business Login</h2>
      <form onSubmit={sendLink} style={{ display: "grid", gap: 10 }}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@business.com" required />
        <button>Send login link</button>
      </form>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  );
}
