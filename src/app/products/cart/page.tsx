
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  IconButton,
  Box,
  Paper,
  Alert,
  AlertTitle,
  Button,
  Stack,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { CartItem } from "../../../types/cart";

const PRODUCTS_API = "https://fakestoreapi.com/products";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [stockData, setStockData] = useState<{ [key: string]: number }>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [productUpdateInfo, setProductUpdateInfo] = useState<{ title: string; newPrice: number } | null>(null);
  const [showProductAlert, setShowProductAlert] = useState<boolean>(false);
  const router = useRouter();

  const getLoggedInUser = () => localStorage.getItem("loggedInUser");

  const updateCartAndStock = (newCart: CartItem[], newStock: { [key: string]: number }) => {
    const email = getLoggedInUser();
    if (!email) return;

    setCartItems([...newCart]);
    setStockData({ ...newStock });

    localStorage.setItem(`cart_${email}`, JSON.stringify(newCart));
    localStorage.setItem(`stock_${email}`, JSON.stringify(newStock));

    calculateTotalPrice(newCart);
  };

  const calculateTotalPrice = (cart: CartItem[]) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const handleIncrease = (productId: string) => {
    if (stockData[productId] <= 0) return;

    const updatedCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );

    const updatedStock = { ...stockData, [productId]: stockData[productId] - 1 };

    updateCartAndStock(updatedCart, updatedStock);
  };

  const handleDecrease = (productId: string) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    const updatedStock = { ...stockData, [productId]: stockData[productId] + 1 };

    updateCartAndStock(updatedCart, updatedStock);
  };

  useEffect(() => {
    const email = getLoggedInUser();
    if (!email) {
      router.push("/login");
      return;
    }

    const fetchAndUpdateCart = async () => {
      try {
        const res = await fetch(PRODUCTS_API);
        if (!res.ok) throw new Error("Failed to fetch products");

        const apiProducts: CartItem[] = await res.json();
        const storedCustomProducts: CartItem[] = JSON.parse(localStorage.getItem("customProducts") || "[]");

        const mergedProducts = [
          ...apiProducts,
          ...storedCustomProducts.filter((p) => !apiProducts.some((apiP) => apiP.id === p.id)),
        ];

        const storedCart: CartItem[] = JSON.parse(localStorage.getItem(`cart_${email}`) || "[]");

        let updatedInfo: { title: string; newPrice: number } | null = null;
        const updatedCart = storedCart.map((cartItem) => {
          const updatedProduct = mergedProducts.find((p) => p.id === cartItem.id);
          const newPrice = updatedProduct ? Number(updatedProduct.price) : Number(cartItem.price);
          const oldPrice = Number(cartItem.price);
          const newTitle = updatedProduct?.title || cartItem.title;
          const oldTitle = cartItem.title;

          if (updatedProduct && (newPrice !== oldPrice || newTitle !== oldTitle)) {
            updatedInfo = { title: newTitle, newPrice };
            return { ...cartItem, price: newPrice, title: newTitle };
          }
          return { ...cartItem, price: oldPrice, title: oldTitle };
        });

        setCartItems(updatedCart);
        localStorage.setItem(`cart_${email}`, JSON.stringify(updatedCart));

        const previousCart = JSON.parse(localStorage.getItem(`previousCart_${email}`) || "[]");
        localStorage.setItem(`previousCart_${email}`, JSON.stringify(updatedCart));

        if (updatedInfo) {
          setProductUpdateInfo(updatedInfo);
          setShowProductAlert(true);
          setTimeout(() => {
            setShowProductAlert(false);
          }, 15000);
        }

        const storedStock = JSON.parse(localStorage.getItem(`stock_${email}`) || "{}");
        setStockData(storedStock);

        calculateTotalPrice(updatedCart);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchAndUpdateCart();
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Your Cart
      </Typography>

      {showProductAlert && productUpdateInfo && (
        <Box sx={{ maxWidth: "60%", mx: "auto", mb: 2 }}>
          <Alert
            severity="warning"
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setShowProductAlert(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <AlertTitle>Product Updated</AlertTitle>
            The product <strong>{productUpdateInfo.title}</strong> has been updated! New MRP: <strong>${productUpdateInfo.newPrice.toFixed(2)}</strong>.
          </Alert>
        </Box>
      )}

      {cartItems.length > 0 ? (
        <Box>
          {cartItems.map((product) => {
            const stock = stockData[product.id];
            return (
              <Box key={product.id} sx={{ maxWidth: "60%", mx: "auto", mb: 2 }}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Box component="img" src={product.image} alt={product.title} sx={{ width: 80, height: 80, objectFit: "contain", mr: 2 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{product.title}</Typography>
                    <Typography variant="body1" color="text.secondary">
                      MRP: ${Number(product.price).toFixed(2)}
                    </Typography>
                  </Box>

                  <Stack direction="row" alignItems="center">
                    <IconButton color="primary" onClick={() => handleDecrease(product.id)}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2, fontWeight: "bold" }}>{product.quantity}</Typography>
                    <IconButton color="primary" onClick={() => handleIncrease(product.id)} disabled={stock === 0}>
                      <AddIcon />
                    </IconButton>
                  </Stack>
                </Paper>
              </Box>
            );
          })}

          <Typography variant="h6" sx={{ mt: 2, textAlign: "center" }}>
            <strong>Total Price: ${totalPrice.toFixed(2)}</strong>
          </Typography>

          <Button variant="contained" color="primary" sx={{ mt: 2, display: "block", mx: "auto" }} onClick={() => router.push("/products/orders")}>
            placed Orders
          </Button>
        </Box>
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>
          Your cart is empty.
        </Typography>
      )}
    </Container>
  );
};

export default CartPage;
