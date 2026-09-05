"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  // Force a fresh login state when the page loads
  useEffect(() => {
    localStorage.removeItem("isAdmin");
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      router.push("/");
    } else {
      setError("Invalid username or password. Hint: admin / admin123");
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
          <p className="text-sm text-neutral-500 mt-1">Enter credentials to manage inventory</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Username</label>
            <Input name="username" placeholder="admin" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700">Password</label>
            <Input name="password" type="password" placeholder="admin123" required />
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            Login
          </Button>
        </form>
      </div>
    </main>
  );
}