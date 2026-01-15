import Link from "next/link";

export default function ThankYou() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h2>✅ Request sent</h2>
      <p>The business will reach out soon.</p>
      <Link href="/">Back home</Link>
    </main>
  );
}
