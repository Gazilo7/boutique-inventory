"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));

    const storedProducts = localStorage.getItem("inventory");
    if (storedProducts) setProducts(JSON.parse(storedProducts));
  }, []);

  // Merge cart with product info
  const cartItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return { ...item, ...product };
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  function updateQty(id: string, change: number) {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  function removeItem(id: string) {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8">
        <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
        <h1 className="text-3xl font-bold text-neutral-700 mb-2">Your cart is empty</h1>
        <p className="text-neutral-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link href="/shop">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Continue Shopping</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8 md:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black tracking-tight text-neutral-900 mb-8">Your Cart</h1>

        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <Card key={item.id} className="bg-white shadow-md border-0">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg bg-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-neutral-400 text-xs">No Img</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-neutral-900">{item.name}</h3>
                  <p className="text-sm text-neutral-500">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, -1)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="font-bold w-8 text-center">{item.qty}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQty(item.id, 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="font-bold text-indigo-600 w-20 text-right">
                  ${(item.price * item.qty).toFixed(2)}
                </div>
                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div><Card className="bg-white shadow-xl border-0">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-neutral-500">Total</p>
              <h2 className="text-3xl font-black text-neutral-900">${totalPrice.toFixed(2)}</h2>
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}