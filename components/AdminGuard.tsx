"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // ⚠️ CHANGE THIS to the exact same admin email you used above!
  const ADMIN_EMAIL = "gazamarkus@yahoo.com"; 

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session OR the user is not the admin, kick them out
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }
    checkUser();
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-500">Checking permissions...</div>;
  }

  return <>{children}</>;
}