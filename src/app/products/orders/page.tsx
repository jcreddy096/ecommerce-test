"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const OrdersPage = () => {
  const [orders, setOrders] = useState<{
      price: number; title: string; quantity: number; image: string; mrp?: number 
}[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("loggedInUser");
    if (!email) return;

    setUserEmail(email);

  
    const storedOrders = JSON.parse(localStorage.getItem(`cart_${email}`) || "[]");
    setOrders(storedOrders);
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        My Orders
      </Typography>

      {userEmail ? (
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
          Logged in as: <strong>{userEmail}</strong>
        </Typography>
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", mb: 2, color: "red" }}>
          No user logged in
        </Typography>
      )}

      {orders.length > 0 ? (
        <Box sx={{ maxWidth: "60%", mx: "auto" }}>
          {orders.map((order, index) => (
            <Paper key={index} elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Typography variant="h6">{order.title}</Typography>
              <Typography variant="body1">Quantity: {order.quantity}</Typography>
              <Box component="img" src={order.image} alt={order.title} sx={{ width: 100, height: 100, objectFit: "contain", mt: 1 }} />
              {order.price && <Typography variant="body1">MRP: {order.price}</Typography>}
            </Paper>
          ))}
        </Box>
      ) : (
        <Typography variant="h6" sx={{ textAlign: "center", mt: 3 }}>
          No orders found.
        </Typography>
      )}
    </Container>
  );
};

export default OrdersPage;
