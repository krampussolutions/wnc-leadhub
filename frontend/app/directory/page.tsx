import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Business = {
  id: string;
  business_name: string;
  category: string;
  town: string | null;
};

export default async function DirectoryPage() {
  const { data } = await supabase
    .from("businesses")
    .select("id,business_name,category,town")
    .eq("subscription_status", "active")
    .order("business_name");

  const businesses = data ?? [];

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Directory</h1>

      {businesses.length === 0 && (
        <p>No active businesses yet.</p>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {businesses.map((b) => (
          <div key={b.id} style={{ border: "1px solid #333", padding: 12 }}>
            <strong>{b.business_name}</strong>
            <div>{b.category}{b.town ? ` • ${b.town}` : ""}</div>
            <a href={`/request?business_id=${b.id}`}>
              Request a quote →
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
