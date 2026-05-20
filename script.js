// Datos configurables
const config = {
  church_name: 'Casa del Alfarero',
  welcome_text: 'Un lugar donde Dios transforma vidas',
  service_sunday: 'Domingos 9:20 AM',
  service_wednesday: 'Jueves 6:20 PM',
  pastor_name: 'Pastor : Pedro Gutierrez Guadamuz',
  address_text: 'Del tanque de la policia 1c.s,'
};

// Función para actualizar idioma
function updateLanguage() {
  const lang = localStorage.getItem('language') || 'es';
  document.documentElement.lang = lang;
  
  // Actualizar elemento de idioma actual
  const languageMap = { es: 'ES', en: 'EN', fr: 'FR', pt: 'PT' };
  const currentLanguageEl = document.getElementById('current-language');
  if (currentLanguageEl) currentLanguageEl.textContent = languageMap[lang] || 'ES';
  
  // Actualizar todos los elementos con data-translate
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = typeof getTranslation === 'function' ? getTranslation(key, lang) : '';
    if (translation) element.textContent = translation;
  });
}

// Menú hamburguesa
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');
const hamburgerIcon = document.getElementById('hamburger-icon');
const closeIcon = document.getElementById('close-icon');

if (hamburgerBtn && mobileMenu && hamburgerIcon && closeIcon) {
  hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    hamburgerIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
  });
  
  // Cerrar menú al hacer click en un enlace
  document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    });
  });
}

// Actualizar idioma al cargar
document.addEventListener('DOMContentLoaded', () => {
  updateLanguage();

  // Actualizar textos
  const navNameEl = document.getElementById('nav-name');
  if (navNameEl) navNameEl.textContent = config.church_name;
});

const sectionLogoBackgrounds = document.querySelectorAll('.section-logo-bg');

function updateLogoBackgroundOpacity() {
  const viewportCenter = window.innerHeight / 2;
  sectionLogoBackgrounds.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const distance = Math.abs(sectionCenter - viewportCenter);
    const maxDistance = window.innerHeight;
    const opacity = Math.max(0.03, 0.12 - (distance / maxDistance) * 0.12);
    section.style.setProperty('--logo-bg-opacity', opacity.toFixed(3));
  });
}

window.addEventListener('scroll', updateLogoBackgroundOpacity);
window.addEventListener('resize', updateLogoBackgroundOpacity);
updateLogoBackgroundOpacity();

const heroSlides = document.querySelectorAll('.hero-slide');
let heroSlideIndex = 0;

function rotateHeroSlides() {
  if (!heroSlides.length) return;
  heroSlides[heroSlideIndex].classList.remove('active');
  heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
  heroSlides[heroSlideIndex].classList.add('active');
}

setInterval(rotateHeroSlides, 6500);

const albumData = {
  culto: {
    title: 'Culto Dominical',
    description: 'Todas las imágenes de nuestro culto dominical.',
    images: [
      'imagenes/Culto/WhatsApp Image 2026-05-04 at 7.17.40 PM (1).jpeg',
      'imagenes/Culto/WhatsApp Image 2026-05-04 at 7.17.40 PM (2).jpeg',
      'imagenes/Culto/WhatsApp Image 2026-05-04 at 7.17.40 PM.jpeg',
      'imagenes/Culto/WhatsApp Image 2026-05-04 at 7.17.41 PM (1).jpeg',
      'imagenes/Culto/WhatsApp Image 2026-05-04 at 7.17.41 PM (2).jpeg',
      'imagenes/Culto/WhatsApp Image 2026-05-04 at 7.17.41 PM (3).jpeg',
      'imagenes/Culto/WhatsApp Image 2026-05-04 at 7.17.41 PM (4).jpeg',
      'imagenes/Culto/WhatsApp Image 2026-05-04 at 7.17.41 PM.jpeg'
    ]
  },
  misiones: {
    title: 'Misiones',
    description: 'Imágenes de nuestras actividades de misiones y servicio.',
    images: [
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.46 PM (1).jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.46 PM.jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.47 PM.jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.48 PM.jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.51 PM (1).jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.51 PM (2).jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.51 PM.jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.52 PM (1).jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.52 PM.jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.53 PM (1).jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.53 PM (2).jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.53 PM (3).jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.54 PM.jpeg'
    ]
  },
  jovenes: {
    title: 'Jóvenes',
    description: 'Álbum completo con todas las imágenes de los encuentros juveniles.',
    images: [
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.13 PM.jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.14 PM (1).jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.14 PM.jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.15 PM (1).jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.15 PM (2).jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.15 PM (3).jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.15 PM (4).jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.15 PM (5).jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.15 PM.jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.16 PM (1).jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.16 PM (2).jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.16 PM (3).jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.16 PM.jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.17 PM (1).jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.17 PM (2).jpeg',
      'imagenes/Joevenes/WhatsApp Image 2026-05-04 at 7.35.17 PM.jpeg'
    ]
  },
  proyecto: {
    title: 'Proyecto',
    description: 'Imágenes de los proyectos y actividades de crecimiento comunitario.',
    images: [
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.21.28 PM (1).jpeg',
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.21.28 PM (2).jpeg',
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.21.29 PM (1).jpeg',
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.21.29 PM (2).jpeg',
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.21.29 PM (3).jpeg',
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.21.29 PM.jpeg',
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.21.30 PM (1).jpeg',
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.21.30 PM.jpeg',
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.22.13 PM.jpeg',
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.22.20 PM.jpeg',
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.22.21 PM (1).jpeg',
      'imagenes/proyecto/WhatsApp Image 2026-05-04 at 7.22.21 PM.jpeg'
    ]
  }
};

const albumModal = document.getElementById('albumModal');
const albumModalTitle = document.getElementById('albumModalTitle');
const albumModalSubtitle = document.getElementById('albumModalSubtitle');
const albumModalGrid = document.getElementById('albumModalGrid');
const albumModalClose = document.getElementById('albumModalClose');

function openAlbum(albumKey) {
  const album = albumData[albumKey];
  if (!album || !albumModal || !albumModalTitle || !albumModalSubtitle || !albumModalGrid) return;

  albumModalTitle.textContent = album.title;
  albumModalSubtitle.textContent = album.description;
  albumModalGrid.innerHTML = '';

  album.images.forEach((src) => {
    const item = document.createElement('div');
    item.className = 'overflow-hidden rounded-3xl bg-slate-100';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `${album.title} imagen`;
    img.className = 'w-full h-full object-cover';
    item.appendChild(img);
    albumModalGrid.appendChild(item);
  });

  albumModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeAlbum() {
  if (!albumModal) return;
  albumModal.classList.add('hidden');
  document.body.style.overflow = '';
}

if (albumModalClose) albumModalClose.addEventListener('click', closeAlbum);
if (albumModal) albumModal.addEventListener('click', (event) => {
  if (event.target === albumModal) closeAlbum();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && albumModal && !albumModal.classList.contains('hidden')) {
    closeAlbum();
  }
});

document.querySelectorAll('[data-album]').forEach((button) => {
  button.addEventListener('click', () => openAlbum(button.dataset.album));
});