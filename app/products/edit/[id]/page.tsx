"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import AdminGuard from "@/components/AdminGuard";
import { supabase } from "@/lib/supabase";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    if (!error && data) setProduct(data);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const updatedProduct = {
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      price: parseFloat(formData.get("price") as string),
      quantity: parseInt(formData.get("quantity") as string),
    };

    // Update in Supabase
    const { error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', id);

    if (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    } else {
      router.push("/");
    }
    setLoading(false);
  }

  if (!product) return <div className="p-10 text-center">Loading...</div>;

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 p-8 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <Link href="/" className="inline-flex items-center text-sm text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h1 className="text-3xl font-bold text-white mb-6">Edit Item</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90">Product Name</label>
                  <Input className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white" defaultValue={product.name} name="name" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90">SKU</label>
                    <Input className="bg-white/20 border-white/30 text-white placeholder:text-white/50" defaultValue={product.sku} name="sku" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90">Price ($)</label>
                    <Input className="bg-white/20 border-white/30 text-white placeholder:text-white/50" type="number" defaultValue={product.price} name="price" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90">Quantity</label>
                  <Input className="bg-white/20 border-white/30 text-white placeholder:text-white/50" type="number" defaultValue={product.quantity} name="quantity" required />
                </div><div className="flex justify-end gap-4 pt-4">
                  <Link href="/">
                    <Button type="button" variant="outline" className="bg-transparent text-white border-white/40 hover:bg-white/10">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={loading} className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg">
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </AdminGuard>
  );
}