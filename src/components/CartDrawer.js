'use client';

import { useAppContext } from '@/context/AppContext';
import { X, Trash2, Plus, Minus, Truck, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, user, setIsAuthModalOpen } = useAppContext();
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [step, setStep] = useState('cart'); // 'cart' | 'payment' | 'success'
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvc: '' });

  useEffect(() => {
    if (isCartOpen && shippingOptions.length === 0) {
      fetch('/api/shipping')
        .then(res => res.json())
        .then(data => {
          setShippingOptions(data);
          setSelectedShipping(data[0]);
        });
    }
  }, [isCartOpen]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingPrice = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal > 0 ? subtotal + shippingPrice : 0;

  const handleGoToPayment = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setStep('payment');
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cart,
          userInfo: user,
          shippingMethod: selectedShipping,
          total: total
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setPaymentSuccess(data.transactionId);
        setStep('success');
      } else {
        alert(data.error || 'Error en el pago');
      }
    } catch (err) {
      alert('Error de conexión al procesar pago');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', 
          backdropFilter: 'blur(4px)', zIndex: 100
        }}
      />
      
      <div 
        className="glass"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, 
          width: '100%', maxWidth: '420px', zIndex: 101,
          display: 'flex', flexDirection: 'column',
          background: 'rgba(255,255,255,0.95)',
          color: 'var(--foreground)',
          boxShadow: '-10px 0 30px rgba(212, 175, 55, 0.15)',
          animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards'
        }}
      >
        <div style={{ padding: '24px', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
            {step === 'cart' && 'Tu Carrito'}
            {step === 'payment' && 'Pago Seguro'}
            {step === 'success' && '¡Éxito!'}
          </h2>
          <button onClick={() => { setIsCartOpen(false); setStep('cart'); setPaymentSuccess(null); }} style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {step === 'success' && (
          <div style={{ padding: '40px 24px', textAlign: 'center', flex: 1 }}>
            <ShieldCheck size={64} color="var(--success)" style={{ margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px' }}>¡Pago Exitoso!</h2>
            <p style={{ opacity: 0.8, marginBottom: '24px' }}>Tu transacción <strong>{paymentSuccess}</strong> ha sido procesada de manera segura.</p>
            <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '32px' }}>Recibirás un correo a <strong>{user?.email}</strong> con la confirmación de tu pedido y el número de seguimiento.</p>
            <button onClick={() => { setIsCartOpen(false); setStep('cart'); setPaymentSuccess(null); }} className="btn-primary" style={{ width: '100%' }}>
              Continuar Comprando
            </button>
          </div>
        )}

        {step === 'payment' && (
          <form onSubmit={handleProcessPayment} style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <p style={{ marginBottom: '24px', opacity: 0.8 }}>Total a pagar: <strong>${total.toFixed(2)}</strong></p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Nombre en la tarjeta</label>
                <input required type="text" placeholder="Ej. Juan Pérez" value={cardData.name} onChange={e => setCardData({...cardData, name: e.target.value})} className="input-premium" style={{ width: '100%' }} />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Número de Tarjeta (Prueba)</label>
                <input required type="text" placeholder="4242 4242 4242 4242" maxLength={19} value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} className="input-premium" style={{ width: '100%', letterSpacing: '2px' }} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Vencimiento</label>
                  <input required type="text" placeholder="MM/AA" maxLength={5} value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} className="input-premium" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>CVC</label>
                  <input required type="password" placeholder="123" maxLength={4} value={cardData.cvc} onChange={e => setCardData({...cardData, cvc: e.target.value})} className="input-premium" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
              <button type="button" onClick={() => setStep('cart')} style={{ width: '100%', padding: '12px', background: 'none', border: '1px solid var(--surface-border)', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer' }}>
                Volver al Carrito
              </button>
              <button 
                type="submit"
                disabled={isCheckingOut}
                className="btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '16px' }}
              >
                {isCheckingOut ? <span className="spinner" style={{ width: '24px', height: '24px', borderWidth: '2px', borderColor: 'white', borderTopColor: 'transparent' }}/> : `Pagar $${total.toFixed(2)}`}
              </button>
              <div style={{ textAlign: 'center', marginTop: '12px', opacity: 0.6, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Transacción simulada segura
              </div>
            </div>
          </form>
        )}

        {step === 'cart' && (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', opacity: 0.6, marginTop: '40px' }}>
                  <p>Tu carrito está vacío.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {cart.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '16px', background: 'rgba(212,175,55,0.05)', border: '1px solid var(--surface-border)', padding: '12px', borderRadius: '12px' }}>
                        <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.name}</h4>
                          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '8px' }}>Talla: {item.size} | ${item.price}</p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--background)', borderRadius: '6px', padding: '4px' }}>
                              <button onClick={() => updateQuantity(item.id, item.size, -1)} style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}><Minus size={16}/></button>
                              <span style={{ fontWeight: 600 }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.size, 1)} style={{ background: 'none', border: 'none', color: 'var(--foreground)', cursor: 'pointer' }}><Plus size={16}/></button>
                            </div>
                            
                            <button onClick={() => removeFromCart(item.id, item.size)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Opciones de Envío */}
                  <div style={{ marginTop: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Truck size={18} color="var(--primary)" /> Método de Envío
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {shippingOptions.map(opt => (
                        <label key={opt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: selectedShipping?.id === opt.id ? '2px solid var(--primary)' : '1px solid var(--surface-border)', borderRadius: '8px', cursor: 'pointer', background: selectedShipping?.id === opt.id ? 'rgba(212,175,55,0.05)' : 'transparent' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <input type="radio" name="shipping" checked={selectedShipping?.id === opt.id} onChange={() => setSelectedShipping(opt)} style={{ accentColor: 'var(--primary)' }} />
                            <span style={{ fontWeight: selectedShipping?.id === opt.id ? 700 : 500 }}>{opt.name}</span>
                          </div>
                          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${opt.price.toFixed(2)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ padding: '24px', borderTop: '1px solid var(--surface-border)', background: 'var(--background)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ opacity: 0.8, fontWeight: 500 }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ opacity: 0.8, fontWeight: 500 }}>Envío ({selectedShipping?.name || '...'})</span>
                  <span style={{ fontWeight: 600 }}>${shippingPrice.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.3rem', fontWeight: 800 }}>
                  <span>Total</span>
                  <span className="text-gradient">${total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleGoToPayment}
                  className="btn-primary" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '16px' }}
                >
                  Proceder al Pago
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
