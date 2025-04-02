"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Pagination,
  Box,
  Toolbar,
  IconButton,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Product } from "../../types/products";

const PRODUCTS_API = "https://fakestoreapi.com/products";
const ITEMS_PER_PAGE = 4;

type CartItem = Product & { quantity: number };

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stock, setStock] = useState<Record<number, number>>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
      router.push("/login");
      return;
    }
    setUser(loggedInUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    axios.get(PRODUCTS_API).then((res) => {
      const apiProducts: Product[] = res.data.map((p: Product) => ({
        ...p,
        price: Number(p.price) || 0,
      }));

      const storedProducts: Product[] = JSON.parse(localStorage.getItem("customProducts") || "[]").map((p: Product) => ({
        ...p,
        price: Number(p.price) || 0,
        isCustom: true,
      }));

      const mergedProducts: Product[] = [
        ...apiProducts,
        ...storedProducts.filter((p: Product) => !apiProducts.some((apiP: Product) => apiP.id === p.id)),
      ];

      setProducts(mergedProducts);

      const storedStock = JSON.parse(localStorage.getItem(`stock_${user}`) || "{}");
      const initialStock = mergedProducts.reduce((acc, p) => {
        acc[p.id] = storedStock[p.id] !== undefined ? storedStock[p.id] : p.isCustom ? p.stock || 10 : 10;
        return acc;
      }, {} as Record<number, number>);

      setStock(initialStock);
      localStorage.setItem(`stock_${user}`, JSON.stringify(initialStock));
    });

    const storedCart = JSON.parse(localStorage.getItem(`cart_${user}`) || "[]") as CartItem[];
    setCart(storedCart);
  }, [user]);

  useEffect(() => {
    if (user && Object.keys(stock).length > 0) {
      localStorage.setItem(`stock_${user}`, JSON.stringify(stock));
    }
  }, [stock, user]);

  useEffect(() => {
    if (user && cart.length > 0) {
      localStorage.setItem(`cart_${user}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const handleAddToCart = (product: Product) => {
    if (stock[product.id] <= 0) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      const updatedCart = existingItem
        ? prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        : [...prevCart, { ...product, quantity: 1 }];

      return updatedCart;
    });

    setStock((prevStock) => ({
      ...prevStock,
      [product.id]: prevStock[product.id] - 1,
    }));
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0);
      return updatedCart;
    });

    setStock((prevStock) => ({
      ...prevStock,
      [productId]: prevStock[productId] + 1,
    }));
  };

  const getProductQuantity = (productId: number) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    router.push(`/products?page=${page}`);
  };

  return (
    <Box>
      <Box sx={{ width: "100vw", bgcolor: "white", borderBottom: "1px solid #ddd" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              Products
            </Typography>

            <Box display="flex" gap={2}>
              <Button component={Link} href="/products/add-product" variant="contained" color="primary">
                Add Product
              </Button>

              <Button
                component={Link}
                href="/products/cart"
                variant="contained"
                color="secondary"
                startIcon={<ShoppingCartIcon />}
              >
                Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
              </Button>

              <Button
  onClick={() => {
    localStorage.removeItem("loggedInUser");
    router.push("/login");
  }}
>
  Logout
</Button>

            </Box>
          </Toolbar>
        </Container>
      </Box>

      <Container sx={{ mt: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 3, justifyContent: "center" }}>
          {products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((product) => (
            <Card key={product.id} sx={{ p: 2, borderRadius: 10 }}>
              <CardMedia component="img" image={product.image} alt={product.title} sx={{ height: 200, objectFit: "contain" }} />
              <CardContent>
                <Typography variant="h6" textAlign="center">
                  {product.title}
                </Typography>
                <Typography variant="body1" textAlign="center">
                  MRP: ${Number(product.price).toFixed(2)}
                </Typography>

                {product.isCustom && (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 1 }}
                    component={Link}
                    href={`/products/edit-product?id=${product.id}`}
                  >
                    Edit
                  </Button>
                )}

                {getProductQuantity(product.id) === 0 ? (
                  <Button fullWidth variant="contained" color="primary" onClick={() => handleAddToCart(product)} sx={{ mt: 1 }}>
                    Add to Cart
                  </Button>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
                    <IconButton onClick={() => handleRemoveFromCart(product.id)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>{getProductQuantity(product.id)}</Typography>
                    <IconButton onClick={() => handleAddToCart(product)} disabled={stock[product.id] <= 0}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>

        <Pagination count={Math.ceil(products.length / ITEMS_PER_PAGE)} page={currentPage} onChange={handlePageChange} sx={{ mt: 3 }} />
      </Container>
    </Box>
  );
};

export default ProductsPage;
