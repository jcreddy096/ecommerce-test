"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Form } from "../../../types/form";

const AddProduct = () => {
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<Form>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  useEffect(() => {
    if (editId) {
      try {
        const storedProducts: Form[] = JSON.parse(localStorage.getItem("customProducts") || "[]");
        const product = storedProducts.find((p) => String(p.id) === editId);
        
        if (product) {
          setValue("title", product.title);
          setValue("image", product.image);
          setValue("price", product.price);
          setValue("Stock", product.Stock);
        }
      } catch (error) {
        console.error("Error loading product from localStorage:", error);
      }
    }
  }, [editId, setValue]);

  const handleProductSubmit = (data: Form) => {
    try {
      const storedProducts: Form[] = JSON.parse(localStorage.getItem("customProducts") || "[]");

      if (editId) {
      
        const updatedProducts = storedProducts.map((p) =>
          String(p.id) === editId ? { ...p, ...data, Stock: Number(data.Stock) } : p
        );
        localStorage.setItem("customProducts", JSON.stringify(updatedProducts));
      } else {
       
        const newProduct = { ...data, id: uuidv4(), Stock: Number(data.Stock) };
        localStorage.setItem("customProducts", JSON.stringify([...storedProducts, newProduct]));
      }

      reset();
      router.push("/products");
    } catch (error) {
      console.error("Error saving product to localStorage:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}>
        {editId ? "Edit Product" : "Add Product"}
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <form onSubmit={handleSubmit(handleProductSubmit)}>
          <TextField
            fullWidth label="Product Title"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title} helperText={errors.title?.message} sx={{ mb: 2 }}
          />

          <TextField
            fullWidth label="Image URL"
            {...register("image", { required: "Image URL is required" })}
            error={!!errors.image} helperText={errors.image?.message} sx={{ mb: 2 }}
          />

          <TextField
            fullWidth type="number" label="Price"
            {...register("price", { required: "Price is required", min: { value: 1, message: "Price must be at least 1" } })}
            error={!!errors.price} helperText={errors.price?.message} sx={{ mb: 2 }}
          />

          <TextField
            fullWidth type="number" label="Stock"
            {...register("Stock", { required: "Stock is required", min: { value: 1, message: "Stock must be at least 1" } })}
            error={!!errors.Stock} helperText={errors.Stock?.message} sx={{ mb: 2 }}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth>
            {editId ? "Update Product" : "Add Product"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddProduct;
