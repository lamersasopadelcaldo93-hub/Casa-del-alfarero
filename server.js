const path = require('path');
const dotenv = require('dotenv');

// Cargar .env y luego cargar .env.example como fallback (no hace override de variables ya definidas)
const primary = dotenv.config();
const example = dotenv.config({ path: path.join(__dirname, '.env.example') });
console.log('dotenv primary parsed:', !!primary.parsed, 'example parsed:', !!example.parsed);

const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname)));

app.post('/api/send-donation', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Faltan datos requeridos.' });
  }

  try {
    // Log SMTP env for debugging
    console.log('SMTP config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure_env: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER ? '[redacted]' : undefined
    });

    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    // Forzar secure=true únicamente para el puerto 465 (SMTPS). Para 587 usamos STARTTLS (secure=false).
    const secureFlag = smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: secureFlag,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `Formulario de donaciones: ${name}`,
      text: `Nuevo mensaje desde formulario de donaciones:\n\nNombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (err) {
    console.error('Error sending email:', err);
    const errMsg = process.env.NODE_ENV === 'production' ? 'Error al enviar el correo.' : err.message;
    return res.status(500).json({ success: false, error: errMsg });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
