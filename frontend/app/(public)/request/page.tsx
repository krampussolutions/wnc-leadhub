import { Suspense } from "react";
import RequestClient from "./request-client";

export default function RequestPage() {
  return (
    <Suspense
      fallback={
        <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
          Loading…
        </main>
      }
    >
      <RequestClient />
    </Suspense>
  );
}
