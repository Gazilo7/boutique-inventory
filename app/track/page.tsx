"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Search, Clock, CheckCircle, Truck } from "lucide-react";
import { motion } from "framer-motion";

export default function TrackPage() {
  const [email, setEmail] = useState("");
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', email.trim())
      .eq('id', orderId.trim())
      .single();

    if (error || !data) {
      setError("Order not found. Please double-check your email and Order ID.");
    } else {
      setOrder(data);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-xl mt-10">
        <div className="text-center mb-8">
          <Package className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-black tracking-tight text-neutral-900">Track Your Order</h1>
          <p className="text-neutral-500 mt-2">Enter your details below to check your order status.</p>
        </div>

        <Card className="bg-white shadow-xl border-0">
          <CardContent className="p-8">
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Email Address</label>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="The email you used at checkout" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Order ID</label>
                <Input 
                  value={orderId} 
                  onChange={(e) => setOrderId(e.target.value)} 
                  placeholder="Paste your Order ID here" 
                  required 
                />
              </div>
              
              {error && <p className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-md">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                {loading ? "Searching..." : "Track Order"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <Card className="bg-white shadow-xl border-0 overflow-hidden">
              <div className="bg-neutral-50 border-b p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-neutral-500">Order ID: {order.id.slice(0, 8)}...</p>
                  <p className="font-bold text-lg">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className={"px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 " + 
                  (order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                   order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :'bg-green-100 text-green-700')}>
                  {order.status === 'pending' ? <Clock className="h-4 w-4" /> : 
                   order.status === 'shipped' ? <Truck className="h-4 w-4" /> : 
                   <CheckCircle className="h-4 w-4" />}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Items Summary</h3>
                <div className="space-y-4">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-neutral-700">{item.quantity} × {item.name}</span>
                      <span className="font-medium text-neutral-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-indigo-600">${order.total_amount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </main>
  );
}