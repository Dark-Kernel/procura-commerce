export interface Product {
  id: number;
  code: string;
  name: string;
  description?: string;
  rate: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  customerDetails: {
    name: string;
    phone: string;
  };
  totalAmount: number;
  createdAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productRate: number;
  quantity: number;
  subtotal: number;
}

export interface CreateOrderDto {
  customerDetails: {
    name: string;
    phone: string;
  };
  products: {
    productId: number;
    quantity: number;
  }[];
}
