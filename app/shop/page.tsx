"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data) setProducts(data);
    setLoading(false);
  }

  function addToCart(productId: string) {
    const existingItem = cart.find((item) => item.id === productId);
    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item.id === productId ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      newCart = [...cart, { id: productId, qty: 1 }];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  const totalCartItems = cart.reduce((acc, item) => acc + item.qty, 0);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading shop...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Boutique Shop</h1>
            <p className="text-neutral-500 mt-2">Discover our latest collections.</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/">
              <Button variant="outline">Admin Login</Button>
            </Link>
            <Link href="/cart">
              <div className="bg-indigo-600 text-white p-3 rounded-full shadow-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-bold">{totalCartItems}</span>
              </div>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white">
                <div className="relative h-48 w-full bg-neutral-200 flex items-center justify-center">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-neutral-900 mb-1">{p.name}</h3>
                  <p className="text-xl font-bold text-indigo-600 mb-4">${p.price}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-neutral-500">{p.quantity} available</span>
                    <Button onClick={() => addToCart(p.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white"><Plus className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}