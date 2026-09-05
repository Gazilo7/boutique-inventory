"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-neutral-500">Checking permissions...</div>;
  }

  return <>{children}</>;
}