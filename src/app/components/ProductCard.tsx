'use client';

import { Product } from '@/app/types/product';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  //Button,
  Box,
  Rating,
} from '@mui/material';
//import { useRouter } from 'next/navigation';


type Props = {
  product: Product;
  showActions?: boolean;
  fullWidth?: boolean;
  userId: number;
};

const ProductCard = ({ product, showActions = true, fullWidth = false}: Props) => {
    //const router = useRouter();

    // const handleView = () => {
    //     router.push(`/products/${product.id}`);
    // };


  return (
    <Card sx={{ width: fullWidth ? 600 :400, borderRadius: 4, boxShadow: 4, p: 1 }}>
      <CardMedia
        component="img"
        height="180"
        image={product.image}
        alt={product.title}
        sx={{ objectFit: 'contain', mb: 1 }}
      />

      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} noWrap gutterBottom>
          {product.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap>
          {product.description}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
          Category: {product.category}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="h6" color="primary">
            ₹{product.price}
          </Typography>

          <Box display="flex" alignItems="center">
            <Rating value={product.rating?.rate} precision={0.1} readOnly size="small" />
            <Typography variant="body2" ml={0.5}>
              ({product.rating?.count})
            </Typography>
          </Box>
        </Box>
      </CardContent>

     {showActions && (
      <CardActions sx={{ justifyContent: 'space-between', mt: -1 }}>
     
     {/* {! fullWidth && (
        <Button size="small" variant="outlined" onClick = {handleView}>
            View
            </Button>
     )} */}


      </CardActions>
      )}
    </Card>
  );
};

export default ProductCard;
