"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Star, Sparkles, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LandingPage() {
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    // Fetch the 3 most recent products to showcase
    async function fetchFeatured() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .limit(3)
        .order('created_at', { ascending: false });
      if (data) setFeatured(data);
    }
    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden relative">
      {/* Background Gradient Blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" /> Discover curated luxury
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
            Elevate Your <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Boutique Experience
            </span>
          </h1>
          
          <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
            Explore our exclusive collection of handpicked items designed to bring elegance and style to your everyday life.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/shop">
              <Button className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-500/30 transition-all hover:scale-105">
                <ShoppingBag className="mr-2 h-5 w-5" /> Shop Collection
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="h-14 px-8 text-lg rounded-full bg-neutral-900 border-neutral-700 hover:bg-neutral-800 text-white transition-all">
                Admin Login
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <Star className="h-8 w-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
            <p className="text-neutral-400">Only the finest materials and craftsmanship make it to our shelves.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Curated Selection</h3><p className="text-neutral-400">Every item is handpicked by our team to ensure unique style.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <ShieldCheck className="h-8 w-8 text-pink-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure Shopping</h3>
            <p className="text-neutral-400">Your data and transactions are always protected with us.</p>
          </div>
        </motion.div>

        {/* Featured Products */}
        {featured.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-32"
          >
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-4xl font-bold mb-2">Featured Drops</h2>
                <p className="text-neutral-400">Check out our latest arrivals</p>
              </div>
              <Link href="/shop" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 font-medium">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((item) => (
                <Link key={item.id} href="/shop">
                  <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all cursor-pointer">
                    <div className="h-64 bg-neutral-800 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600">No Image</div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-1">{item.name}</h3>
                      <p className="text-indigo-400 font-bold text-lg">${item.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}