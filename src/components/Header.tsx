
'use client';

import { useGlobalContext } from '@/context/GlobalContext';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Header = () => {
  const { cartQuantity, user, logout } = useGlobalContext();

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
       
        <Box display="flex" alignItems="center" gap={4}>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{ 
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
              '&:hover': { color: 'primary.dark' }
            }}
          >
            E-Commerce
          </Typography>

          <Button
            // component={Link}
            // href="/products"
            variant="text"
            sx={{ textTransform: 'none', color: 'text.primary' }}
          >
            Products
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap={3}>
          <IconButton
            component={Link}
            href="/products/cart"
            size="medium"
            sx={{ 
              color: 'text.primary',
              '&:hover': { color: 'primary.main' },
              '&:focus': { outline: 'none' }
            }}
          >
            <Badge 
              badgeContent={cartQuantity} 
              color="secondary"
              sx={{ 
                '& .MuiBadge-badge': { 
                  right: -4, 
                  top: 4,
                  border: `2px solid`,
                  borderColor: 'background.paper'
                } 
              }}
            >
              <ShoppingCartIcon fontSize="medium" />
            </Badge>
          </IconButton>

          {user && (
            <Box display="flex" alignItems="center" gap={1}>
              <AccountCircle fontSize="medium" sx={{ color: 'text.secondary' }} />
              <Typography variant="body1" sx={{ color: 'text.primary' }}>
                {user}
              </Typography>
              <Button 
                onClick={logout} 
                variant="outlined" 
                color="inherit"
                size="small"
                sx={{ 
                  ml: 2,
                  textTransform: 'none',
                  borderColor: 'divider',
                  '&:hover': { borderColor: 'primary.main' }
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;