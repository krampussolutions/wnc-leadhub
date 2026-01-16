export default function HomePage() {
  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>WNC LeadHub</h1>
      <p>Get listed + receive customer requests for $10/month.</p>

      <a
        href="https://buy.stripe.com/fZu00jf1deWVa95crQ6Ri00"
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          padding: "12px 18px",
          borderRadius: 10,
          background: "black",
          color: "white",
          textDecoration: "none",
          fontWeight: 700,
          marginTop: 12,
        }}
      >
        List My Business — $10/month
      </a>

      <div style={{ height: 24 }} />

      <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href="/directory">View Directory</a>
        <a href="/request">Request a Quote</a>
        <a href="/login">Business Login</a>
        <a href="/dashboard">Dashboard</a>
      </nav>
    </main>
  );
}
