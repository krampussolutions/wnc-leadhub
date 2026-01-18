"use client";

import { supabase } from "@/src/lib/supabase";
import { useEffect, useMemo, useState } from "react";

type Business = {
  id: string;
  owner_id: string;
  business_name: string;
  category: string;
  town: string | null;
  phone: string | null;
  subscription_status: string;
};

type Lead = {
  id: string;
  business_id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: string;
};

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const [biz, setBiz] = useState<Business | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);

  const [business_name, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [town, setTown] = useState("");
  const [phone, setPhone] = useState("");

  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  const isReady = useMemo(() => business_name.trim() && category.trim(), [business_name, category]);

  useEffect(() => {
    (async () => {
      setErr("");
      setOk("");
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        window.location.replace("/login");
        return;
      }

      setUserId(auth.user.id);
      setUserEmail(auth.user.email || "");

      // load business (owner can select via RLS)
      const { data: b, error: bErr } = await supabase
        .from("businesses")
        .select("*")
        .eq("owner_id", auth.user.id)
        .maybeSingle();

      if (bErr) {
        setErr(bErr.message);
        setLoading(false);
        return;
      }

      if (b) {
        setBiz(b as Business);
        setBusinessName((b as any).business_name || "");
        setCategory((b as any).category || "");
        setTown((b as any).town || "");
        setPhone((b as any).phone || "");
      }

      setLoading(false);
    })();
  }, []);

  async function saveBusiness(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setOk("");

    try {
      if (!userId) throw new Error("Not signed in.");
      if (!isReady) throw new Error("Business name and category are required.");

      // For MVP: set active for your own test listing (later Stripe flips this)
      const payload: any = {
        owner_id: userId,
        business_name: business_name.trim(),
        category: category.trim(),
        town: town.trim() || null,
        phone: phone.trim() || null,
        subscription_status: "active",
      };

      let res;
      if (biz?.id) {
        res = await supabase.from("businesses").update(payload).eq("id", biz.id).select("*").single();
      } else {
        res = await supabase.from("businesses").insert(payload).select("*").single();
      }

      if (res.error) throw res.error;

      setBiz(res.data as any);
      setOk("Business saved.");

    } catch (e: any) {
      setErr(e?.message || "Failed to save business.");
    }
  }

  async function loadLeads() {
    setErr("");
    setOk("");

    if (!biz?.id) {
      setLeads([]);
      return;
    }

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("business_id", biz.id)
      .order("created_at", { ascending: false });

    if (error) {
      setErr(error.message);
      return;
    }

    setLeads((data as any) || []);
  }

  useEffect(() => {
    loadLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biz?.id]);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.replace("/");
  }

  if (loading) {
    return <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>Loading dashboard…</main>;
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Dashboard</h1>
      <p style={{ opacity: 0.8 }}>Signed in as: <b>{userEmail}</b></p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <a href="/directory">View directory →</a>
        <a href="/request">Test request form →</a>
        <button onClick={signOut} style={{ marginLeft: "auto", padding: "6px 10px" }}>Sign out</button>
      </div>

      {err && <p style={{ color: "tomato" }}>{err}</p>}
      {ok && <p style={{ color: "limegreen" }}>{ok}</p>}

      <h2>Create / Update Business Listing</h2>
      <form onSubmit={saveBusiness} style={{ display: "grid", gap: 10, marginTop: 12, border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
        <label>
          Business name
          <input value={business_name} onChange={(e) => setBusinessName(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </label>
        <label>
          Category
          <input value={category} onChange={(e) => setCategory(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </label>
        <label>
          Town
          <input value={town} onChange={(e) => setTown(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </label>
        <label>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </label>

        <button type="submit" style={{ padding: 10 }}>
          Save listing
        </button>

        <p style={{ opacity: 0.75, margin: 0 }}>
          Note: for MVP your listing is set to <b>active</b> when saved. Later Stripe will control this.
        </p>
      </form>

      <h2 style={{ marginTop: 28 }}>Leads</h2>
      {!biz?.id ? (
        <p style={{ opacity: 0.8 }}>Save your business listing first to receive leads.</p>
      ) : leads.length === 0 ? (
        <p style={{ opacity: 0.8 }}>No leads yet. Try submitting the request form.</p>
      ) : (
        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {leads.map((l) => (
            <div key={l.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{l.name} — {l.email}</div>
              <div style={{ opacity: 0.8 }}>{l.phone || "No phone"}</div>
              <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{l.message || ""}</div>
              <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>{new Date(l.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
