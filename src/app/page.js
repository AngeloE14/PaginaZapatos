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
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'var(--foreground)' }}>
      
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
      <div style={{
        position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0,
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 60%)',
        transform: `translate(${mousePosition.x - 300}px, ${mousePosition.y - 300}px)`,
        transition: 'transform 0.1s ease-out'
      }} />

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', textAlign: 'center', position: 'relative',
        perspective: '1000px', overflow: 'hidden'
      }}>
        {/* Cinematic Background Video */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <video 
            autoPlay loop muted playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) contrast(1.2)' }} 
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-person-walking-in-leather-shoes-140-large.mp4" type="video/mp4" />
          </video>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(10,10,10,1) 100%)' }} />
        </div>

        <div style={{ 
          maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', 
          position: 'relative', zIndex: 2,
          marginTop: '80px', /* Previene superposición con el navbar fijo */
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
          transition: 'all 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 28px', borderRadius: '99px',
            background: 'rgba(0, 0, 0, 0.4)', 
            color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', 
            border: '1px solid rgba(212,175,55,0.4)', letterSpacing: '3px',
            textTransform: 'uppercase', backdropFilter: 'blur(12px)',
            boxShadow: '0 0 20px rgba(212,175,55,0.1)'
          }}>
            <Star size={14} fill="var(--primary)" color="var(--primary)" /> La Nueva Era del Calzado
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(3.5rem, 8vw, 8rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.04em', color: 'white',
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <span className="reveal-text" style={{ animationDelay: '0.8s' }}>Elegancia que</span><br/>
            <span className="reveal-text text-gradient" style={{ animationDelay: '1s' }}>trasciende.</span>
          </h1>
          
          <p style={{ 
            fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', color: 'rgba(255,255,255,0.85)', maxWidth: '700px', lineHeight: 1.6, fontWeight: 400,
            opacity: isLoaded ? 1 : 0, transition: 'opacity 1s ease 1.5s',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
          }}>
            Redefiniendo el lujo con materiales auténticos y una artesanía que desafía el paso del tiempo. Descubre el estándar de oro.
          </p>

          <div style={{ 
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
          <span>PIEL AUTÉNTICA <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>HECHO A MANO <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>DISEÑO EXCLUSIVO <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>GARANTÍA VITALICIA <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>CALIDAD EUROPEA <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>PIEL AUTÉNTICA <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>HECHO A MANO <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>DISEÑO EXCLUSIVO <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>GARANTÍA VITALICIA <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
          <span>CALIDAD EUROPEA <span style={{ margin: '0 30px', color: 'rgba(255,255,255,0.2)' }}>✦</span></span>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ padding: '60px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--surface-border)' }}>
        <div className="container scroll-animate fade-in-up" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', textAlign: 'center' }}>
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(212,175,55,0.1)', padding: '20px', borderRadius: '50%' }}><Truck size={32} color="var(--primary)" /></div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Envío Internacional</h4>
            <p style={{ opacity: 0.7 }}>A cualquier parte del mundo.</p>
          </div>
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(212,175,55,0.1)', padding: '20px', borderRadius: '50%' }}><RefreshCw size={32} color="var(--primary)" /></div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Cambios Gratuitos</h4>
            <p style={{ opacity: 0.7 }}>Hasta 30 días después de tu compra.</p>
          </div>
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(212,175,55,0.1)', padding: '20px', borderRadius: '50%' }}><Lock size={32} color="var(--primary)" /></div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Pago 100% Seguro</h4>
            <p style={{ opacity: 0.7 }}>Cifrado de extremo a extremo.</p>
          </div>
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(212,175,55,0.1)', padding: '20px', borderRadius: '50%' }}><Award size={32} color="var(--primary)" /></div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Empaque Premium</h4>
            <p style={{ opacity: 0.7 }}>Listo para regalar o coleccionar.</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="container scroll-animate fade-in-up" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="team-title" style={{ fontSize: '2.8rem', fontWeight: 800 }}>Equipo de Desarrollo</h2>
          <p style={{ color: 'rgba(26,26,26,0.8)', fontSize: '1.1rem', maxWidth: '680px', margin: '16px auto 0' }}>
            Proyecto creado y presentado por el equipo encargado de la propuesta de experiencia premium.
          </p>
          <ul className="team-list">
            <li>Angelo Emmanuel Flores Montes</li>
            <li>Oscar Gomez Vazquez</li>
            <li>Esteban Santos Angulo</li>
            <li>Arath Daniel Noriega Domínguez</li>
            <li>Enrique Vega Mayer</li>
          </ul>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section style={{ padding: '80px 24px', background: 'var(--background)' }}>
        <div className="container">
          <div className="scroll-animate fade-in-up" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>Nuestra <span className="text-gradient">Colección</span></h2>
            <p style={{ opacity: 0.7, fontSize: '1.2rem', maxWidth: '600px', margin: '16px auto 0' }}>Los favoritos de nuestros clientes más exigentes.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
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
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
      <section style={{ padding: '120px 24px', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div className="scroll-animate fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px', flexWrap: 'wrap', gap: '20px' }}>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>Obras Maestras <br/><span className="text-gradient">Contemporáneas</span></h2>
            <Link href="/productos" className="link-hover-effect" style={{ fontWeight: 700, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Ver Catálogo Completo <ChevronRight size={20} />
            </Link>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
            <div className="luxury-card group scroll-animate fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="luxury-card-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)' }} />
              <div className="luxury-card-content">
                <div className="badge">ICÓNICO</div>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Golden Edition</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '24px' }}>El equilibrio perfecto entre lo urbano y lo exclusivo.</p>
                <Link href="/productos" className="btn-glass">Adquirir Ahora</Link>
              </div>
            </div>
            
            <div className="luxury-card group scroll-animate fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="luxury-card-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551107696-a4b0a5f5d95c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80)' }} />
              <div className="luxury-card-content">
                <div className="badge">NUEVO</div>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Classic Black</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '24px' }}>Elegancia oscura para la ciudad moderna.</p>
                <Link href="/productos" className="btn-glass">Adquirir Ahora</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section with Video */}
      <section style={{ padding: '160px 24px', background: 'var(--foreground)', color: 'white', marginTop: '80px', position: 'relative' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '80px', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px', position: 'relative' }} className="video-container scroll-animate fade-in-up">
            <img 
              src="https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Artesano de calzado trabajando"
              style={{ width: '100%', height: '700px', objectFit: 'cover', borderRadius: '32px', filter: 'brightness(0.7) contrast(1.2)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }} 
            />
            <div className="glass-badge" style={{ position: 'absolute', bottom: '40px', left: '-40px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary)' }}>120+</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Procesos Manuales</div>
            </div>
          </div>
          
          <div className="scroll-animate fade-in-up" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '32px', animationDelay: '0.3s' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase' }}>Tradición y Vanguardia</div>
            <h2 style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1 }}>El Arte de <br/>la Perfección.</h2>
            <p style={{ fontSize: '1.3rem', color: '#aaa', lineHeight: 1.8 }}>
              No somos una fábrica; somos un taller. Seleccionamos cuidadosamente las pieles europeas de más alta calidad y dedicamos decenas de horas a cada par.
            </p>
            <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(212,175,55,0.1)', padding: '16px', borderRadius: '50%' }}><ShieldCheck size={24} color="var(--primary)" /></div>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Garantía Vitalicia</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(212,175,55,0.1)', padding: '16px', borderRadius: '50%' }}><Award size={24} color="var(--primary)" /></div>
                <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Piel Auténtica</span>
              </div>
            </div>
            <Link href="/reparaciones" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '24px' }}>
              Conoce nuestro Taller
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section style={{ padding: '100px 24px', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(212, 175, 55, 0.05)', filter: 'blur(100px)', borderRadius: '50%' }} />
        <div className="container">
          <div className="scroll-animate fade-in-up" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
              <Star size={16} fill="var(--primary)" /> Voces de nuestros clientes
            </div>
            <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>El Sello de Aprobación.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            <div className="glass-card scroll-animate fade-in-up" style={{ padding: '40px', position: 'relative' }}>
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

            <div className="glass-card scroll-animate fade-in-up" style={{ padding: '40px', position: 'relative', animationDelay: '0.2s' }}>
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

            <div className="glass-card scroll-animate fade-in-up" style={{ padding: '40px', position: 'relative', animationDelay: '0.4s' }}>
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
      <section style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80) center/cover fixed', filter: 'brightness(0.3) sepia(0.2) hue-rotate(5deg)' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
          <Star size={64} color="var(--primary)" fill="var(--primary)" style={{ animation: 'pulse 2s infinite' }} />
          <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1.1 }}>
            Únete a la <br/>Exclusividad.
          </h2>
          <p style={{ fontSize: '1.3rem', maxWidth: '600px', opacity: 0.8 }}>Ingresa al club privado de Calzado del Pueblo y obtén acceso anticipado a nuestras piezas de colección limitadas.</p>
          <div style={{ display: 'flex', width: '100%', maxWidth: '500px', gap: '12px', background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '99px', backdropFilter: 'blur(10px)' }}>
            <input type="email" placeholder="Tu correo electrónico" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', padding: '0 24px', fontSize: '1.1rem' }} />
            <button className="btn-primary" style={{ borderRadius: '99px', padding: '16px 32px' }}>Suscribirse</button>
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
      `}</style>
    </div>
  );
}
