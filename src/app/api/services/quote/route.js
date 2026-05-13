import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { selectedServices, total, userInfo } = await request.json();

    if (!selectedServices || selectedServices.length === 0) {
      return NextResponse.json({ error: 'No se seleccionaron servicios' }, { status: 400 });
    }

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && userInfo?.email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const itemsHtml = selectedServices.map(service => 
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${service.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${service.price.toFixed(2)}</td>
        </tr>`
      ).join('');

      const mailOptions = {
        from: `"Taller Artesanal - Calzado del Pueblo" <${process.env.EMAIL_USER}>`,
        to: userInfo.email,
        subject: `Cotización de Reparación - Calzado del Pueblo`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #d4af37; text-align: center;">¡Hola ${userInfo.name}!</h2>
            <p style="font-size: 16px;">Hemos recibido tu solicitud de cotización para restaurar tu calzado. Aquí tienes el desglose estimado de los servicios solicitados:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; text-align: left;">Servicio</th>
                  <th style="padding: 10px; text-align: right;">Costo Estimado</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding: 10px; text-align: right; font-weight: bold;">Total Estimado:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; color: #d4af37; font-size: 1.2rem;">$${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="background: rgba(212, 175, 55, 0.1); padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #d4af37;">
              <h3 style="color: #333; margin-top: 0;">¿Cómo y Dónde Entregar tu Calzado?</h3>
              <p>Para proceder con la reparación, por favor sigue estos pasos:</p>
              <ol style="line-height: 1.6;">
                <li><strong>Empaqueta tu calzado</strong> en una caja segura o bolsa protectora.</li>
                <li>Incluye un <strong>papelito con tu nombre y el correo</strong> (${userInfo.email}) con el que registraste esta cotización.</li>
                <li><strong>Tráelos a nuestro taller</strong> ubicado en:
                  <br>📍 <i>Avenida del Zapatero #123, Colonia Centro, Ciudad</i>
                </li>
              </ol>
              <p style="margin-bottom: 0;"><strong>Horario de atención:</strong> Lunes a Viernes de 9:00 AM a 6:00 PM.</p>
            </div>

            <p style="text-align: center; color: #666; font-size: 14px;">El precio final puede variar ligeramente tras la evaluación física de nuestro maestro zapatero.</p>
            <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">Gracias por confiar en el Taller Artesanal de Calzado del Pueblo.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ success: true, message: 'Cotización enviada exitosamente' });
  } catch (error) {
    console.error('Error enviando cotización:', error);
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
