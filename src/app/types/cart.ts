
export type Cart = {
    id: number;
    userId: number;
    date: string;
    products: {
      productId: number;
      quantity: number;
    }[];
  };
  