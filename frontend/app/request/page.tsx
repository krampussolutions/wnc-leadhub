import { Suspense } from "react";
import RequestClient from "./request-client";

export default function RequestPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <RequestClient />
    </Suspense>
  );
}
