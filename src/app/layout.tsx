
// 'use client';

// import './globals.css';
// import { CartProvider } from '../context/GlobalContext'; 
// import Header from '@/components/Header'; 

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <CartProvider>
//           <Header />
//           <main className="container">{children}</main>
//         </CartProvider>
//       </body>
//     </html>
//   );
// }



'use client';

import './globals.css';
import { CartProvider } from '../context/GlobalContext';
import Header from '@/components/Header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <CartProvider>
          <Header />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
