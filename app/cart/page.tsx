"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function CartPage() {
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));

    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data) setProducts(data);
  }

  const cartItems = cart.map((item) => {
    const product = products.find((p) => p.id === item.id);
    return { ...item, ...product };
  }).filter(item => item.name);

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

  async function handleCheckout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const orderData = {
      customer_name: customerName,
      customer_email: customerEmail,
      total_amount: totalPrice,
      items: cartItems.map(item => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty
      })),
    };

    // 1. Insert the order into Supabase
    const { error: orderError } = await supabase.from('orders').insert([orderData]);

    if (orderError) {
      console.error("Error placing order:", orderError);
      alert("Failed to place order. Please check the console.");
      setLoading(false);
      return;
    }

    // 2. Reduce the stock for each product purchased
    for (const item of cartItems) {
      const newQuantity = Math.max(0, item.quantity - item.qty); // Prevent negative stock
      
      // Using string concatenation instead of backticks to avoid the VS Code bug
      console.log("Attempting to update: " + item.name + ". Old: " + item.quantity + ", Bought: " + item.qty + ", New: " + newQuantity);

      const { error: updateError } = await supabase
        .from('products')
        .update({ quantity: newQuantity })
        .eq('id', item.id);

      if (updateError) {
        console.error("Failed to update stock for: " + item.name, updateError);
        alert("Database Error: Could not update stock for " + item.name + ". Check the browser console (F12).");
      }
    }

    // 3. Success! Clear cart and show success screen
    localStorage.removeItem("cart");
    setCart([]);
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" /></motion.div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Order Placed Successfully!</h1>
        <p className="text-neutral-500 mb-8">Thank you for shopping with us. We will process your order shortly.</p>
        <Link href="/shop">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Continue Shopping</Button>
        </Link>
      </main>
    );
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

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
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
          </div>

          <div className="md:col-span-1">
            <Card className="bg-white shadow-xl border-0 sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2 text-neutral-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 mt-4 mb-6">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-indigo-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </div><form onSubmit={handleCheckout} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Full Name</label>
                    <Input 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)} 
                      placeholder="John Doe" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-700">Email Address</label>
                    <Input 
                      type="email" 
                      value={customerEmail} 
                      onChange={(e) => setCustomerEmail(e.target.value)} 
                      placeholder="john@example.com" 
                      required 
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30">
                    {loading ? "Processing..." : "Complete Checkout"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}