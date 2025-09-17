"use client";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../../lib/api";
import { Product } from "../../types"; // Use shared Product type

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  // Form state now matches the backend DTO
  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    rate: "",
    image: "",
  });

  const loadProducts = useCallback(async () => {
    if (token) {
      const data = await apiFetch("/products", token);
      setProducts(data);
    }
  }, [token]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);


  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    await apiFetch("/products", token, {
      method: "POST",
      // Body now sends the correct property names
      body: JSON.stringify({
        ...form,
        rate: +form.rate, // Convert rate to a number
      }),
    });

    // Reset form with correct keys
    setForm({
      code: "",
      name: "",
      description: "",
      rate: "",
      image: "",
    });

    await loadProducts();
  }


  return (
        <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Products</h1>

      <form onSubmit={handleCreate} className="mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Code"
          value={form.code}
          onChange={e => setForm({ ...form, code: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Rate"
          type="number"
          value={form.rate}
          onChange={e => setForm({ ...form, rate: e.target.value })}
        />
        <input
          className="border p-2 w-full"
          placeholder="Image URL"
          value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })}
        />
        <button className="bg-green-600 text-white px-4 py-2">Add Product</button>
      </form>
      <button onClick={loadProducts}>Refresh</button>

      <ul className="space-y-2">
        {products.map(p => (
          <li key={p.id} className="border p-2">
            <div className="font-semibold">{p.name}</div>
            <div>{p.description}</div>
            <div>${p.rate}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

