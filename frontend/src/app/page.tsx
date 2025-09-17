// "use client";
// import { useState, useEffect, useCallback } from 'react';
// import { Product, Order } from '../types';
// import ProductList from '../components/ProductList';
// import ProductForm from '../components/ProductForm';
// import OrderForm from '../components/OrderForm';
// import { useAuth } from '../context/AuthContext';
// import { apiFetch } from '../lib/api';

"use client";
import { useState, useEffect, useCallback } from 'react';
import { Product, Order } from '../types';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import OrderForm from '../components/OrderForm';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const { token, login } = useAuth();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchData = useCallback(async () => {
    if (token) {
      try {
        const productsData = await apiFetch('/products', token);
        setProducts(productsData);

        const ordersData = await apiFetch('/orders', token);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }, [token]);

  useEffect(() => {
    const autoLogin = async () => {
      if (!token) {
        try {
          const data = await apiFetch("/auth/login", undefined, {
            method: "POST",
            body: JSON.stringify({ username: 'user', password: 'password' }),
          });
          if (data?.access_token) {
            login(data.access_token);
          }
        } catch (error) {
          console.error('Error logging in:', error);
        }
      }
    };
    autoLogin();
  }, [token, login]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCloseForm = () => {
    setEditingProduct(null);
    fetchData();
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (token && confirm('Are you sure you want to delete this order?')) {
      try {
        await apiFetch(`/orders/${orderId}`, token, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order.');
      }
    }
  };

  if (!token) {
    return <div className="p-8">Logging in and loading data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">E-Commerce Admin</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">{editingProduct ? 'Edit Product' : 'Create Product'}</h2>
          <ProductForm product={editingProduct} token={token} onClose={handleCloseForm} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Products</h2>
          <ProductList products={products} token={token} onUpdate={fetchData} onEdit={handleEditProduct} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Create Order</h2>
          <OrderForm products={products} token={token} onOrderCreated={fetchData} />

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
            {orders.map(order => (
              <div key={order.id} className="border p-4 mb-4 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <p><strong>Order #{order.id}</strong></p>
                    <p>Customer: {order.customer.name}</p>
                    <p>Phone: {order.customer.phone}</p>
                    <p>Total: ${order.totalAmount}</p>
                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function Home() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const { token, login } = useAuth();

//   // Fetches all necessary data from the backend
//   const fetchData = useCallback(async () => {
//     if (token) {
//       try {
//         const productsData = await apiFetch('/products', token);
//         setProducts(productsData);

//         const ordersData = await apiFetch('/orders', token);
//         setOrders(ordersData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     }
//   }, [token]);

//   // Automatically log in to get a token
//   useEffect(() => {
//     const autoLogin = async () => {
//       if (!token) {
//         try {
//           const data = await apiFetch("/auth/login", undefined, {
//             method: "POST",
//             body: JSON.stringify({ username: 'user', password: 'password' }),
//           });
//           if (data?.access_token) {
//             login(data.access_token);
//           }
//         } catch (error) {
//           console.error('Error logging in:', error);
//         }
//       }
//     };
//     autoLogin();
//   }, [token, login]);

//   // Fetch data whenever the token changes (i.e., after login)
//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   if (!token) {
//     return <div className="p-8">Logging in and loading data...</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8">E-Commerce Admin</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Create Product</h2>
//           <ProductForm product={null} token={token} onClose={fetchData} />
//         </div>

//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Products</h2>
//           <ProductList products={products} token={token} onUpdate={fetchData} onEdit={function(product: Product): void {
//                       throw new Error('Function not implemented.');
//                   } } />
//         </div>

//         <div>
//           <h2 className="text-2xl font-semibold mb-4">Create Order</h2>
//           <OrderForm products={products} token={token} onOrderCreated={fetchData} />
//         </div>
//       </div>
//     </div>
//   );
// }

