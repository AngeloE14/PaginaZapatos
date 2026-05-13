'use client';

import { useAppContext } from '@/context/AppContext';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, login } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Algo salió mal');
      }

      if (isLogin) {
        login(data.user);
        setIsAuthModalOpen(false);
      } else {
        // En registro, mostramos el mensaje para verificar correo
        alert(data.message);
        setIsLogin(true); // Cambiar a la vista de login
        setFormData({ ...formData, password: '' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div 
        onClick={() => setIsAuthModalOpen(false)}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      />
      
      <div className="glass-card animate-fade-in-up" style={{
        position: 'relative', width: '100%', maxWidth: '450px', padding: '40px',
        zIndex: 1001
      }}>
        <button 
          onClick={() => setIsAuthModalOpen(false)}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
          {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
        </h2>
        <p style={{ textAlign: 'center', opacity: 0.7, marginBottom: '32px' }}>
          {isLogin ? 'Ingresa tus credenciales para continuar' : 'Únete a Calzado del Pueblo'}
        </p>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid var(--error)', padding: '12px', borderRadius: '8px', marginBottom: '24px', color: '#fca5a5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {!isLogin && (
            <input 
              type="text" placeholder="Nombre completo" required className="input-premium"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
          )}
          <input 
            type="email" placeholder="Correo electrónico" required className="input-premium"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" placeholder="Contraseña" required className="input-premium"
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
          />
          
          <button type="submit" className="btn-primary" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }} disabled={loading}>
            {loading ? <div className="spinner" style={{ width: '24px', height: '24px', borderWidth: '2px' }}/> : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ opacity: 0.8 }}>
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }} 
              style={{ background: 'none', border: 'none', color: 'var(--secondary)', fontWeight: 600, marginLeft: '8px', cursor: 'pointer' }}
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
