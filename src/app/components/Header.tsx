'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const Header = () => {
  const router = useRouter();
  const { logout } = useAuth();


  const handleProduct = () => {
    router.push('/products');
  };


  const handleCart = () => {
    router.push('/products/cart');
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AppBar position="static" color="primary" sx={{ mb: 3 }}>
      <Toolbar sx = {{justifyContent: "space-between"}}>
        <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="h5" color='yellow' >
           MyStore
        </Typography>
        <Button color="inherit" onClick={handleProduct} > 
            Products
          </Button>
        </Box>
        

        <Box display="flex" gap={2}>
        
          <Button color="inherit" onClick={handleCart}>
            Cart
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
