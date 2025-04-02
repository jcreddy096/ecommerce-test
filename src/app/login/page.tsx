
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { setLoggedInUser } = useAuth(); 

  const handleLogin = () => {
    if (!email) {
      window.alert("Please enter your email.");
      return;
    }

    localStorage.setItem("loggedInUser", email); 
    setLoggedInUser(email); 

    router.push("/products");
  };

  return (
    <Container sx={{ mt: 5, textAlign: "center" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Login
      </Typography>

      <Box sx={{ maxWidth: 400, mx: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        />

        <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
