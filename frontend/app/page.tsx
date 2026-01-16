export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "60px auto", padding: 16 }}>
      <h1 style={{ fontSize: 42, marginBottom: 8 }}>WNC Lead Hub</h1>

      <p style={{ fontSize: 18, opacity: 0.9 }}>
        A simple local directory and lead request system for Western North Carolina.
      </p>

      <div
        style={{
          marginTop: 24,
          padding: 16,
          border: "1px solid #333",
          borderRadius: 12,
        }}
      >
        <h2>How it works</h2>
        <ul>
          <li>Businesses subscribe for <b>$10/month</b></li>
          <li>They appear in the public directory</li>
          <li>Customers submit service requests</li>
          <li>Businesses receive the leads</li>
        </ul>

        <p style={{ marginTop: 12 }}>
          Contact:{" "}
          <a href="mailto:support@wnc-leadhub.com">
            support@wnc-leadhub.com
          </a>
        </p>

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

      <a href="/directory">View Directory</a>
      {" · "}
      <a href="/request">Request a Quote</a>
    </main>
  );
}


        <p style={{ opacity: 0.85 }}>
          <a href="/directory">Directory</a> •{" "}
          <a href="/request">Request Service</a> •{" "}
          <a href="/login">Business Login</a>
        </p>
      </div>
    </main>
  );
}
