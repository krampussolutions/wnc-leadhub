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

        <p style={{ opacity: 0.85 }}>
          <a href="/directory">Directory</a> •{" "}
          <a href="/request">Request Service</a> •{" "}
          <a href="/login">Business Login</a>
        </p>
      </div>
    </main>
  );
}
