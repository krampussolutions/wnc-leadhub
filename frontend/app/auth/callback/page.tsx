import { Suspense } from "react";
import CallbackClient from "./callback-client";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <CallbackClient />
    </Suspense>
  );
}
