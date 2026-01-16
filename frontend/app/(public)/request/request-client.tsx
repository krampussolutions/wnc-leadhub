"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Biz = { id: string; business_name: string; category: string; town: string | null };

export default function RequestClient() {
  const sp = useSearchParams();
  const preselect = sp.get("business") || "";

  const [bizList, setBizList] = useState<Biz[]>([]);
  const [businessId, setBusinessId] = useState(preselect);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setErr("");
      try {
        const res = await fetch(`${API}/businesses`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setBizList(data.businesses || data || []);
      } catch (e: any) {
        setErr(e.message || "Failed to load businesses");
      }
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setOk("");
    setErr("");

    try {
      if (!businessId) throw new Error("Please select a business");

      const res = await fetch(`${API}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: businessId, name, email, phone, message }),
      });

      if (!res.ok) throw new Error(await res.text());

      setOk("Request sent!");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (e: any) {
      setErr(e.message || "Failed to send");
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Request Service</h1>

      {err && <p style={{ color: "tomato" }}>{err}</p>}
      {ok && <p style={{ color: "limegreen" }}>{ok}</p>}

      <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <label>
          Business
          <select value={businessId} onChange={(e) => setBusinessId(e.target.value)} style={{ width: "100%", padding: 8 }}>
            <option value="">Select…</option>
            {bizList.map((b) => (
              <option key={b.id} value={b.id}>
                {b.business_name} {b.town ? `(${b.town})` : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          Your name
          <input value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: 8 }} />
        </label>

        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </label>

        <label>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%", padding: 8 }} />
        </label>

        <label>
          What do you need?
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} style={{ width: "100%", padding: 8 }} />
        </label>

        <button type="submit" style={{ padding: 10 }}>
          Send request
        </button>
      </form>
    </main>
  );
}
