import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal.js'; // Import explícito para evitar resolver versiones legacy
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Calzado del Pueblo',
  description: 'Llevamos el talento de nuestros artesanos mexicanos al mercado global. Identidad, precio competitivo y reparación para extender la vida de tus zapatos.',
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
