"use client";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    (async () => {
      const code = sp.get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          router.replace("/login");
          return;
        }
      }

      const next = sp.get("next") || "/dashboard";
      router.replace(next);
    })();
  }, [router, sp]);

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      Finishing sign-in…
    </main>
  );
}
