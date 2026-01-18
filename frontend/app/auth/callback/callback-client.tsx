"use client";

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackClient() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const next = params.get("next") || "/dashboard";
        router.replace(next);
      } else {
        router.replace("/login");
      }
    });
  }, [router, params]);

  return <p>Signing you in…</p>;
}
