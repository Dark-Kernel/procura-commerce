"use client";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

type Order = {
  id: number;
  customer: { name: string; phone: string };
  totalAmount: number;
};

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (token) {
      apiFetch("/orders", token).then(setOrders);
    }
  }, [token]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Orders</h1>
      <ul className="mt-4 space-y-2">
        {orders.map(o => (
          <li key={o.id} className="border p-2">
            <div className="font-semibold">Customer: {o.customer.name}</div>
            <div>Phone: {o.customer.phone}</div>
            <div>Total: ${o.totalAmount}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

