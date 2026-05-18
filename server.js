require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
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
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === 'true',
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
    return res.status(500).json({ success: false, error: 'Error al enviar el correo.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
