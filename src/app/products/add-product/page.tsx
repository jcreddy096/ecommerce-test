

"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Box, TextField, Button, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { IProduct } from "../../../types/product";

const AddProductPage = () => {
  const { control, handleSubmit, reset } = useForm<Omit<IProduct, "id">>({
    defaultValues: { title: "", image: "", price: 0, stock: 0 },
  });

  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const addProduct = (data: Omit<IProduct, "id">) => {
    const newProduct: IProduct = {
      id: uuidv4(),
      ...data,
    };

    const products = JSON.parse(localStorage.getItem("products") || "[]");
    localStorage.setItem("products", JSON.stringify([...products, newProduct]));

    reset();
    setSuccess(true);

    setTimeout(() => {
      router.push("/products");
    }, 1000);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Add Product
      </Typography>

      {success && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          Product added successfully!
        </Typography>
      )}

      <form onSubmit={handleSubmit(addProduct)}>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Title"
              fullWidth
              sx={{ mb: 2 }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="image"
          control={control}
          rules={{ required: "Image URL is required" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Image URL"
              fullWidth
              sx={{ mb: 2 }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="price"
          control={control}
          rules={{
            required: "Price is required",
            min: { value: 0, message: "Price must be positive" },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="number"
              label="Price"
              fullWidth
              sx={{ mb: 2 }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="stock"
          control={control}
          rules={{
            required: "Stock is required",
            min: { value: 0, message: "Stock must be positive" },
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="number"
              label="Stock"
              fullWidth
              sx={{ mb: 2 }}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={success}
        >
          {success ? "Adding..." : "Add Product"}
        </Button>
      </form>
    </Box>
  );
}
export default AddProductPage;