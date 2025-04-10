import { Cart } from '@/app/types/cart';

export const fetchCartsByCartId = async (userId: number): Promise<Cart[]> => {
  try {
    
    const response = await fetch('https://fakestoreapi.com/carts');
    const data: Cart[] = await response.json();

    const filtered = data.filter((cart) => cart.id === userId); 
    return filtered;
  } 
  catch (error) {
    console.error('Failed to fetch carts:', error);
    return [];
  }
};
