"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Biz = {
  id: string;
  owner_user_id: string;
  business_name: string;
  category: string;
  town: string | null;
  phone: string | null;
  subscription_status: string;
};

export default function DashboardPage() {
  const [biz, setBiz] = useState<Biz | null>(null);
  const [status, setStatus] = useState("Loading...");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");

      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        window.location.href = "/login";
        return;
      }

      // Try load existing
      const existing = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_user_id", user.id)
        .maybeSingle();

      if (existing.error) {
        setErr(existing.error.message);
        setStatus("Error");
        return;
      }

      if (existing.data) {
        setBiz(existing.data as any);
        setStatus("Ready");
        return;
      }

      // Create on first login
      const created = await supabase
        .from("businesses")
        .insert({
          owner_user_id: user.id,
          business_name: "My Business",
          category: "general",
          town: "Robbinsville",
          subscription_status: "inactive",
        })
        .select("*")
        .single();

      if (created.error) {
        setErr(created.error.message);
        setStatus("Error creating business");
        return;
      }

      setBiz(created.data as any);
      setStatus("Created business profile");
    })();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h1>Dashboard</h1>
        <button onClick={signOut}>Sign out</button>
      </div>

      <p style={{ opacity: 0.8 }}>{status}</p>
      {err && <div style={{ color: "tomato" }}>❌ {err}</div>}

      {biz && (
        <div style={{ border: "1px solid #333", borderRadius: 12, padding: 12, marginTop: 16 }}>
          <div><b>Business:</b> {biz.business_name}</div>
          <div><b>Category:</b> {biz.category}</div>
          <div><b>Town:</b> {biz.town ?? ""}</div>
          <div><b>Phone:</b> {biz.phone ?? ""}</div>
          <div><b>Subscription:</b> {biz.subscription_status}</div>

          <div style={{ marginTop: 10, opacity: 0.8 }}>
            Next step: subscribe for $10/mo to appear in the directory.
          </div>
        </div>
      )}
    </main>
  );
}
