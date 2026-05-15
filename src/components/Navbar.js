'use client';

import { useAppContext } from '@/context/AppContext';
import { ShoppingCart, User, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import icono from '@/icono.png';

export default function Navbar() {
  const { cart, setIsCartOpen, user, logout, setIsAuthModalOpen } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isHomePage = pathname === '/';
  // If on homepage, text is always white. Otherwise, it depends on theme.
  const textColor = isHomePage ? 'white' : 'var(--foreground)';
  
  // Background logic: If homepage, scrolled bg is dark glass. Otherwise, it's the normal surface.
  const bgStyle = scrolled 
    ? (isHomePage ? 'rgba(0, 0, 0, 0.85)' : 'var(--surface)') 
    : 'transparent';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`transition-all duration-300 ${scrolled ? 'shadow-md' : 'bg-transparent'}`} 
      style={{ 
        position: isHomePage ? 'fixed' : 'sticky', 
        top: 0, left: 0, right: 0, zIndex: 50,
        padding: scrolled ? '12px 0' : '20px 0', 
        borderBottom: scrolled ? (isHomePage ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--surface-border)') : 'none', 
        backgroundColor: bgStyle, 
        backdropFilter: scrolled ? 'blur(20px)' : 'none', 
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        color: textColor 
      }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <Link href="/" className="logo text-glow" style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px', color: textColor }}>
          Calzado del <span className="text-gradient">Pueblo</span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: '40px' }} className="hidden-mobile">
          <Link href="/" style={{ fontWeight: 600, color: pathname === '/' ? 'var(--primary)' : textColor, transition: 'color 0.2s', position: 'relative' }} className="nav-link">Inicio</Link>
          <Link href="/productos" style={{ fontWeight: 600, color: pathname === '/productos' ? 'var(--primary)' : textColor, transition: 'color 0.2s' }} className="nav-link">Productos</Link>
          <Link href="/reparaciones" style={{ fontWeight: 600, color: pathname === '/reparaciones' ? 'var(--primary)' : textColor, transition: 'color 0.2s' }} className="nav-link">Reparaciones</Link>
          <Link href="/nosotros" style={{ fontWeight: 600, color: pathname === '/nosotros' ? 'var(--primary)' : textColor, transition: 'color 0.2s' }} className="nav-link">Nosotros</Link>
        </nav>

        {/* Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a
            href="https://github.com/AngeloE14/PaginaZapatos"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver repositorio del proyecto"
            aria-label="Abrir repositorio del proyecto en GitHub"
            className="hover-scale"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: isHomePage ? 'rgba(255,255,255,0.1)' : 'rgba(212, 175, 55, 0.1)',
              border: isHomePage ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(212,175,55,0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <Image
              src={icono}
              alt="Repositorio de GitHub"
              width={24}
              height={24}
              priority
              style={{ objectFit: 'contain' }}
            />
          </a>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hidden-mobile">
              <span style={{ fontSize: '0.95rem', fontWeight: 500, color: textColor }}>Hola, {user.name}</span>
              <button onClick={logout} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: 'all 0.2s' }} title="Cerrar sesión" className="hover-scale">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} style={{ background: isHomePage ? 'rgba(255,255,255,0.1)' : 'rgba(212, 175, 55, 0.1)', border: 'none', color: isHomePage ? 'white' : 'var(--primary)', cursor: 'pointer', padding: '10px', borderRadius: '50%', transition: 'all 0.2s' }} className="hidden-mobile hover-scale">
              <User size={20} />
            </button>
          )}

          <button onClick={() => setIsCartOpen(true)} style={{ background: isHomePage ? 'rgba(255,255,255,0.1)' : 'rgba(212, 175, 55, 0.1)', border: 'none', color: isHomePage ? 'white' : 'var(--primary)', cursor: 'pointer', position: 'relative', padding: '10px', borderRadius: '50%', transition: 'all 0.2s' }} className="hover-scale">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px', 
                background: 'var(--primary)', color: 'white', 
                borderRadius: '50%', width: '22px', height: '22px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 'bold', border: isHomePage ? '2px solid transparent' : '2px solid var(--background)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="show-mobile" style={{ background: 'none', border: 'none', color: textColor, cursor: 'pointer', display: 'none', padding: '8px' }}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay animate-fade-in-up" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--surface-border)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <Link href="/" style={{ padding: '16px', fontSize: '1.2rem', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: pathname === '/' ? 'var(--primary)' : 'var(--foreground)' }}>
            Inicio <ChevronRight size={20} opacity={0.5} />
          </Link>
          <Link href="/productos" style={{ padding: '16px', fontSize: '1.2rem', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: pathname === '/productos' ? 'var(--primary)' : 'var(--foreground)' }}>
            Productos <ChevronRight size={20} opacity={0.5} />
          </Link>
          <Link href="/reparaciones" style={{ padding: '16px', fontSize: '1.2rem', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: pathname === '/reparaciones' ? 'var(--primary)' : 'var(--foreground)' }}>
            Reparaciones <ChevronRight size={20} opacity={0.5} />
          </Link>
          <Link href="/nosotros" style={{ padding: '16px', fontSize: '1.2rem', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: pathname === '/nosotros' ? 'var(--primary)' : 'var(--foreground)' }}>
            Nosotros <ChevronRight size={20} opacity={0.5} />
          </Link>
          
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px', background: 'rgba(212,175,55,0.05)', borderRadius: '12px' }}>
                <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{user.name}</span>
                <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                  Salir <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthModalOpen(true)} className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px' }}>
                <User size={20} /> Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
        .nav-link:hover {
          color: var(--primary) !important;
        }
        .hover-scale:hover {
          transform: scale(1.1);
        }
      `}</style>
    </header>
  );
}
