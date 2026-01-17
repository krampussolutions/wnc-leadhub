import { Suspense } from "react";
import CallbackClient from "./callback-client";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>Finishing sign-in…</main>}>
      <CallbackClient />
    </Suspense>
  );
}
