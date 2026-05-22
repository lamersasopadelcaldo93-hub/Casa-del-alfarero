# Casa del Alfarero

Sitio web de donaciones y presentación de la iglesia Casa del Alfarero.

## Configuración local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/lamersasopadelcaldo93-hub/Casa-del-alfarero.git
   cd Casa-del-alfarero
   ```
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de configuración de ejemplo:
   ```bash
   cp .env.example .env
   ```
4. Edita `.env` y rellena tu configuración SMTP:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `RECIPIENT_EMAIL`
   - `FROM_EMAIL`

> En producción (por ejemplo en Render), configura estas variables directamente en el panel del servicio y no dependas de `.env.example`.

5. Inicia el servidor:
   ```bash
   npm start
   ```
6. Abre en el navegador:
   ```text
   http://localhost:3000/donacion.html
   ```

## Notas importantes

- No subas el archivo `.env` a GitHub. Está incluido en `.gitignore`.
- Si usas Gmail, usa una contraseña de aplicación (App Password) en `SMTP_PASS`.
- Asegúrate de abrir la página desde el servidor de Node (`http://localhost:3000`), no desde un servidor de archivos local o Live Server.

## Archivos importantes

- `donacion.html`: formulario de donaciones y JavaScript de envío.
- `server.js`: backend Express que recibe el formulario y envía el correo.
- `.env.example`: plantilla de variables de entorno.
- `.gitignore`: excluye `.env` y `node_modules`.

## Deploy en GitHub

1. Asegúrate de que tu repositorio remoto está configurado:
   ```bash
   git remote -v
   ```
2. Agrega, commitea y sube los cambios:
   ```bash
   git add .
   git commit -m "Actualizar README y preparar repo para GitHub"
   git push origin main
   ```

## Recomendación

- Para producción, usa un servicio con soporte para Node.js, como Heroku, Vercel, Railway o Azure App Service.
- Si quieres desplegar el backend en un servicio diferente al frontend, asegúrate de actualizar `fetch('/api/send-donation')` a la URL correcta del API.

## Desplegar en Netlify (función serverless para envío de correos)

Este repositorio ahora incluye una función Netlify que envía el correo cuando el usuario envía el formulario de `donacion.html`.

- Archivos añadidos:
   - `netlify/functions/send-donation.js` — función que recibe el POST y envía el correo vía SendGrid.
   - `netlify.toml` — redirige `/api/send-donation` a la función.

### Variables de entorno necesarias en Netlify

Configura estas variables en el panel de tu sitio en Netlify (Site settings → Build & deploy → Environment):

- `SENDGRID_API_KEY` — tu API Key de SendGrid.
- `EMAIL_TO` — correo receptor, donde quieres recibir los mensajes.
- `SENDGRID_FROM` — (opcional) correo verificado en SendGrid como remitente; si no se pone, se usará `EMAIL_TO`.

### Opción alternativa: usar FormSubmit (sin servidor)

Si no quieres configurar una función serverless o SendGrid, puedes usar FormSubmit para recibir los mensajes directamente en tu correo. Para ello:

- En `donacion.html` cambia el `action` del form a `https://formsubmit.co/tu_correo@example.com` (ya está actualizado con tu correo).
- En el primer envío FormSubmit te pedirá confirmar la cuenta mediante un enlace que recibes por correo; después de confirmar los mensajes llegarán a tu email.

Importante sobre seguridad:
- No subas tu archivo `.env` ni contraseñas a GitHub. Si en este repositorio existe `.env`, asegúrate de eliminarlo antes de hacer `git push`:

```bash
git rm --cached .env
rm .env
echo ".env" >> .gitignore
```

Esto elimina `.env` del control de versiones y añade la regla para ignorarlo en el futuro.

Después de añadir estas variables, despliega el sitio en Netlify. El formulario en `donacion.html` ya apunta a `/api/send-donation` y funcionará automáticamente con la función serverless.

Nota: para probar localmente puedes usar `netlify dev` (requiere instalar Netlify CLI) y configurar variables en un archivo `.env` de desarrollo, pero no es necesario para que funcione en producción en Netlify.
