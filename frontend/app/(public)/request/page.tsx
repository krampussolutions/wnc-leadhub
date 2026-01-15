"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Biz = {
  id: string;
  business_name: string;
  category: string | null;
  town: string | null;
};

export default function RequestQuote() {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const sp = useSearchParams();

  const [bizList, setBizList] = useState<Biz[]>([]);
  const [businessId, setBusinessId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingBiz, setLoadingBiz] = useState(false);

  // prefill from /directory click
  useEffect(() => {
    const id = sp.get("business_id");
    if (id) setBusinessId(id);
  }, [sp]);

  async function loadBusinesses() {
    setLoadingBiz(true);
    setErr("");
    try {
      const res = await fetch(`${API}/businesses`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setBizList(data.businesses || []);
    } catch (e: any) {
      setErr(e?.message || "Error loading businesses");
    } finally {
      setLoadingBiz(false);
    }
  }

  useEffect(() => {
    loadBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      if (!businessId) throw new Error("Please select a business");

      const res = await fetch(`${API}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: businessId,
          name,
          email: email || null,
          phone: phone || null,
          message,
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      window.location.href = "/thank-you";
    } catch (ex: any) {
      setErr(ex?.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h2>Request a Quote</h2>

      <p style={{ opacity: 0.8 }}>
        Select a business (or start from the <a href="/directory">Directory</a>).
      </p>

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.8 }}>Business</span>
          <select
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            required
            disabled={loadingBiz}
          >
            <option value="">{loadingBiz ? "Loading..." : "Select a business"}</option>
            {bizList.map((b) => (
              <option key={b.id} value={b.id}>
                {b.business_name} ({b.category || "General"} • {b.town || "WNC"})
              </option>
            ))}
          </select>
        </label>

        <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)} />
        <textarea placeholder="What do you need?" value={message} onChange={e => setMessage(e.target.value)} required rows={6} />

        {err && <div style={{ color: "crimson" }}>{err}</div>}

        <button disabled={loading}>{loading ? "Sending..." : "Submit"}</button>
      </form>
    </main>
  );
}
