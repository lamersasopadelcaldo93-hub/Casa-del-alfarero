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
