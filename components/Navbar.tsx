"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Added usePathname
import { supabase } from "@/lib/supabase";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Tracks the current URLut
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // ⚠️ CHANGE THIS to your actual Admin email!
  const ADMIN_EMAIL = "gazamarkus@yahoo.com"; 

  useEffect(() => {
    setMounted(true);

    // Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        setIsAdmin(session.user.email === ADMIN_EMAIL);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        setIsAdmin(session.user.email === ADMIN_EMAIL);
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Update Cart Count whenever the URL changes (fixes the badge bug)
  useEffect(() => {
    function updateCartCount() {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const cart = JSON.parse(storedCart);
        const count = cart.reduce((acc: number, item: any) => acc + item.qty, 0);
        setCartCount(count);
      } else {
        setCartCount(0);
      }
    }
    updateCartCount();
  }, [pathname]); // Re-runs every time you navigate to a new page

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsLoggedIn(false);
    router.push("/");
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-bold text-xl">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Elegant & Luxe
          </span>
        </Link>
        
        {mounted && (
          <div className="flex items-center gap-6">
            <Link href="/shop" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
              Shop
            </Link>
            
            {/* Cart Icon with Badge */}
            <Link href="/cart" className="relative text-sm font-medium text-neutral-600 hover:text-neutral-900 flex items-center">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href="/track" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
              Track Order
            </Link>

            {/* Links for Logged-in Users */}
            {isLoggedIn && (
              <Link href="/account" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
                My Account
              </Link>
            )}
            
            {/* Links for Admin */}
            {isAdmin && (
              <>
                <Link href="/dashboard" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">
                  Dashboard
                </Link>
                <Link href="/orders" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
                  Orders
                </Link>
                <Link href="/products/add">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
                    Add Item
                  </Button>
                </Link>
              </>
            )}{/* Auth Buttons */}
            {isLoggedIn ? (
              <Button onClick={handleLogout} variant="ghost" className="text-sm text-neutral-500 hover:text-red-600">
                Logout
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                {/* NEW: Customer Login / Register Link */}
                <Link href="/account" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                  Login / Register
                </Link>

              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}