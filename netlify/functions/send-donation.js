const sgMail = require('@sendgrid/mail');

// Requiere configurar las variables de entorno en Netlify:
// SENDGRID_API_KEY, EMAIL_TO, SENDGRID_FROM (opcional)
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let payload = {};
  try {
    payload = event.body ? JSON.parse(event.body) : {};
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON payload' }) };
  }

  const { name, email, message } = payload;
  if (!name || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Faltan campos requeridos (name, email, message).' }) };
  }

  const to = process.env.EMAIL_TO;
  if (!to) {
    console.error('EMAIL_TO no está configurado en variables de entorno.');
    return { statusCode: 500, body: JSON.stringify({ error: 'Configuración del servidor incompleta.' }) };
  }

  const from = process.env.SENDGRID_FROM || to;

  const htmlMessage = `<p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
    <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
    <p><strong>Mensaje:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`;

  const msg = {
    to,
    from,
    subject: `Nuevo mensaje desde formulario de donaciones: ${name}`,
    text: `Nombre: ${name}\nCorreo: ${email}\nMensaje:\n${message}`,
    html: htmlMessage
  };

  try {
    await sgMail.send(msg);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Error enviando correo:', err && err.response ? err.response.body : err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error al enviar el correo.' }) };
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
