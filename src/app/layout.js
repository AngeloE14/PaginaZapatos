import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Calzado del Pueblo - Premium',
  description: 'Estilo urbano para jóvenes con actitud y autenticidad.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppProvider>
          <Navbar />
          <main style={{ flex: '1' }}>
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <AuthModal />
        </AppProvider>
      </body>
    </html>
  );
}
