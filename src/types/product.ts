export type IProduct = {
    id: number;
    image: string;
    title: string;
    stock: number;
    price: number;
  };
  
  export type ICartProduct = {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  };
  