import { NextResponse } from 'next/server';

import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { cartItems, userInfo, shippingMethod, total } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // Simulamos un procesamiento de pago de 1.5 segundos
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generamos un ID de transacción simulado
    const transactionId = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Enviar correo de confirmación de compra
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && userInfo?.email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const itemsHtml = cartItems.map(item => 
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (Talla: ${item.size})</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
      ).join('');

      const mailOptions = {
        from: `"Calzado del Pueblo" <${process.env.EMAIL_USER}>`,
        to: userInfo.email,
        subject: `Confirmación de Orden ${transactionId} - Calzado del Pueblo`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #d4af37; text-align: center;">¡Gracias por tu compra, ${userInfo.name}!</h2>
            <p>Tu pago ha sido procesado exitosamente. Aquí tienes los detalles de tu orden:</p>
            
            <div style="background: #fafafa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>ID de Transacción:</strong> ${transactionId}</p>
              <p><strong>Método de Envío:</strong> ${shippingMethod?.name || 'Estándar'}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; text-align: left;">Producto</th>
                  <th style="padding: 10px; text-align: center;">Cant.</th>
                  <th style="padding: 10px; text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total Pagado:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; color: #d4af37;">$${Number(total).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">Nos pondremos en contacto contigo cuando tu pedido sea enviado.</p>
          </div>
        `
      };

      transporter.sendMail(mailOptions).catch(err => console.error("Error enviando correo de orden:", err));
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Pago procesado exitosamente mediante la pasarela segura.',
      transactionId,
      status: 'COMPLETED'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando el pago' }, { status: 500 });
  }
}
