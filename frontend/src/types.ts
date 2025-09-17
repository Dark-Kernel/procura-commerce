export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  rate: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
  };
  products: {
    productCode: string;
    quantity: number;
  }[];
  totalAmount: string;
  createdAt: Date;
}
