"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";

// Initial mock data (falls back to this if nothing is saved)
const initialData = [
  { id: "1", name: "Silk Scarf", sku: "SKU-001", price: 45, quantity: 10 },
  { id: "2", name: "Leather Bag", sku: "SKU-002", price: 150, quantity: 5 },
  { id: "3", name: "Gold Earrings", sku: "SKU-003", price: 80, quantity: 2 },
];

export default function Home() {
  const [products, setProducts] = useState(initialData);

  // Load items from local storage when the page loads
  useEffect(() => {
    const stored = localStorage.getItem("inventory");
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  function deleteProduct(id: string) {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("inventory", JSON.stringify(updatedProducts));
  }

  return (
    <main className="min-h-screen p-8 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Boutique Dashboard</h1>
            <p className="text-neutral-500 mt-1">Manage your inventory and stock levels.</p>
          </div>
          <Link href="/products/add">
            <Button className="shadow-md hover:shadow-lg">Add Product</Button>
          </Link>
        </header>

        <Card className="bg-white shadow-xl border-neutral-200 rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl">Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                  <TableHead className="font-semibold">Product Name</TableHead>
                  <TableHead className="font-semibold">SKU</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Quantity</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id} className="hover:bg-neutral-50 transition-colors">
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-neutral-500">{p.sku}</TableCell>
                    <TableCell>${p.price}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                        {p.quantity} in stock
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => deleteProduct(p.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}