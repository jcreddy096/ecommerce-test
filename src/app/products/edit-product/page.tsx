


"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { EditForm } from "../../../types/edirform"; 
const EditProductPage = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EditForm>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [originalPrice, setOriginalPrice] = useState<number | null>(null);

  useEffect(() => {
    if (productId) {
      const storedProducts = JSON.parse(localStorage.getItem("customProducts") || "[]") as EditForm[];
      const product = storedProducts.find((p) => p.id === productId);

      if (product) {
        setValue("title", product.title);
        setValue("image", product.image);
        setValue("price", product.price);
        setValue("stock", product.stock); 
        setOriginalPrice(product.price);
      }
    }
  }, [productId, setValue]);

  const handleUpdateProduct = (data: EditForm) => {
    if (!productId) return;

    const storedProducts = JSON.parse(localStorage.getItem("customProducts") || "[]") as EditForm[];
    const updatedProducts = storedProducts.map((p) => (p.id === productId ? { ...p, ...data } : p));

    localStorage.setItem("customProducts", JSON.stringify(updatedProducts));

   
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]") as EditForm[];
    const updatedCart = cartItems.map((item) => 
      item.id === productId ? { ...item, price: data.price } : item
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    
    if (originalPrice !== null && originalPrice !== data.price) {
      localStorage.setItem("priceUpdated", JSON.stringify({ id: productId, newPrice: data.price }));
    }

    router.push("/products");
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        Edit Product
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <form onSubmit={handleSubmit(handleUpdateProduct)}>
          <TextField
            fullWidth
            label="Product Title"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Image URL"
            {...register("image", { required: "Image URL is required" })}
            error={!!errors.image}
            helperText={errors.image?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Price"
            {...register("price", { required: "Price is required", min: { value: 1, message: "Price must be at least 1" } })}
            error={!!errors.price}
            helperText={errors.price?.message}
            sx={{ mb: 2 }}
          />
          
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update Product
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default EditProductPage;
