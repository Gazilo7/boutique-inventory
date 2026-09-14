"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ShoppingCart, Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Update Cart Count and close mobile menu whenever the URL changes
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
    setIsMobileMenuOpen(false); 
  }, [pathname]);

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
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
            Elegant & Luxe
          </span>
        </Link>
        
        {mounted && (
          <>
            {/* DESKTOP LINKS (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/shop" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
                Shop
              </Link>
              
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

              <a 
                href="https://wa.me/+2349052467059" // Replace with your WhatsApp
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
              >
                Support
              </a>

              {isLoggedIn && (
                <Link href="/account" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">My Account
                </Link>
              )}
              
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
              )}

              {isLoggedIn ? (
                <Button onClick={handleLogout} variant="ghost" className="text-sm text-neutral-500 hover:text-red-600">
                  Logout
                </Button>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/account">
                    {/* DESKTOP LOGIN BUTTON - Now styled as an outline button */}
                    <Button variant="outline" className="text-sm border-indigo-600 text-indigo-600 hover:bg-indigo-50">
                      Login / Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE VIEW (Hidden on desktop) */}
            <div className="flex md:hidden items-center gap-4">
              <Link href="/cart" className="relative text-neutral-600">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-neutral-600 focus:outline-none">
                {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-xl absolute w-full left-0 top-16 flex flex-col p-6 space-y-4">
          <Link href="/shop" className="text-base font-medium text-neutral-700 hover:text-indigo-600">
            Shop
          </Link>
          <Link href="/track" className="text-base font-medium text-neutral-700 hover:text-indigo-600">
            Track Order
          </Link>
          <a 
            href="https://wa.me/+2349052467059" // Replace with your WhatsApp
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-base font-medium text-neutral-700 hover:text-indigo-600"
          >
            Support
          </a>
          
          {isLoggedIn && (
            <Link href="/account" className="text-base font-medium text-neutral-700 hover:text-indigo-600">
              My Account
            </Link>
          )}

          {isAdmin && (
            <>
              <div className="h-px bg-neutral-200 my-2" />
              <Link href="/dashboard" className="text-base font-bold text-indigo-600">
                Dashboard
              </Link>
              <Link href="/orders" className="text-base font-medium text-neutral-700 hover:text-indigo-600">
                Orders
              </Link>
              <Link href="/products/add">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Add Item
                </Button>
              </Link>
            </>
          )}

          <div className="h-px bg-neutral-200 my-2" />{isLoggedIn ? (
            <Button onClick={handleLogout} variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              Logout
            </Button>
          ) : (
            <Link href="/account" className="w-full">
              {/* MOBILE LOGIN BUTTON - Full width and styled */}
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Login / Register
              </Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}