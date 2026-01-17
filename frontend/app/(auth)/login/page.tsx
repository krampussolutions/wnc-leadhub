import { Suspense } from "react";
import LoginClient from "./login-client";

export default function LoginPage() {
  return (
    <Suspense fallback={<main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>Loading...</main>}>
      <LoginClient />
    </Suspense>
  );
}
