'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Check, ArrowRight } from 'lucide-react';

export default function ReparacionesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedServices, setSelectedServices] = useState([]);
  const { user, setIsAuthModalOpen } = useAppContext();

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error("API Error:", data.error);
          setServices([]);
        } else if (Array.isArray(data)) {
          setServices(data);
        } else {
          setServices([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setServices([]);
        setLoading(false);
      });
  }, []);

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(sId => sId !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const total = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (selectedServices.length === 0) {
      alert('Por favor selecciona al menos un servicio.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedServicesData = services.filter(s => selectedServices.includes(s.id));
      
      const res = await fetch('/api/services/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedServices: selectedServicesData,
          total: total,
          userInfo: user
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert(`¡Cotización solicitada con éxito!\nHemos enviado un correo a ${user.email} con las instrucciones paso a paso sobre cómo y dónde entregar tu calzado.`);
        setSelectedServices([]);
      } else {
        alert(data.error || 'Hubo un problema al solicitar la cotización.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al solicitar el servicio.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="reparaciones-page container animate-fade-in-up" style={{ padding: '80px 24px', minHeight: '80vh' }}>
      <div className="reparaciones-hero" style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '800px', margin: '0 auto 80px' }}>
        <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '99px', background: 'rgba(212,175,55,0.1)', color: 'var(--secondary)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '24px' }}>
          TALLER ARTESANAL
        </div>
        <h1 className="reparaciones-title" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.1 }}>
          Dale <span className="text-gradient">Vida Nueva</span> a tus Zapatos
        </h1>
        <p className="reparaciones-subtitle" style={{ fontSize: '1.2rem', opacity: 0.7, lineHeight: 1.6 }}>
          Nuestros maestros zapateros restauran tu calzado favorito con técnicas artesanales y materiales de la más alta calidad. Selecciona los servicios que necesitas y obtén una cotización al instante.
        </p>
      </div>

      <div className="reparaciones-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '60px' }}>
        
        {/* Catálogo */}
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Servicios Disponibles
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {services.map((service, index) => (
              <div 
                key={service.id} 
                className={`service-card ${selectedServices.includes(service.id) ? 'selected' : ''}`}
                onClick={() => toggleService(service.id)}
                style={{ 
                  padding: '24px', borderRadius: '16px', cursor: 'pointer',
                  border: selectedServices.includes(service.id) ? '2px solid var(--primary)' : '1px solid var(--surface-border)',
                  background: selectedServices.includes(service.id) ? 'rgba(212, 175, 55, 0.05)' : 'var(--surface)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  position: 'relative', overflow: 'hidden',
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {selectedServices.includes(service.id) && (
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 10px 0 0' }}>
                    <Check size={16} color="white" />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{service.name}</h3>
                  <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>${service.price.toFixed(2)}</span>
                </div>
                <p style={{ opacity: 0.7, fontSize: '1rem', lineHeight: 1.5 }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div className="summary-column" style={{ position: 'sticky', top: '100px', alignSelf: 'start' }}>
          <div className="glass-card summary-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)', zIndex: 0 }}></div>
            
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '32px', position: 'relative', zIndex: 1 }}>Resumen de Cotización</h2>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              {selectedServices.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', opacity: 0.5 }}>
                  <p style={{ fontStyle: 'italic', marginBottom: '24px' }}>Selecciona servicios del catálogo para ver el total.</p>
                </div>
              ) : (
                <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(0,0,0,0.02)', padding: '24px', borderRadius: '12px' }}>
                  {services.filter(s => selectedServices.includes(s.id)).map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', paddingBottom: '12px', borderBottom: '1px dashed rgba(0,0,0,0.1)' }}>
                      <span style={{ fontWeight: 500 }}>{s.name}</span>
                      <span style={{ fontWeight: 600 }}>${s.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop: '2px solid var(--surface-border)', paddingTop: '32px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Total Estimado</span>
                <span className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800 }}>${total.toFixed(2)}</span>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ padding: '20px', fontSize: '1.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', opacity: selectedServices.length === 0 || isSubmitting ? 0.7 : 1 }}
                  disabled={selectedServices.length === 0 || isSubmitting}
                >
                  {isSubmitting ? <span className="spinner" style={{ width: '24px', height: '24px', borderWidth: '2px', borderColor: 'white', borderTopColor: 'transparent' }}/> : <><ArrowRight size={20} /> Solicitar Servicio</>}
                </button>
                <p style={{ fontSize: '0.9rem', opacity: 0.6, textAlign: 'center', background: 'rgba(0,0,0,0.03)', padding: '12px', borderRadius: '8px' }}>
                  {user ? `Confirmación a: ${user.email}` : 'Inicia sesión para solicitar el servicio.'}
                </p>
              </form>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.05);
        }
        .service-card.selected {
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15);
        }
        .summary-card {
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
        }
        @media (max-width: 768px) {
          .reparaciones-page {
            padding: 64px 16px !important;
          }
          .reparaciones-hero {
            margin: 0 auto 36px !important;
          }
          .reparaciones-title {
            font-size: 2.2rem !important;
          }
          .reparaciones-subtitle {
            font-size: 1rem !important;
          }
          .reparaciones-grid {
            gap: 26px !important;
          }
          .service-card {
            padding: 18px !important;
          }
          .summary-column {
            position: static !important;
            top: auto !important;
          }
          .summary-card {
            padding: 22px !important;
          }
        }
      `}</style>
    </div>
  );
}
