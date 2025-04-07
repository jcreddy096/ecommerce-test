
// import { ICartMap, IUserCartMap } from '@/types/cart';
// import { IProduct } from '@/types/product';


// export const getStorageCart = (): ICartMap => {
//   return JSON.parse(localStorage.getItem('cart') || '{}');
// };

// export const setStorageCart = (cart: ICartMap) => {
//   localStorage.setItem('cart', JSON.stringify(cart));
// };


// export const getUserStorageCart = (email: string): IUserCartMap => {
//   const cart = getStorageCart();
//   return cart[email] ?? {}; 
// };

// export const setUserStorageCart = (email: string, userCart: IUserCartMap) => {
//   const cart = getStorageCart();
//   cart[email] = userCart;
//   setStorageCart(cart); 
// };

// export const getStorageProducts = (): IProduct[] => {
//   if (typeof window === 'undefined') return []; 
//   const data = localStorage.getItem('products');
//   return data ? JSON.parse(data) : [];
// };





// utils/cart.ts

import { ICartMap, IUserCartMap } from '@/types/cart';
import { IProduct } from '@/types/product';

export const getStorageCart = (): ICartMap => {
  if (typeof window === 'undefined') return {};
  return JSON.parse(localStorage.getItem('cart') || '{}');
};

export const setStorageCart = (cart: ICartMap) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('cart', JSON.stringify(cart));
};

export const getUserStorageCart = (email: string): IUserCartMap => {
  const cart = getStorageCart();
  const userCart = cart[email];
  return userCart && typeof userCart === 'object' && !Array.isArray(userCart) ? userCart : {};
};

export const setUserStorageCart = (email: string, userCart: IUserCartMap) => {
  const cart = getStorageCart();
  cart[email] = userCart;
  setStorageCart(cart);
};

export const getStorageProducts = (): IProduct[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('products');
  return data ? JSON.parse(data) : [];
};
