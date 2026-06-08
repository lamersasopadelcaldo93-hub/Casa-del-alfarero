const path = require('path');
const dotenv = require('dotenv');

const envResult = dotenv.config();
if (envResult.error) {
  console.warn('No .env file loaded; using host environment variables if available.');
} else {
  console.log('Loaded .env file.');
}

const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});
app.use('/', express.static(path.join(__dirname)));

app.post('/api/send-donation', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Faltan datos requeridos.' });
  }

  const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'RECIPIENT_EMAIL', 'FROM_EMAIL'];
  const missingEnv = requiredEnv.filter((key) => !process.env[key]);
  if (missingEnv.length > 0) {
    console.error('Missing required environment variables:', missingEnv);
    return res.status(500).json({
      success: false,
      error: `Faltan variables de configuración: ${missingEnv.join(', ')}`
    });
  }

  try {
    console.log('SMTP config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure_env: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER ? '[redacted]' : undefined
    });

    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
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
      from: process.env.FROM_EMAIL,
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

// Endpoint para búsqueda segura en YouTube con filtro de duración (usa YT_API_KEY desde variables de entorno)
app.get('/api/yt-search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const apiKey = process.env.YT_API_KEY;
    if (!apiKey) return res.status(500).json({ success: false, error: 'YT_API_KEY no configurada en el servidor.' });

    const maxResults = Math.min(50, parseInt(req.query.max || '50', 10)); // Buscar más para filtrar después
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(q)}&key=${apiKey}`;

    const fetchFn = (typeof fetch === 'function') ? fetch : (await import('node-fetch')).default;
    const response = await fetchFn(url);
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return res.status(502).json({ success: false, error: 'YouTube API error', detail: text });
    }

    const data = await response.json();
    const videoIds = (data.items || []).map(item => item.id.videoId).filter(Boolean);
    
    if (!videoIds.length) {
      return res.json({ success: true, videos: [] });
    }

    // Obtener duraciones de los videos (máximo 50 por request)
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds.join(',')}&key=${apiKey}`;
    const videosResp = await fetchFn(videosUrl);
    if (!videosResp.ok) {
      const text = await videosResp.text().catch(() => '');
      return res.status(502).json({ success: false, error: 'YouTube API videos error', detail: text });
    }

    const videosData = await videosResp.json();
    
    // Convertir duración ISO 8601 a segundos (PT10M30S -> 630 segundos)
    function parseDuration(duration) {
      const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      const hours = parseInt(match[1]) || 0;
      const minutes = parseInt(match[2]) || 0;
      const seconds = parseInt(match[3]) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    }

    // Filtrar videos <= 10 minutos (600 segundos)
    const MAX_DURATION_SECONDS = 600;
    const videos = (videosData.items || [])
      .filter(item => {
        const durationSec = parseDuration(item.contentDetails.duration);
        return durationSec <= MAX_DURATION_SECONDS;
      })
      .slice(0, 6) // Devolver los primeros 6 después de filtrar
      .map(item => ({
        id: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || null,
        duration: item.contentDetails.duration
      }));

    return res.json({ success: true, videos });
  } catch (err) {
    console.error('YT search error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
