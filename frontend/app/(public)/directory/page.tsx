export const dynamic = "force-dynamic";

type Business = {
  id: string;
  business_name: string;
  category: string;
  town?: string | null;
  phone?: string | null;
};

const API = process.env.NEXT_PUBLIC_API_BASE!;

async function getBusinesses(): Promise<Business[]> {
  const res = await fetch(`${API}/businesses`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
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
              <div style={{ fontWeight: 700 }}>{b.business_name}</div>
              <div style={{ opacity: 0.8 }}>
                {b.category}
                {b.town ? ` • ${b.town}` : ""}
              </div>
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
