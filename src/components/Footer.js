'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-root" style={{ background: 'var(--foreground)', color: 'white', paddingTop: '80px', paddingBottom: '40px', marginTop: 'auto' }}>
      <div className="container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', marginBottom: '60px' }}>
          
          <div>
            <Link href="/" className="logo text-glow" style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', display: 'inline-block', marginBottom: '24px' }}>
              Calzado del <span className="text-gradient">Pueblo</span>
            </Link>
            <p style={{ opacity: 0.7, lineHeight: 1.6, marginBottom: '24px' }}>
              Impulsando la artesanía mexicana hacia el mercado global. Diseño con identidad, precio justo y atención al detalle en cada par.
            </p>
            <div className="footer-social" style={{ display: 'flex', gap: '16px', fontWeight: 600 }}>
              <a href="#" style={{ color: 'var(--primary)', transition: 'all 0.2s' }} className="hover-scale">
                Instagram
              </a>
              <a href="#" style={{ color: 'var(--primary)', transition: 'all 0.2s' }} className="hover-scale">
                Facebook
              </a>
              <a href="#" style={{ color: 'var(--primary)', transition: 'all 0.2s' }} className="hover-scale">
                X
              </a>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--primary)' }}>Enlaces Rápidos</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link href="/" className="footer-link">Inicio</Link></li>
              <li><Link href="/productos" className="footer-link">Colección de Productos</Link></li>
              <li><Link href="/reparaciones" className="footer-link">Servicio de Reparación</Link></li>
              <li><Link href="/nosotros" className="footer-link">Sobre Nosotros</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--primary)' }}>Atención al Cliente</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link href="#" className="footer-link">Preguntas Frecuentes</Link></li>
              <li><Link href="#" className="footer-link">Políticas de Envío</Link></li>
              <li><Link href="#" className="footer-link">Devoluciones</Link></li>
              <li><Link href="#" className="footer-link">Guía de Tallas</Link></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px', color: 'var(--primary)' }}>Contacto</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', opacity: 0.8 }}>
                <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>Av. Reforma 123, Zona Centro, CDMX 06000</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.8 }}>
                <Phone size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>+52 (55) 1234-5678</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.8 }}>
                <Mail size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>contacto@calzadodelpueblo.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-legal" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', opacity: 0.6, fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} Calzado del Pueblo. Todos los derechos reservados.</p>
          <div className="footer-legal-links" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Link href="#">Privacidad</Link>
            <Link href="#">Términos</Link>
            <div style={{ display: 'flex', gap: '8px', marginLeft: '16px', paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.3)' }}>
             
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer-link {
          opacity: 0.7;
          transition: all 0.2s;
          display: inline-block;
        }
        .footer-link:hover {
          opacity: 1;
          color: var(--primary);
          transform: translateX(5px);
        }
        .hover-scale:hover {
          transform: scale(1.1);
        }
        @media (max-width: 900px) {
          .footer-grid {
            gap: 36px !important;
          }
        }
        @media (max-width: 640px) {
          .footer-root {
            padding-top: 56px !important;
            padding-bottom: 28px !important;
          }
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
            margin-bottom: 36px !important;
          }
          .footer-social {
            flex-wrap: wrap;
            gap: 12px !important;
          }
          .footer-legal {
            align-items: flex-start !important;
            flex-direction: column;
            gap: 10px !important;
            font-size: 0.82rem !important;
          }
          .footer-legal-links {
            flex-wrap: wrap;
            gap: 10px !important;
          }
        }
      `}</style>
    </footer>
  );
}
