export default function ThankYouPage() {
  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h1>Thanks!</h1>
      <p style={{ opacity: 0.8 }}>Your request was submitted.</p>
      <p><a href="/directory">Back to directory →</a></p>
    </main>
  );
}
