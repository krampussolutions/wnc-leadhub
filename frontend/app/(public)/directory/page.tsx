export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";

type Business = {
  id: string;
  business_name: string | null;
  category: string | null;
  town: string | null;
  phone: string | null;
};

async function getBusinesses(): Promise<Business[]> {
  const { data, error } = await supabase
    .from("businesses")
    .select("id,business_name,category,town,phone")
    .eq("subscription_status", "active")
    .order("business_name", { ascending: true });

  if (error) return [];
  return (data as Business[]) ?? [];
}

export default async function DirectoryPage() {
  const businesses = await getBusinesses();

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Directory</h1>
      <p style={{ opacity: 0.8 }}>Browse active local pros in Western NC.</p>

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        {businesses.length === 0 ? (
          <div style={{ opacity: 0.8 }}>
            No businesses found. (Tip: set subscription_status = "active" for your test business.)
          </div>
        ) : (
          businesses.map((b) => (
            <div key={b.id} style={{ border: "1px solid #333", borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 700 }}>{b.business_name ?? "Business"}</div>

              <div style={{ opacity: 0.8 }}>
                {b.category ?? "Category"}
                {b.town ? ` • ${b.town}` : ""}
              </div>

              {b.phone ? <div style={{ marginTop: 8 }}>📞 {b.phone}</div> : null}

              <div style={{ marginTop: 10 }}>
                <a href={`/request?business_id=${encodeURIComponent(b.id)}`}>Request a quote →</a>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
