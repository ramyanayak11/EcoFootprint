"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await supabase.auth.signOut();
      router.push("/"); // Redirect after logout
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 text-green-900">
      <p className="text-lg">Logging you out...</p>
    </div>
  );
}
