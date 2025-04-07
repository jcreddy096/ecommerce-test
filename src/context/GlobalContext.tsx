

'use client';
import { ICartMap, IUserCartMap } from '@/types/cart';
import {
  getStorageCart,
  getUserStorageCart,
  setStorageCart,
} from '@/utils/cart';
import { redirect } from 'next/navigation';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

type IGlobalContext = {
  cartMap: ICartMap;
  handleCartMap: (userCartMap: IUserCartMap) => void;
  cartQuantity: number;
  clearCart: () => void;
  user: string;
  login: (email: string) => void;
  logout: () => void;
}

export const GlobalContext = createContext<IGlobalContext>({} as IGlobalContext);

export const useGlobalContext = () => useContext(GlobalContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartMap, setCartMap] = useState<ICartMap>({});
  const [user, setUser] = useState<string>('');

  const cartQuantity = useMemo(() => {
    if (!user) return 0;
    const userCart = cartMap[user] || {};
    return Object.values(userCart).reduce((acc, product) => acc + product.quantity, 0);
  }, [cartMap, user]);

  const handleCartMap = useCallback((userCartMap: IUserCartMap) => {
    if (!user) return;
    
    const newCartMap = {
      ...cartMap,
      [user]: userCartMap,
    };
    
    setCartMap(newCartMap);
    setStorageCart(newCartMap);
  }, [user, cartMap]);

  const clearCart = useCallback(() => {
    if (!user) return;
    
    const newCartMap = { ...cartMap };
    delete newCartMap[user];
    
    setCartMap(newCartMap);
    setStorageCart(newCartMap);
  }, [user, cartMap]);

  const login = useCallback((email: string) => {
    localStorage.setItem('loggedInUser', email);
    setUser(email);
    
    // Load user's existing cart
    const userCart = getUserStorageCart(email);
    setCartMap(prev => ({
      ...prev,
      [email]: userCart
    }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('loggedInUser');
    setUser('');
    redirect('/login');
  }, []);

  useEffect(() => {
    const initializeCart = () => {
      const storedCart = getStorageCart();
      const loggedInUser = localStorage.getItem('loggedInUser');
      
      if (loggedInUser) {
        setUser(loggedInUser);
        const userCart = getUserStorageCart(loggedInUser);
        setCartMap(prev => ({
          ...prev,
          [loggedInUser]: userCart
        }));
      } else {
        setCartMap(storedCart);
      }
    };

    initializeCart();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        cartMap,
        handleCartMap,
        cartQuantity,
        clearCart,
        user,
        login,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};