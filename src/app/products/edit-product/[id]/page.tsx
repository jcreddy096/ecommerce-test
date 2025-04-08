
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Box, TextField, Button, Typography } from "@mui/material";
import { IProduct } from "../../../../types/product";

const EditProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    if (!productId) return;

    const storedProducts: IProduct[] = JSON.parse(localStorage.getItem("products") || "[]");
    const foundProduct = storedProducts.find((p) => String(p.id) === productId);

    setProduct(foundProduct || null);
  }, [productId]);

  const updateProduct = (key: keyof IProduct, value: string | number) => {
    if (!product) return;

    const updatedProduct = { ...product, [key]: value };
    setProduct(updatedProduct);
    updateLocalStorage(updatedProduct);
  };

  const updateLocalStorage = (updatedProduct: IProduct) => {
    const storedProducts: IProduct[] = JSON.parse(localStorage.getItem("products") || "[]");
    const updatedProducts = storedProducts.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    const users = Object.keys(localStorage).filter((key) => key.startsWith("cart_"));
    users.forEach((userCartKey) => {
      const storedCart: IProduct[] = JSON.parse(localStorage.getItem(userCartKey) || "[]");
      const updatedCart = storedCart.map((item) =>
        item.id === updatedProduct.id ? { ...item, price: updatedProduct.price } : item
      );
      localStorage.setItem(userCartKey, JSON.stringify(updatedCart));
    });
  };

  if (!product) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          Product not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <TextField
        label="Title"
        fullWidth
        value={product.title}
        onChange={(e) => updateProduct("title", e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Image URL"
        fullWidth
        value={product.image}
        onChange={(e) => updateProduct("image", e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Price"
        fullWidth
        type="number"
        value={product.price}
        onChange={(e) => updateProduct("price", Number(e.target.value))}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={() => router.push("/products")}>
        Update
      </Button>
    </Box>
  );
};

export default EditProductPage;
