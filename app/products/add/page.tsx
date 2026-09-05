"use client"; // Required for form events

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const newProduct = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      price: parseFloat(formData.get("price") as string),
      quantity: parseInt(formData.get("quantity") as string),
    };

    // Get existing products or create an empty list
    const stored = localStorage.getItem("inventory");
    const existing = stored ? JSON.parse(stored) : [];

    // Save the new list to localStorage
    localStorage.setItem("inventory", JSON.stringify([...existing, newProduct]));

    setLoading(false);
    router.push("/"); // Send the user back to the dashboard
  }

  return (
    <main className="min-h-screen p-8 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <Link href="/" className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 mb-6 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Link>
        
        <Card className="bg-white shadow-xl border-neutral-200 rounded-xl p-2">
          <CardHeader className="border-b pb-6">
            <CardTitle className="text-3xl font-bold">Add New Item</CardTitle>
            <p className="text-neutral-500 text-sm mt-2">Fill out the details below to add a product to your inventory.</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input className="bg-neutral-50" placeholder="Silk Scarf" name="name" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU</label>
                  <Input className="bg-neutral-50" placeholder="SKU-004" name="sku" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input className="bg-neutral-50" type="number" placeholder="45" name="price" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input className="bg-neutral-50" type="number" placeholder="10" name="quantity" required />
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <Link href="/">
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={loading} className="shadow-md">
                  {loading ? "Saving..." : "Save Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}