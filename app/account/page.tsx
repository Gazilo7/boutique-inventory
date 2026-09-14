"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Clock, CheckCircle, LogOut, User } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerAccountPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchOrders(session.user.email);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchOrders(session.user.email);
      } else {
        setOrders([]);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  async function fetchOrders(userEmail: string | undefined) {
    if (!userEmail) return;
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', userEmail)
      .order('created_at', { ascending: false });
    
    if (!error && data) setOrders(data);
  }

  async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthLoading(true);
    setError("");

    if (isSignUp) {
      // Sign Up
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else alert("Account created! You can now view your orders.");
    } else {
      // Login
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
    setAuthLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-neutral-500">Loading...</div>;

  // NOT LOGGED IN VIEW
  if (!session) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-full mb-4">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">{isSignUp ? "Create an Account" : "Customer Login"}</h1>
            <p className="text-sm text-neutral-500 mt-1">Track your orders and checkout faster</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            
            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

            <Button type="submit" disabled={authLoading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              {authLoading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
            </Button>
          </form><div className="mt-6 text-center">
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} className="text-sm text-indigo-600 hover:underline">
              {isSignUp ? "Already have an account? Log in" : "Don't have an account? Sign up"}
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-neutral-400">Or continue as a guest at checkout.</p>
          </div>
        </div>
      </main>
    );
  }

  // LOGGED IN VIEW
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8 md:p-10">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900">My Orders</h1>
            <p className="text-neutral-500 mt-1">Logged in as {session.user.email}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="text-neutral-700">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </header>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-xl">
            <Package className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-700 mb-2">No orders found</h2>
            <p className="text-neutral-500">You haven't placed any orders with this email yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-white shadow-xl border-0 overflow-hidden">
                  <div className="bg-neutral-50 border-b p-6 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-neutral-500">Order ID: {order.id.slice(0, 8)}...</p>
                      <div className="flex items-center gap-2 text-neutral-900 font-bold text-lg">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-500">Total</p>
                      <p className="text-2xl font-bold text-indigo-600">${order.total_amount.toFixed(2)}</p>
                    </div>
                    <div className="w-full sm:w-auto mt-4 sm:mt-0">
                      <span className={"px-4 py-2 rounded-full text-sm font-bold " + 
                        (order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                         order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                         'bg-green-100 text-green-700')}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-neutral-700">{item.quantity} × {item.name}</span>
                          <span className="font-medium text-neutral-900">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}