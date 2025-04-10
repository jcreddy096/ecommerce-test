import { Product } from '@/app/types/product';

export const fetchAllProducts = async (): Promise<Product[]> => {
  const res = await fetch('https://fakestoreapi.com/products');
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
};

export const fetchProductById = async (productId: number): Promise<Product> => {
  const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
  if (!res.ok) {
    throw new Error("products not found");
  }
  return res.json();
};
