"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, ImageOff, Video, Pencil, Search, Package, DollarSign, AlertTriangle } from "lucide-react";

const initialData = [
  { id: "1", name: "Silk Scarf", sku: "SKU-001", price: 45, quantity: 10, image: "", videoUrl: "" },
  { id: "2", name: "Leather Bag", sku: "SKU-002", price: 150, quantity: 5, image: "", videoUrl: "" },
  { id: "3", name: "Gold Earrings", sku: "SKU-003", price: 80, quantity: 2, image: "", videoUrl: "" },
];

export default function Home() {
  const [products, setProducts] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("inventory");
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  // Calculate live stats
  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
  const lowStockItems = products.filter((p) => p.quantity <= 2).length;

  // Filter products based on search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function deleteProduct(id: string) {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("inventory", JSON.stringify(updatedProducts));
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Boutique Dashboard</h1>
            <p className="text-neutral-500 mt-2">Manage your inventory with style.</p>
          </div>
          <Link href="/products/add">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </motion.div>
          </Link>
        </header>

        {/* Live Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Units</p>
                <h3 className="text-2xl font-bold">{totalItems}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Total Value</p>
                <h3 className="text-2xl font-bold">${totalValue.toFixed(2)}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-xl border-0">
            <CardContent className="p-6 flex items-center gap-4"><div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Low Stock Items</p>
                <h3 className="text-2xl font-bold text-red-600">{lowStockItems}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search by name or SKU..."
            className="pl-10 py-6 bg-white shadow-lg border-0 focus-visible:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white">
                <div className="relative h-48 w-full bg-neutral-200 flex items-center justify-center">
                  {p.image ? (
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className="hidden absolute inset-0 flex flex-col items-center justify-center text-neutral-400">
                      <ImageOff className="h-10 w-10 mb-2" />
                      <span className="text-sm">No Image</span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex gap-2">
                    <Link href={"/products/edit/" + p.id}>
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                        <Pencil className="h-4 w-4 text-neutral-700" />
                      </Button>
                    </Link>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => deleteProduct(p.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <h3 className="font-bold text-xl text-neutral-900 mb-1">{p.name}</h3>
                  <p className="text-xl font-bold text-indigo-600 mb-2">${p.price}</p>
                  <p className="text-sm text-neutral-500 mb-4">SKU: {p.sku}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-neutral-700">Qty: {p.quantity}</span>
                    {p.quantity <= 2 ? (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Low Stock</span>
                    ) : (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">In Stock</span>
                    )}
                  </div>{p.videoUrl && (
                    <Link href={p.videoUrl} target="_blank" className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:underline">
                      <Video className="h-4 w-4" /> Watch Product Video
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}