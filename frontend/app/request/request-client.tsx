"use client";

import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Biz = {
  id: string;
  business_name: string;
  town: string | null;
};

export default function RequestClient() {
  const sp = useSearchParams();
  const preselect = sp.get("business_id") ?? "";

  const [bizList, setBizList] = useState<Biz[]>([]);
  const [businessId, setBusinessId] = useState(preselect);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [ok, setOk] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    supabase
      .from("businesses")
      .select("id,business_name,town")
      .eq("subscription_status", "active")
      .then(({ data, error }) => {
        if (error) setErr(error.message);
        else setBizList(data ?? []);
      });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setOk("");

    const { error } = await supabase.from("leads").insert({
      business_id: businessId,
      name,
      email,
      phone,
      message,
    });

    if (error) setErr(error.message);
    else {
      setOk("Request sent!");
      setName(""); setEmail(""); setPhone(""); setMessage("");
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Request a Quote</h1>

      {err && <p style={{ color: "tomato" }}>{err}</p>}
      {ok && <p style={{ color: "green" }}>{ok}</p>}

      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <select value={businessId} onChange={e => setBusinessId(e.target.value)} required>
          <option value="">Select business</option>
          {bizList.map(b => (
            <option key={b.id} value={b.id}>
              {b.business_name} {b.town ? `(${b.town})` : ""}
            </option>
          ))}
        </select>

        <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
        <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} />

        <button type="submit">Send request</button>
      </form>
    </main>
  );
}
