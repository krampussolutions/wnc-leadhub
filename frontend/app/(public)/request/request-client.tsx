"use client";

import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Biz = { id: string; business_name: string | null; town: string | null };

export default function RequestClient() {
  const sp = useSearchParams();
  const preselect = useMemo(() => sp.get("business_id") || "", [sp]);

  const [bizList, setBizList] = useState<Biz[]>([]);
  const [businessId, setBusinessId] = useState(preselect);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  // keep dropdown synced with URL preselect (if user clicks from directory)
  useEffect(() => {
    setBusinessId(preselect);
  }, [preselect]);

  useEffect(() => {
    (async () => {
      setErr("");

      const { data, error } = await supabase
        .from("businesses")
        .select("id,business_name,town")
        .eq("subscription_status", "active")
        .order("business_name", { ascending: true });

      if (error) {
        setErr(error.message);
        return;
      }

      setBizList((data as Biz[]) ?? []);
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setOk("");
    setErr("");

    try {
      if (!businessId) throw new Error("Please select a business");

      const { error } = await supabase.from("leads").insert({
        business_id: businessId,
        name,
        email,
        phone,
        message,
      });

      if (error) throw new Error(error.message);

      setOk("Request sent!");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (e: any) {
      setErr(e?.message || "Failed to send");
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Request a Quote</h1>

      {err && <p style={{ color: "tomato" }}>{err}</p>}
      {ok && <p style={{ color: "limegreen" }}>{ok}</p>}

      <form onSubmit={submit} style={{ display: "grid", gap: 10, marginTop: 16 }}>
        <label>
          Business
          <select
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="">Select…</option>
            {bizList.map((b) => (
              <option key={b.id} value={b.id}>
                {b.business_name ?? "Business"} {b.town ? `(${b.town})` : ""}
              </option>
            ))}
          </select>
        </label>

        <label>
          Your name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          Phone
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <label>
          Message
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        <button type="submit" style={{ padding: 10 }}>
          Send request
        </button>
      </form>
    </main>
  );
}
