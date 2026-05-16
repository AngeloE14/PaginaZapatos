'use client';

import Link from 'next/link';
import { ShieldCheck, Truck, Star, Award, ChevronRight, Zap, RefreshCw, Lock, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [bestsellers, setBestsellers] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    // Reveal animation delay
    setTimeout(() => setIsLoaded(true), 100);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Initial observe
    document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));

    // Observe again after fetching bestsellers
    console.log('Iniciando fetch de productos...');
    fetch('/api/products')
      .then(res => {
        console.log('Respuesta del fetch:', res.status, res.statusText);
        return res.json();
      })
      .then(data => {
        console.log('Productos cargados:', data);
        if (data.error) {
          console.error("API Error:", data.error);
          setBestsellers([]);
        } else if (Array.isArray(data)) {
          setBestsellers(data.slice(0, 4));
        } else {
          setBestsellers([]);
        }
        setLoadingProducts(false);
        setTimeout(() => {
          document.querySelectorAll('.scroll-animate').forEach((el) => observer.observe(el));
        }, 100);
      })
      .catch(error => {
        console.error('Error cargando productos:', error);
        setBestsellers([]);
        setLoadingProducts(false);
      });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home-page" style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'var(--foreground)' }}>
      
      {/* Curtain Reveal Overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999, background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), opacity 1s ease',
        transform: isLoaded ? 'translateY(-100%)' : 'translateY(0)',
        opacity: isLoaded ? 0 : 1,
        pointerEvents: 'none'
      }}>
        <div style={{ color: 'var(--primary)', letterSpacing: '8px', fontWeight: 800, fontSize: '1.5rem', animation: 'pulse 1.5s infinite' }}>
          CALZADO DEL PUEBLO
        </div>
      </div>

      {/* Dynamic Mouse Glow */}
      <div className="mouse-glow" style={{
        position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0,
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 60%)',
        transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
        transition: 'transform 0.1s ease-out'
      }} />

      {/* Hero Section */}
      <section className="home-hero" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', textAlign: 'center', position: 'relative',
        perspective: '1000px', overflow: 'hidden'
      }}>
        {/* Cinematic Background Image/Video */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img 
            src="https://images.unsplash.com/photo-1580982545800-47b2bd3c5c96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Fondo de Artesanía"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) contrast(1.2)' }} 
          />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(10,10,10,1) 100%)' }} />
        </div>

        <div className="home-hero-content" style={{ 
          maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', 
          position: 'relative', zIndex: 2,
          marginTop: '80px', /* Previene superposición con el navbar fijo */
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
          transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
        }}>
          <div className="home-hero-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 28px', borderRadius: '99px',
            background: 'rgba(0, 0, 0, 0.4)', 
            color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', 
            border: '1px solid rgba(212,175,55,0.4)', letterSpacing: '3px',
            textTransform: 'uppercase', backdropFilter: 'blur(12px)',
            boxShadow: '0 0 20px rgba(212,175,55,0.1)'
          }}>
            <Star size={14} fill="var(--primary)" color="var(--primary)" /> Orgullo de Nuestros Artesanos
          </div>
          
          <h1 className="home-hero-title" style={{ 
            fontSize: 'clamp(3.5rem, 8vw, 8rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', color: 'white',
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <span className="reveal-text" style={{ animationDelay: '0.8s' }}>Identidad de</span><br/>
            <span className="reveal-text text-gradient" style={{ animationDelay: '1s' }}>México al Mundo.</span>
          </h1>
          
          <p className="home-hero-subtitle" style={{ 
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', color: 'rgba(255,255,255,0.85)', maxWidth: '700px', lineHeight: 1.6, fontWeight: 400,
            opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease 1.5s',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            Impulsamos el talento de nuestros artesanos mexicanos al mercado global, dándole identidad a su trabajo con precios justos y competitivos.
          </p>

          <div className="home-hero-actions" style={{ 
            display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '24px',
            opacity: isLoaded ? 1 : 0, transform: isLoaded ? 'translateY(0)' : 'translateY(20px)', transition: 'all 1s ease 1.8s'
          }}>
            <Link href="/productos" className="btn-primary" style={{ padding: '22px 50px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 40px rgba(212,175,55,0.4)' }}>
              Explorar Colección <ChevronRight size={20} />
            </Link>
            <Link href="/reparaciones" className="btn-glass" style={{ padding: '22px 50px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              Servicio de Restauración
            </Link>
          </div>
        </div>
      </section>

      {/* Infinite Marquee Section */}
      <section style={{ padding: '40px 0', background: 'rgba(212,175,55,0.05)', borderTop: '1px solid rgba(212,175,55,0.1)', borderBottom: '1px solid rgba(212,175,55,0.1)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div className="marquee-content" style={{ display: 'inline-block', color: 'var(--primary)', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '4px', textTransform: 'uppercase' }}>
          <span>ARTESANÍA MEXICANA <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>HECHO A MANO <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>COMERCIO JUSTO <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>IDENTIDAD GLOBAL <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>SERVICIOS DE REPARACIÓN <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>ARTESANÍA MEXICANA <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>HECHO A MANO <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>COMERCIO JUSTO <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>IDENTIDAD GLOBAL <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>SERVICIOS DE REPARACIÓN <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="home-trust" style={{ padding: '60px 0', background: 'var(--surface)', borderBottom: '1px solid var(--surface-border)' }}>
        <div className="container scroll-animate fade-in-up" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', textAlign: 'center' }}>
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(212,175,55,0.1)', padding: '20px', borderRadius: '50%' }}><Truck size={32} color="var(--primary)" /></div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Alcance Global</h4>
            <p style={{ opacity: 0.7 }}>Llevamos nuestra cultura a todo el mundo.</p>
          </div>
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(212,175,55,0.1)', padding: '20px', borderRadius: '50%' }}><RefreshCw size={32} color="var(--primary)" /></div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Restauración</h4>
            <p style={{ opacity: 0.7 }}>Extendemos la vida útil de tus zapatos.</p>
          </div>
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(212,175,55,0.1)', padding: '20px', borderRadius: '50%' }}><Lock size={32} color="var(--primary)" /></div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Precios Justos</h4>
            <p style={{ opacity: 0.7 }}>Comercio directo con artesanos mexicanos.</p>
          </div>
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(212,175,55,0.1)', padding: '20px', borderRadius: '50%' }}><Award size={32} color="var(--primary)" /></div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Identidad Propia</h4>
            <p style={{ opacity: 0.7 }}>Diseños que reflejan nuestras raíces.</p>
          </div>
        </div>
      </section>



      {/* Bestsellers Section */}
      <section className="home-bestsellers" style={{ padding: '80px 0', background: 'var(--background)' }}>
        <div className="container">
          <div className="scroll-animate fade-in-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="home-collection-title" style={{ fontSize: '3rem', fontWeight: 800 }}>Nuestra <span className="text-gradient">Colección</span></h2>
            <p style={{ opacity: 0.7, fontSize: '1.2rem', maxWidth: '600px', margin: '16px auto 0' }}>Los favoritos de nuestros clientes más exigentes.</p>
          </div>
          
          <div className="bestsellers-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '32px' }}>
            {loadingProducts ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div>Cargando productos...</div>
              </div>
            ) : bestsellers.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
                <div>No se pudieron cargar los productos</div>
              </div>
            ) : (
              bestsellers.map((product, i) => (
                <div key={product.id} className="scroll-animate fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <Link href="/productos" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', padding: '16px', border: '1px solid var(--surface-border)', transition: 'transform 0.3s, box-shadow 0.3s' }} className="hover-scale">
                      <div style={{ height: '240px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', position: 'relative' }}>
                        <img
                          src={product.image}
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/file.svg';
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{product.name}</h3>
                      <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem', marginTop: '8px' }}>${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/productos" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>Ver Todos Los Productos</Link>
          </div>
        </div>
      </section>

      {/* Parallax Featured Section */}
      <section className="home-featured" style={{ padding: '120px 0', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div className="home-featured-header scroll-animate fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '20px' }}>
            <h2 className="home-featured-title" style={{ fontSize: '3.5rem', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Artesanía de <br/><span className="text-gradient">Exportación</span></h2>
            <Link href="/productos" className="link-hover-effect" style={{ fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Ver Catálogo Completo <ChevronRight size={20} />
            </Link>
          </div>
          
          <div className="home-featured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px' }}>
            <div className="luxury-card group scroll-animate fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="luxury-card-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1595991209266-5e04278dc71f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)' }} />
              <div className="luxury-card-content">
                <div className="badge">TRADICIÓN</div>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Cultura Viva</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '24px' }}>El equilibrio perfecto entre lo tradicional y lo moderno.</p>
                <Link href="/productos" className="btn-glass">Adquirir Ahora</Link>
              </div>
            </div>
            
            <div className="luxury-card group scroll-animate fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="luxury-card-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1616866168339-399066cbab8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)' }} />
              <div className="luxury-card-content">
                <div className="badge">IDENTIDAD</div>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Legado Maestro</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '24px' }}>Nuestra identidad en cada detalle de piel.</p>
                <Link href="/productos" className="btn-glass">Adquirir Ahora</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section with Video */}
      <section className="home-craft" style={{ padding: '160px 0', background: 'var(--foreground)', color: 'white', marginTop: '80px', position: 'relative' }}>
        <div className="container home-craft-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '80px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px', position: 'relative' }} className="video-container scroll-animate fade-in-up">
            <img 
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Artesano de calzado trabajando"
              className="craft-image"
              style={{ width: '100%', height: '700px', objectFit: 'cover', borderRadius: '32px', filter: 'brightness(0.7) contrast(1.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }} 
            />
            <div className="glass-badge" style={{ position: 'absolute', bottom: '40px', left: '-40px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>120+</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Procesos Manuales</div>
            </div>
          </div>
          
          <div className="home-craft-copy scroll-animate fade-in-up" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '32px', animationDelay: '0.3s' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>Raíces y Cultura</div>
            <h2 className="craft-title" style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1 }}>El Valor de lo <br/>Auténtico.</h2>
            <p className="craft-description" style={{ fontSize: '1.3rem', color: '#aaa', lineHeight: 1.8 }}>
              Nuestros artesanos mexicanos imprimen su alma en cada producto. Al eliminar intermediarios, garantizamos un pago justo por su arte y te ofrecemos calidad excepcional a un precio competitivo.
            </p>
            <div className="craft-feature-list" style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(212,175,55,0.1)', padding: '16px', borderRadius: '50%' }}><ShieldCheck size={24} color="var(--primary)" /></div>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Cuidado y Reparación</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(212,175,55,0.1)', padding: '16px', borderRadius: '50%' }}><Award size={24} color="var(--primary)" /></div>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Comercio Justo</span>
              </div>
            </div>
            <Link href="/reparaciones" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '24px' }}>
              Conoce nuestro Taller
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="home-testimonials" style={{ padding: '100px 0', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(212, 175, 55, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />
        <div className="container">
          <div className="scroll-animate fade-in-up" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
              <Star size={16} fill="var(--primary)" /> Voces de nuestros clientes
            </div>
            <h2 className="home-testimonials-title" style={{ fontSize: '3rem', fontWeight: 800 }}>El Sello de Aprobación.</h2>
          </div>

          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px' }}>
            <div className="testimonial-card glass-card scroll-animate fade-in-up" style={{ padding: '40px', position: 'relative' }}>
              <Quote size={40} color="var(--primary)" style={{ opacity: 0.2, position: 'absolute', top: '24px', right: '24px' }} />
              <div style={{ display: 'flex', gap: '4px', color: 'var(--primary)', marginBottom: '24px' }}>
                <Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '32px', opacity: 0.9 }}>
                "La calidad de la piel es insuperable. Desde el primer momento que los usé, supe que estaba ante una verdadera obra maestra del diseño urbano."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'url(https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80) center/cover' }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Carlos M.</h4>
                  <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Cliente Verificado</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card glass-card scroll-animate fade-in-up" style={{ padding: '40px', position: 'relative', animationDelay: '0.2s' }}>
              <Quote size={40} color="var(--primary)" style={{ opacity: 0.2, position: 'absolute', top: '24px', right: '24px' }} />
              <div style={{ display: 'flex', gap: '4px', color: 'var(--primary)', marginBottom: '24px' }}>
                <Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '32px', opacity: 0.9 }}>
                "Un servicio al cliente excepcional y un producto que supera cualquier expectativa. Los detalles dorados y la presentación son increíbles."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'url(https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80) center/cover' }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Elena R.</h4>
                  <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Compradora de Golden Edition</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card glass-card scroll-animate fade-in-up" style={{ padding: '40px', position: 'relative', animationDelay: '0.4s' }}>
              <Quote size={40} color="var(--primary)" style={{ opacity: 0.2, position: 'absolute', top: '24px', right: '24px' }} />
              <div style={{ display: 'flex', gap: '4px', color: 'var(--primary)', marginBottom: '24px' }}>
                <Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" /><Star size={20} fill="currentColor" />
              </div>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.6, marginBottom: '32px', opacity: 0.9 }}>
                "Llevo usándolos a diario en la ciudad y siguen viéndose como nuevos. El nivel de artesanía realmente se nota en cada costura."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80) center/cover' }} />
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>David T.</h4>
                  <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Cliente Verificado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Immersive CTA */}
      <section className="home-cta" style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="home-cta-bg" style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80) center/cover fixed', filter: 'brightness(0.3) sepia(0.2) hue-rotate(5deg)' }} />
        <div className="home-cta-content" style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          <Star size={64} color="var(--primary)" fill="var(--primary)" style={{ animation: 'pulse 2s infinite' }} />
          <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.1 }}>
            Únete a la <br/>Exclusividad.
          </h2>
          <p className="home-cta-text" style={{ fontSize: '1.3rem', maxWidth: '600px', opacity: 0.8 }}>Ingresa al club privado de Calzado del Pueblo y obtén acceso anticipado a nuestras piezas de colección limitadas.</p>
          <div className="home-cta-form" style={{ display: 'flex', width: '100%', maxWidth: '500px', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '99px', backdropFilter: 'blur(10px)' }}>
            <input className="home-cta-input" type="email" placeholder="Tu correo electrónico" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', padding: '0 24px', fontSize: '1.1rem' }} />
            <button className="home-cta-button btn-primary" style={{ borderRadius: '99px', padding: '16px 32px' }}>Suscribirse</button>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Animaciones espectaculares */
        .reveal-text {
          display: inline-block;
          opacity: 0;
          transform: translateY(40px) rotateX(-20deg);
          animation: revealText 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes revealText {
          to {
            opacity: 1;
            transform: translateY(0) rotateX(0);
          }
        }

        .floating-element {
          animation: float 10s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }

        /* Tarjetas de Lujo con efecto 3D Parallax */
        .luxury-card {
          position: relative;
          height: 600px;
          border-radius: 24px;
          overflow: hidden;
          cursor: pointer;
        }

        .luxury-card-img {
          position: absolute;
          inset: -20px;
          background-position: center;
          background-size: cover;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-card:hover .luxury-card-img {
          transform: scale(1.05);
        }

        .luxury-card-content {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%);
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          transition: background 0.4s ease;
        }

        .luxury-card:hover .luxury-card-content {
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%);
        }

        .badge {
          background: var(--primary);
          color: white;
          padding: 6px 16px;
          border-radius: 99px;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 24px;
        }

        .btn-glass {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .btn-glass:hover {
          background: white;
          color: black;
          transform: translateY(-5px);
        }

        .link-hover-effect {
          color: var(--primary);
          position: relative;
          text-decoration: none;
        }

        .link-hover-effect::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0%;
          height: 2px;
          background: var(--primary);
          transition: width 0.3s ease;
        }

        .link-hover-effect:hover::after {
          width: 100%;
        }

        .glass-badge {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 30px;
          border-radius: 24px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.3);
          animation: float 6s ease-in-out infinite reverse;
        }

        /* Scroll Animations */
        .scroll-animate {
          opacity: 0;
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .fade-in-up {
          transform: translateY(60px);
        }

        .scroll-animate.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Marquee Animation */
        .marquee-content {
          animation: marquee 20s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (max-width: 900px) {
          .home-featured-title {
            font-size: 2.8rem !important;
          }
          .craft-title {
            font-size: 3rem !important;
          }
        }

        @media (max-width: 768px) {
          .mouse-glow {
            display: none;
          }
          .home-hero {
            min-height: 92vh !important;
            padding: 120px 16px 56px !important;
          }
          .home-hero-content {
            margin-top: 42px !important;
            gap: 20px !important;
          }
          .home-hero-badge {
            font-size: 0.72rem !important;
            letter-spacing: 1.5px !important;
            padding: 8px 16px !important;
          }
          .home-hero-title {
            font-size: clamp(2.2rem, 12vw, 3.4rem) !important;
          }
          .home-hero-subtitle {
            font-size: 1rem !important;
          }
          .home-hero-actions {
            width: 100%;
            gap: 12px !important;
            margin-top: 12px !important;
          }
          .home-hero-actions a {
            width: 100%;
            justify-content: center;
            padding: 16px 20px !important;
            font-size: 1rem !important;
          }
          .home-trust {
            padding: 48px 0 !important;
          }
          .home-bestsellers {
            padding: 64px 0 !important;
          }
          .home-collection-title {
            font-size: 2.1rem !important;
          }
          .bestsellers-grid {
            gap: 20px !important;
          }
          .home-featured {
            padding: 72px 0 !important;
          }
          .home-featured-header {
            margin-bottom: 28px !important;
          }
          .home-featured-title {
            font-size: 2.2rem !important;
          }
          .home-featured-grid {
            gap: 24px !important;
          }
          .luxury-card {
            height: 460px;
          }
          .luxury-card-content {
            padding: 24px;
          }
          .home-craft {
            padding: 88px 0 72px !important;
            margin-top: 40px !important;
          }
          .home-craft-grid {
            gap: 36px !important;
          }
          .craft-image {
            height: 420px !important;
            border-radius: 20px !important;
          }
          .glass-badge {
            left: 12px !important;
            bottom: 12px !important;
            padding: 18px !important;
          }
          .craft-title {
            font-size: 2.2rem !important;
          }
          .craft-description {
            font-size: 1.02rem !important;
          }
          .craft-feature-list {
            flex-direction: column;
            gap: 14px !important;
          }
          .home-testimonials {
            padding: 72px 0 !important;
          }
          .home-testimonials-title {
            font-size: 2.1rem !important;
          }
          .testimonials-grid {
            gap: 20px !important;
          }
          .testimonial-card {
            padding: 24px !important;
          }
          .home-cta {
            height: auto !important;
            min-height: 70vh;
            padding: 72px 16px;
          }
          .home-cta-bg {
            background-attachment: scroll !important;
          }
          .home-cta-content {
            gap: 20px !important;
          }
          .home-cta-text {
            font-size: 1rem !important;
          }
          .home-cta-form {
            flex-direction: column;
            border-radius: 18px !important;
            padding: 12px !important;
          }
          .home-cta-input {
            width: 100%;
            text-align: center;
            padding: 12px 14px !important;
          }
          .home-cta-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
