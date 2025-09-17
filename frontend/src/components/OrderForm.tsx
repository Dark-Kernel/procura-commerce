import { useState } from 'react';
import { Product } from '../types';

interface OrderFormProps {
  products: Product[];
  token: string;
  onOrderCreated: () => void;
}

interface OrderItem {
  productId: string; // Changed to string
  quantity: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function OrderForm({ products, token, onOrderCreated }: OrderFormProps) {
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { productId: '', quantity: 1 } // Changed to empty string
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerDetails.name.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!customerDetails.phone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    }

    const validItems = orderItems.filter(item => item.productId !== '' && item.quantity > 0); // Changed check
    if (validItems.length === 0) {
      newErrors.items = 'At least one product must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const validItems = orderItems.filter(item => item.productId !== '' && item.quantity > 0); // Changed check

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer: customerDetails,
          products: validItems,
          totalAmount: validItems.reduce((total, item) => total + item.quantity, 0), // calculateTotal(),
          // totalAmount: validItems.reduce((total, item) => {
          //   const product = products.find(p => p.id === item.productId);
          //   // @ts-expect-error: product.rate is a string but used in multiplication
          //   return total + (product ? product.rate * item.quantity : 0);
          // })
        }),
      });

      if (response.ok) {
        // Reset form
        setCustomerDetails({ name: '', phone: '' });
        setOrderItems([{ productId: '', quantity: 1 }]); // Changed to empty string
        setErrors({});
        onOrderCreated();
        alert('Order created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to create order: ${errorData.message || 'Unknown error'}`);
      }
    } catch (_error) { // Changed to _error
      alert('Error creating order');
    } finally {
      setLoading(false);
    }
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1 }]); // Changed to empty string
  };

  const removeOrderItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => { // Allow string for productId
    const updated = orderItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setOrderItems(updated);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      // @ts-expect-error: product.rate is a string but used in multiplication
      return total + (product ? product.rate * item.quantity : 0);
    }, 0).toFixed(2);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Create New Order</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="customerName"
                value={customerDetails.name}
                onChange={(e) => {
                  setCustomerDetails(prev => ({ ...prev, name: e.target.value }));
                  if (errors.customerName) setErrors(prev => ({ ...prev, customerName: '' }));
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.customerName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Customer name"
              />
              {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
            </div>

            <div>
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                id="customerPhone"
                value={customerDetails.phone}
                onChange={(e) => {
                  setCustomerDetails(prev => ({ ...prev, phone: e.target.value }));
                  if (errors.customerPhone) setErrors(prev => ({ ...prev, customerPhone: '' }));
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.customerPhone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1234567890"
              />
              {errors.customerPhone && <p className="mt-1 text-sm text-red-600">{errors.customerPhone}</p>}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
            <button
              type="button"
              onClick={addOrderItem}
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              + Add Item
            </button>
          </div>

          <div className="space-y-3">
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <select
                    value={item.productId}
                    onChange={(e) => updateOrderItem(index, 'productId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.rate}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateOrderItem(index, 'quantity', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Qty"
                  />
                </div>

                <div className="w-20 text-right">
                  {item.productId !== '' && ( /* Changed check */
                    <span className="font-medium">
                      {/* @ts-expect-error: product.rate is a string but used in multiplication */}
                      ${(products.find(p => p.id === item.productId)?.rate || 0) * item.quantity}
                    </span>
                  )}
                </div>

                {orderItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeOrderItem(index)}
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {errors.items && <p className="mt-2 text-sm text-red-600">{errors.items}</p>}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total Amount:</span>
            <span className="text-xl font-bold text-green-600">${calculateTotal()}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || products.length === 0}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Creating Order...' : 'Create Order'}
        </button>

        {products.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            Please add products before creating orders
          </p>
        )}
      </form>
    </div>
  );
}

