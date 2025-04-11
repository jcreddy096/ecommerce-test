// import { fetchProductById } from '@/app/utils/productApi';
// import ProductCard from '@/app/components/ProductCard';
// import { Box } from '@mui/material';
// import AuthGuard from '@/app/auth/AuthGuard';
// import { JSX } from 'react';

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

// export default async function ProductDetailPage({ params }: PageProps): Promise<JSX.Element> {
//   // Solution 1: Type assertion to satisfy Next.js static analysis
//   const id = Number(params.id as string);

//   // Alternative Solution 2: Promise resolution pattern
//   // const id = Number((await Promise.resolve(params)).id);

//   const product = await fetchProductById(id);

//   return (
//     <AuthGuard>
//       <Box 
//         display="flex" 
//         justifyContent="center" 
//         alignItems="center" 
//         minHeight="80vh"
//       >
//         {/* Ensure userId prop is properly typed if needed */}
//         <ProductCard 
//           product={product} 
//           showActions 
//           fullWidth 
//           userId={0} 
//         />
//       </Box>
//     </AuthGuard>
//   );
// }