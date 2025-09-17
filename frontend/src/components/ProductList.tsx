import { apiFetch } from '../lib/api';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  token: string;
  onUpdate: () => void;
  onEdit: (product: Product) => void; // Add onEdit prop
}

export default function ProductList({ products, token, onUpdate, onEdit }: ProductListProps) {
  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/products/${id}`,token,
        {
          method: 'DELETE',
        });
      onUpdate();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <ul className="space-y-4">
      {products.map(product => (
        <li key={product.id} className="border p-4 rounded-lg flex justify-between items-center">
          <div>
            <p className="font-bold">{product.name}</p>
            <p>{product.description}</p>
            <p className="text-sm text-gray-600">Code: {product.code}</p>
            <p className="font-semibold">${product.rate}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(product)} // Call onEdit with the product
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

