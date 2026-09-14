"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
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
    toast.success("Added to cart!");
  }

  if (loading) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Elegant & Luxe Shop</h1>
          <p className="text-neutral-500 mt-2">Discover our latest collections.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-xl overflow-hidden border-0">
              <div className="h-48 w-full bg-neutral-200 animate-pulse" />
              <div className="p-6">
                <div className="h-6 w-3/4 bg-neutral-200 rounded animate-pulse mb-3" />
                <div className="h-6 w-1/4 bg-neutral-200 rounded animate-pulse mb-6" />
                <div className="flex justify-between items-center">
                  <div className="h-4 w-1/3 bg-neutral-200 rounded animate-pulse" />
                  <div className="h-9 w-1/3 bg-neutral-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8 md:p-10">
      <div className="max-w-6xl mx-auto">

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