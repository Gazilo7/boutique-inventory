"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, UploadCloud, Video } from "lucide-react";
import { motion } from "framer-motion";
import AdminGuard from "@/components/AdminGuard";
import { supabase } from "@/lib/supabase";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("Please upload an image smaller than 2MB.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // Local preview
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setLoading(true);

    let imageUrl = "";

    // 1. Upload image to Supabase Storage if a file exists
    if (file) {
      const fileExt = file.name.split('.').pop();
      // Using string concatenation instead of template literal to avoid the regex bug
      const fileName = Date.now().toString() + "." + fileExt;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Failed to upload image. Check the console.");
        setLoading(false);
        return;
      }

      // Get the public URL of the uploaded image
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
      
      imageUrl = data.publicUrl;
    }

    // 2. Save the product data to the database
    const formData = new FormData(form);
    const newProduct = {
      id: Date.now().toString(),
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      price: parseFloat(formData.get("price") as string),
      quantity: parseInt(formData.get("quantity") as string),
      image: imageUrl, // Save the public URL instead of Base64
      video_url: formData.get("videoUrl") as string,
    };

    const { error } = await supabase.from('products').insert([newProduct]);

    if (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Check the console.");
    } else {
      router.push("/");
    }
    setLoading(false);
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500 p-8 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <Link href="/" className="inline-flex items-center text-sm text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h1 className="text-3xl font-bold text-white mb-6">Add New Item</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90">Product Name</label>
                  <Input className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white" placeholder="Silk Scarf" name="name" required />
                </div><div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90">SKU</label>
                    <Input className="bg-white/20 border-white/30 text-white placeholder:text-white/50" placeholder="SKU-004" name="sku" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90">Price ($)</label>
                    <Input className="bg-white/20 border-white/30 text-white placeholder:text-white/50" type="number" placeholder="45" name="price" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90">Quantity</label>
                  <Input className="bg-white/20 border-white/30 text-white placeholder:text-white/50" type="number" placeholder="10" name="quantity" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/90">Video URL (Optional)</label>
                  <div className="relative">
                    <Video className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                    <Input className="bg-white/20 border-white/30 text-white placeholder:text-white/50 pl-10" type="url" placeholder="https://youtube.com/..." name="videoUrl" />
                  </div>
                </div>

                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center cursor-pointer hover:bg-white/10 transition-colors relative">
                  {preview ? (
                    <div className="flex flex-col items-center">
                      <img src={preview} alt="Preview" className="max-h-40 rounded-lg mb-2" />
                      <p className="text-white/70 text-xs">Click to change image</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="mx-auto h-10 w-10 text-white/70 mb-2" />
                      <p className="text-white/70 text-sm">Click to upload an image</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Link href="/">
                    <Button type="button" variant="outline" className="bg-transparent text-white border-white/40 hover:bg-white/10">Cancel</Button>
                  </Link>
                  <Button type="submit" disabled={loading} className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg">
                    {loading ? "Uploading..." : "Save Item"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
    </AdminGuard>
  );
}