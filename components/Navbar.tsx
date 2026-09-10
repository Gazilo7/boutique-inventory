"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });

    // 2. Listen for auth changes (login / logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-bold text-xl">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Boutique
          </span>
        </Link>
        
        {mounted && (
          <div className="flex items-center gap-4">
            <Link href="/shop" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
              Shop
            </Link>
            <Link href="/cart" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
              Cart
            </Link>
            
            {isAdmin && (
              <>
                <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
                  Inventory
                </Link>
                <Link href="/products/add">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
                    Add Item
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="outline" className="text-sm">
                  Logout
                </Button>
              </>
            )}

            {!isAdmin && (
              <Link href="/login" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
                Admin Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}