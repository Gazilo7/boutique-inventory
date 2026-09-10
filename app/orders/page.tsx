"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminGuard from "@/components/AdminGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock, CheckCircle, User, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-neutral-500">Loading orders...</div>;

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8 md:p-10">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Customer Orders</h1>
            <p className="text-neutral-500 mt-2">View and manage all incoming boutique orders.</p>
          </header>

          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
              <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-neutral-700 mb-2">No orders yet</h2>
              <p className="text-neutral-500">When customers checkout, their orders will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="bg-white shadow-xl border-0 overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-neutral-50 border-b p-6 flex flex-wrap justify-between items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-neutral-900 font-bold text-lg">
                          <User className="h-5 w-5 text-indigo-600" />
                          {order.customer_name}
                        </div>
                        <div className="flex items-center gap-2 text-neutral-500 text-sm">
                          <Mail className="h-4 w-4" />
                          {order.customer_email}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-neutral-500">Total Amount</p>
                          <p className="text-2xl font-bold text-indigo-600">${order.total_amount.toFixed(2)}</p>
                        </div>
                        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-4 text-neutral-800">Items Ordered</h3><div className="space-y-4">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center bg-neutral-50 p-4 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="bg-indigo-100 p-2 rounded-full">
                                <Package className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="font-bold text-neutral-900">{item.name}</p>
                                <p className="text-sm text-neutral-500">Qty: {item.quantity} × ${item.price}</p>
                              </div>
                            </div>
                            <p className="font-bold text-neutral-700">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm text-neutral-500">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Placed on: {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2 text-green-600 font-medium">
                          <CheckCircle className="h-4 w-4" />
                          Payment Pending (Mock)
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AdminGuard>
  );
}