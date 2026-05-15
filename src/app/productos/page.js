'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function ProductosPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.error("API Error:", data.error);
          setProducts([]);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

  return (
    <div className="container animate-fade-in-up" style={{ padding: '80px 24px', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '16px' }}>
          Nuestra <span className="text-gradient">Colección</span>
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
          El mejor estilo urbano a tus pies. Diseños exclusivos y materiales premium.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
        {products.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '24px', opacity: 0.75 }}>
            No se pudieron cargar los productos.
          </div>
        ) : (
          products.map((product, index) => (
            <div 
              key={product.id} 
              className="glass-card product-card" 
              style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column', animationDelay: `${index * 0.1}s` }} 
              onClick={() => setSelectedProduct(product)}
            >
              <div className="image-container" style={{ height: '320px', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px', position: 'relative' }}>
                <div className="product-glow"></div>
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/file.svg';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, transition: 'transform 0.5s ease' }}
                  className="product-img"
                />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>{product.name}</h3>
              <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '24px', marginTop: 'auto' }}>${product.price.toFixed(2)}</p>
              <button className="btn-secondary" style={{ width: '100%', fontWeight: 600 }}>Ver Detalles</button>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .product-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(212, 175, 55, 0.15);
          border-color: rgba(212, 175, 55, 0.4);
        }
        .product-card:hover .product-img {
          transform: scale(1.1) rotate(-5deg);
        }
        .product-glow {
          position: absolute;
          width: 150px;
          height: 150px;
          background: rgba(212, 175, 55, 0.2);
          filter: blur(40px);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.4s;
        }
        .product-card:hover .product-glow {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

function ProductDetail({ product, onBack }) {
  const { addToCart, user, setIsAuthModalOpen } = useAppContext();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [animating, setAnimating] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setAnimating(true);
    setTimeout(() => {
      addToCart(product, selectedSize, quantity);
      setAnimating(false);
    }, 500);
  };

  return (
    <div className="container animate-fade-in-up" style={{ padding: '60px 24px' }}>
      <button onClick={onBack} className="back-btn" style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer', marginBottom: '40px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '1.1rem', padding: '8px 16px', borderRadius: '99px', transition: 'all 0.2s' }}>
        ← Volver a productos
      </button>

      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '60px', padding: '48px', overflow: 'hidden', position: 'relative' }}>
        
        {/* Background decorative glow */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '300px', height: '300px', background: 'rgba(212, 175, 55, 0.1)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0 }}></div>
        
        <div style={{ borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/file.svg';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '99px', background: 'rgba(212,175,55,0.1)', color: 'var(--secondary)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '16px' }}>
              NUEVA TEMPORADA
            </div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.1 }}>{product.name}</h1>
            <p style={{ fontSize: '2.2rem', color: 'var(--primary)', fontWeight: 800 }}>${product.price.toFixed(2)}</p>
          </div>
          
          <p style={{ fontSize: '1.1rem', opacity: 0.7, lineHeight: 1.7 }}>{product.description}</p>

          <div style={{ padding: '24px', background: 'rgba(0,0,0,0.03)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '16px', fontWeight: 700 }}>Talla:</h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {product.sizes.map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{ 
                    width: '54px', height: '54px', borderRadius: '14px', 
                    border: selectedSize === size ? '2px solid var(--primary)' : '1px solid var(--surface-border)',
                    background: selectedSize === size ? 'var(--primary)' : 'var(--surface)',
                    color: selectedSize === size ? 'white' : 'var(--foreground)', 
                    fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: selectedSize === size ? '0 8px 20px rgba(212, 175, 55, 0.3)' : 'none'
                  }}
                  className="hover-scale"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '24px', background: 'rgba(0,0,0,0.03)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontWeight: 700, margin: 0 }}>Cantidad:</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface)', padding: '8px', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: 'none', color: 'var(--foreground)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>-</button>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, width: '30px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', border: 'none', color: 'var(--foreground)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>+</button>
            </div>
          </div>

          <button 
            onClick={handleAddToCart} 
            className={`btn-primary ${animating ? 'btn-animating' : ''}`} 
            style={{ marginTop: 'auto', padding: '20px', fontSize: '1.3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}
            disabled={animating}
          >
            {animating ? 'Añadiendo...' : 'Añadir al Carrito'}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .back-btn:hover {
          background: rgba(0,0,0,0.05) !important;
          transform: translateX(-5px);
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }
        .btn-animating {
          transform: scale(0.95);
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
