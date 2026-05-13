import { NextResponse } from 'next/server';

export async function GET(request) {
  // Simulamos una API de FedEx, DHL o correo local para obtener tarifas
  // Normalmente aquí recibiríamos el código postal o país por query params
  
  const shippingOptions = [
    { id: 'standard', name: 'Envío Estándar (3-5 días)', price: 15.00 },
    { id: 'express', name: 'Envío Express (1-2 días)', price: 25.00 },
    { id: 'premium', name: 'Envío Gold Asegurado (Día siguiente)', price: 40.00 }
  ];

  return NextResponse.json(shippingOptions);
}
