

'use client';
import { useGlobalContext } from '@/context/GlobalContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const { login, user } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert('Please enter an email');
    login(email);
    router.push('/products');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        p: 3
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 400
        }}
      >
        <Typography variant="h4" component="h1" textAlign="center">
          Login
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;