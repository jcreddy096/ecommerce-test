
import { ICartMap, IUserCartMap } from '@/types/cart';
import { ICartProduct } from '@/types/product';

export const serializeCartMap = (cartMap: ICartMap): string => {
  const obj: Record<string, Record<string, ICartProduct>> = {};
  for (const [userEmail, userCart] of cartMap.entries()) {
    const userCartObj: Record<string, ICartProduct> = {};
    for (const [productId, cartItem] of userCart.entries()) {
      userCartObj[productId] = cartItem;
    }
    obj[userEmail] = userCartObj;
  }
  return JSON.stringify(obj);
};

export const deserializeCartMap = (json: string | null): ICartMap => {
  const map: ICartMap = new Map();
  if (!json) return map;

  try {
    const obj = JSON.parse(json) as Record<string, Record<string, ICartProduct>>;
    for (const userEmail in obj) {
      const userCartMap: IUserCartMap = new Map();
      for (const productId in obj[userEmail]) {
        userCartMap.set(productId, obj[userEmail][productId]);
      }
      map.set(userEmail, userCartMap);
    }
  } catch (err) {
    console.error('Failed to parse cart data', err);
  }

  return map;
};

export const getStorageCart = (): ICartMap => {
  if (typeof window === 'undefined') return new Map();
  const json = localStorage.getItem('cart');
  return deserializeCartMap(json);
};

export const setStorageCart = (cartMap: ICartMap): void => {
  if (typeof window === 'undefined') return;
  const serialized = serializeCartMap(cartMap);
  localStorage.setItem('cart', serialized);
};

export const getUserStorageCart = (email: string): IUserCartMap => {
  const cartMap = getStorageCart();
  return cartMap.get(email) || new Map();
};

export const setUserStorageCart = (email: string, userCart: IUserCartMap): void => {
  const cartMap = getStorageCart();
  cartMap.set(email, userCart);
  setStorageCart(cartMap);
};

import { IProduct } from '@/types/product';

export const getStorageProducts = (): IProduct[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('products');
  return data ? JSON.parse(data) : [];
};



