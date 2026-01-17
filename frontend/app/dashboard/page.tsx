"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();

      if (!data?.user) {
        const next = encodeURIComponent("/dashboard");
        window.location.href = "/login?next=" + next;
        return;
      }

      setEmail(data.user.email ?? null);
      setLoading(false);
    })();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
        Loading dashboard…
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Dashboard</h1>
      <p style={{ opacity: 0.8 }}>Signed in as: <b>{email}</b></p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <a href="/directory">View directory →</a>
        <a href="/request">Test request form →</a>
        <button onClick={logout} style={{ padding: 10 }}>Sign out</button>
      </div>

      <hr style={{ margin: "24px 0", opacity: 0.2 }} />

      <p>
        Next step: add your “Create/Update Business Listing” form here (business_name, category, town, phone)
        and connect it to the <code>businesses</code> table in Supabase.
      </p>
    </main>
  );
}
