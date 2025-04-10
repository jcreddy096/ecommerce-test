import './globals.css';
import { AuthProvider } from '@/app/context/AuthContext';
import Header from '@/app/components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          
          <Header/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
