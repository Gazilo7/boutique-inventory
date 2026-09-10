"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Real Supabase Authentication
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh(); // Refresh to update the Navbar
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-100 p-3 rounded-full mb-4">
            <Lock className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Admin Login</h1>
          <p className="text-sm text-neutral-500 mt-1">Enter your credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Email</label>
            <Input name="email" type="email" placeholder="admin@boutique.com" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Password</label>
            <Input name="password" type="password" placeholder="••••••••" required />
          </div>
          
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}