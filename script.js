// Datos configurables
const config = {
  church_name: 'Casa del Alfarero',
  welcome_text: 'Un lugar donde Dios transforma vidas',
  service_sunday: 'Domingos 9:20 AM',
  service_wednesday: 'Jueves 6:20 PM',
  pastor_name: 'Pastor : Pedro Gutierrez Guadamuz',
  address_text: 'Del tanque de la policia 1c.s,'
};

// Efecto hover táctil en móviles: resalta mientras deslizas el dedo
const touchHoverSelectors = [
  'a', 'button', 'h1', 'h2', 'h3', 'h4', 'p', 'span', 'i', 'strong', 'em', 'label',
  '.bank-card', '.hero-item', '.verse-box', '.contact-link', '.folder-card', '.payment-card',
  '[data-album]' // Add this to make folder cards work with touch hover
];

let activeTouchHoveredElements = new Set();
let isUpdatingTouch = false;

function clearTouchHoverClasses() {
  activeTouchHoveredElements.forEach((element) => element.classList.remove('touch-hover'));
  activeTouchHoveredElements.clear();
}

function updateTouchHoverAtPoint(x, y) {
  if (isUpdatingTouch) return;
  isUpdatingTouch = true;

  requestAnimationFrame(() => {
    clearTouchHoverClasses();
    const touchedElement = document.elementFromPoint(x, y);
    if (!touchedElement) {
      isUpdatingTouch = false;
      return;
    }

    let node = touchedElement;
    while (node && node !== document.body && node !== document.documentElement) {
      if (touchHoverSelectors.some((selector) => node.matches(selector))) {
        node.classList.add('touch-hover');
        activeTouchHoveredElements.add(node);
      }
      node = node.parentElement;
    }
    isUpdatingTouch = false;
  });
}

function setupTouchHover() {
  document.addEventListener('touchstart', (event) => {
    if (!event.touches.length) return;
    updateTouchHoverAtPoint(event.touches[0].clientX, event.touches[0].clientY);
  }, { passive: true });

  document.addEventListener('touchmove', (event) => {
    if (!event.touches.length) return;
    updateTouchHoverAtPoint(event.touches[0].clientX, event.touches[0].clientY);
  }, { passive: true });

  document.addEventListener('touchend', clearTouchHoverClasses, { passive: true });
  document.addEventListener('touchcancel', clearTouchHoverClasses, { passive: true });
}

// Método para obtener y reproducir música cristiana que rota cada 24 horas
function setupDailyMusic() {
  const musicIframe = document.getElementById('daily-video-iframe');
  if (!musicIframe) return;

  // Lista de 13 videos que rota cada 24 horas
  const dailyVideoUrls = [
    'https://youtu.be/iOCCVPepUb8?list=RDiOCCVPepUb8',
    'https://youtu.be/oBEfGAncGMw?list=RDoBEfGAncGMw',
    'https://youtu.be/4cHCCwZAzFQ?list=RD4cHCCwZAzFQ',
    'https://youtu.be/whB-i-WzaT4?list=RDwhB-i-WzaT4',
    'https://youtu.be/8fbVpCJw4Uk?list=RD8fbVpCJw4Uk',
    'https://youtu.be/NNaPxaoWxXY?list=RDNNaPxaoWxXY',
    'https://youtu.be/62s5KwvzSu4?list=RD62s5KwvzSu4',
    'https://youtu.be/RElljP4oWgk?list=RDRElljP4oWgk',
    'https://youtu.be/HjHJECAcb6U?list=RDHjHJECAcb6U',
    'https://youtu.be/lfkUcWjFmmw?list=RDlfkUcWjFmmw',
    'https://youtu.be/_fv911yDsIs?list=RD_fv911yDsIs',
    'https://youtu.be/HNQ2GNoS7oQ?list=RDHNQ2GNoS7oQ',
    'https://youtu.be/AFz-n95cW54?list=RDAFz-n95cW54'
  ];

  // Calcular índice basado en días transcurridos desde epoch
  const dayTimestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Días desde 1 Enero 1970
  const videoIndex = dayTimestamp % dailyVideoUrls.length;
  const selectedVideoUrl = dailyVideoUrls[videoIndex];
  const urlParams = new URLSearchParams(new URL(selectedVideoUrl).search);
  const selectedVideoId = new URL(selectedVideoUrl).pathname.split('/').pop();

  // URL embebible con parámetros para autoplay y recomendaciones
  const finalUrl = `https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&mute=1&modestbranding=1&playsinline=1&rel=0`;
  if (musicIframe.src !== finalUrl) {
    musicIframe.src = finalUrl;
  }
}


// --- Lógica de la Biblia ---

async function searchBibleVerse() {
  const input = document.getElementById('bible-search-input');
  const resultsDiv = document.getElementById('search-results');
  const versionComparer = document.getElementById('version-comparer');
  const webView = document.getElementById('bible-web-view');
  const externalIframe = document.getElementById('bible-external-iframe');
  const externalLink = document.getElementById('bg-external-link');
  
  const originalQuery = input.value.trim();
  if (!originalQuery) return;

  resultsDiv.classList.remove('hidden');
  resultsDiv.innerHTML = '<div class="flex justify-center"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div></div>';

  // 1. Integrar BibleGateway de forma interna (Iframe + Link de respaldo)
  // Usamos el formato de URL que proporcionaste: search=CITA&version=RVR1960
  const bgUrl = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(originalQuery)}&version=RVR1960`;
  if (externalIframe) externalIframe.src = bgUrl;
  if (externalLink) externalLink.href = bgUrl;
  if (webView) webView.classList.remove('hidden');

  // Mapa de libros para traducir de Español a Inglés (requerido por la API estable)
  const bookMap = {
    'genesis': 'genesis', 'exodo': 'exodus', 'levitico': 'leviticus', 'numeros': 'numbers', 'deuteronomio': 'deuteronomy',
    'josue': 'joshua', 'jueces': 'judges', 'rut': 'ruth', '1 samuel': '1 samuel', '2 samuel': '2 samuel',
    '1 reyes': '1 kings', '2 reyes': '2 kings', '1 cronicas': '1 chronicles', '2 cronicas': '2 chronicles',
    'esdras': 'ezra', 'nehemias': 'nehemiah', 'ester': 'esther', 'job': 'job', 'salmos': 'psalms', 'salmo': 'psalms',
    'proverbios': 'proverbs', 'eclesiastes': 'ecclesiastes', 'cantares': 'song of solomon', 'isaias': 'isaiah',
    'jeremias': 'jeremiah', 'lamentaciones': 'lamentations', 'ezequiel': 'ezekiel', 'daniel': 'daniel',
    'oseas': 'hosea', 'joel': 'joel', 'amos': 'amos', 'abdias': 'obadiah', 'jonas': 'jonah', 'miqueas': 'micah',
    'nahum': 'nahum', 'habacuc': 'habakkuk', 'sofonias': 'zephaniah', 'hageo': 'haggai', 'zacarias': 'zechariah',
    'malaquias': 'malachi', 'mateo': 'matthew', 'marcos': 'mark', 'lucas': 'luke', 'juan': 'john', 'hechos': 'acts',
    'romanos': 'romans', '1 corintios': '1 corinthians', '2 corintios': '2 corinthians', 'galatas': 'galatians',
    'efesios': 'ephesians', 'filipenses': 'philippians', 'colosenses': 'colossians', '1 tesalonicenses': '1 letters',
    '2 tesalonicenses': '2 thessalonians', '1 timoteo': '1 timothy', '2 timoteo': '2 timothy', 'tito': 'titus',
    'filemon': 'philemon', 'hebreos': 'hebrews', 'santiago': 'james', '1 pedro': '1 peter', '2 pedro': '2 peter',
    '1 juan': '1 john', '2 juan': '2 john', '3 juan': '3 john', 'judas': 'jude', 'apocalipsis': 'revelation', 'revelacion': 'revelation'
  };

  // Normalizar la búsqueda
  let normalizedQuery = originalQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Reemplazar el nombre del libro en español por el de inglés para la API
  for (const [esp, eng] of Object.entries(bookMap)) {
    if (normalizedQuery.startsWith(esp)) {
      normalizedQuery = normalizedQuery.replace(esp, eng);
      break;
    }
  }

  try {
    // Usamos bible-api.com con rvr1960. Es la más rápida y no tiene bloqueos de conexión.
    const response = await fetch(`https://bible-api.com/${encodeURIComponent(normalizedQuery)}?translation=rvr1960`);
    
    if (!response.ok) throw new Error('Cita no encontrada');
    
    const data = await response.json();
    versionComparer.classList.remove('hidden');
    
    // Limpiar texto y formatear referencia
    const textClean = data.text.trim().replace(/\n/g, ' ');
    const reference = data.reference;
    
    let versesHtml = `
      <div class="text-left animate-fade-up w-full">
        <div class="p-10 md:p-24 bg-white rounded-none border-l-[24px] border-yellow-500 shadow-none flex flex-col md:flex-row md:items-center gap-12 md:gap-24 w-full min-h-[50vh]">
          <h4 class="font-black text-[#1a1a2e] text-5xl md:text-9xl tracking-tighter whitespace-nowrap leading-none">${reference}</h4>
          <p class="text-gray-900 text-4xl md:text-7xl leading-tight font-bold italic flex-1">"${textClean}"</p>
        </div>
      </div>`;
    
    resultsDiv.innerHTML = versesHtml;
  } catch (error) {
    console.error('Bible Search Error:', error);
    // Ocultamos el contenedor de resultados de texto para que solo se vea el visor de BibleGateway de abajo
    resultsDiv.classList.add('hidden');
    versionComparer.classList.add('hidden');
  }
}

function openExternalBible(version) {
  const input = document.getElementById('bible-search-input').value;
  if (!input) return;
  const externalIframe = document.getElementById('bible-external-iframe');
  const webView = document.getElementById('bible-web-view');
  
  if (externalIframe) {
    externalIframe.src = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(input)}&version=${version}`;
    if (webView) {
      webView.classList.remove('hidden');
      webView.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
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
    if (translation) element.innerHTML = translation;
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
  setupTouchHover();
  setupDailyMusic();

  // Inicializar iconos de Lucide si la librería está cargada
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Selector de idiomas (escritorio)
  const languageBtn = document.getElementById('language-btn');
  const languageMenu = document.getElementById('language-menu');
  const sectionsBtn = document.getElementById('sections-btn');
  const sectionsMenu = document.getElementById('sections-menu');

  if (languageBtn && languageMenu) {
    languageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      languageMenu.classList.toggle('hidden');
      if (sectionsMenu) sectionsMenu.classList.add('hidden');
    });
  }

  if (sectionsBtn && sectionsMenu) {
    sectionsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sectionsMenu.classList.toggle('hidden');
      sectionsMenu.classList.toggle('flex');
      if (languageMenu) languageMenu.classList.add('hidden');
    });
  }

  document.addEventListener('click', (e) => {
    if (languageMenu && !languageMenu.classList.contains('hidden') && !languageBtn.contains(e.target) && !languageMenu.contains(e.target)) {
      languageMenu.classList.add('hidden');
    }
    if (sectionsMenu && !sectionsMenu.classList.contains('hidden') && !sectionsBtn.contains(e.target) && !sectionsMenu.contains(e.target)) {
      sectionsMenu.classList.add('hidden');
      sectionsMenu.classList.remove('flex');
    }
  });
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
      'imagenes/Misiones/WhatsApp Image 2026-05-04 at 7.27.54 PM.jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-22 at 10.16.32 AM (1).jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-22 at 10.16.32 AM (2).jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-22 at 10.16.32 AM.jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-22 at 10.16.33 AM (1).jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-22 at 10.16.33 AM (2).jpeg',
      'imagenes/Misiones/WhatsApp Image 2026-05-22 at 10.16.33 AM.jpeg'
       
      // Agrega aquí las nuevas imágenes de Misiones siguiendo el formato:
      // 'imagenes/Misiones/Nombre del nuevo archivo.jpeg',
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
    title: 'Proyectos a Futuro',
    description: 'Imágenes de los avances y planos de la construcción de nuestra iglesia.',
    images: [
      'imagenes/proyectos-iglesia/WhatsApp Image 2026-05-21 at 4.24.35 PM.jpeg',
      'imagenes/proyectos-iglesia/WhatsApp Image 2026-05-22 at 7.17.20 AM.jpeg',
      'imagenes/proyectos-iglesia/WhatsApp Image 2026-05-22 at 7.17.43 AM.jpeg'
    ]
  },
  cdi: {
    title: 'CDI - Ovejitas de jesus',
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
  },
  'congreso-damas': {
    title: 'Congreso Damas',
    description: 'Galería de fotos del Congreso de Damas: momentos de fe y compañerismo.',
    images: [
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.22.54 AM.jpeg',
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.22.55 AM.jpeg',
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.22.56 AM (1).jpeg',
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.22.56 AM (2).jpeg',
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.22.56 AM.jpeg',
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.26.51 AM (1).jpeg',
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.26.51 AM.jpeg',
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.26.52 AM (1).jpeg',
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.26.53 AM (1).jpeg',
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.26.53 AM.jpeg',
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.26.53 AM (3).jpeg',
      'imagenes/congresodamas/WhatsApp Image 2026-05-22 at 9.26.53 AM (2).jpeg'
      // Pega aquí el resto de imágenes de la carpeta 'congreso damas'
    ]
  },
  'congreso-matrimonios': {
    title: 'Congreso Matrimonios',
    description: 'Recuerdos de nuestro encuentro para matrimonios y familias.',
    images: [
      'imagenes/congresomatrimonios/WhatsApp Image 2026-05-22 at 9.00.16 AM (1).jpeg',
      'imagenes/congresomatrimonios/WhatsApp Image 2026-05-22 at 9.00.16 AM (2).jpeg',
      'imagenes/congresomatrimonios/WhatsApp Image 2026-05-22 at 9.00.16 AM.jpeg',
      'imagenes/congresomatrimonios/WhatsApp Image 2026-05-22 at 9.00.17 AM.jpeg',
      'imagenes/congresomatrimonios/WhatsApp Image 2026-05-22 at 9.15.30 AM (1).jpeg',
      'imagenes/congresomatrimonios/WhatsApp Image 2026-05-22 at 9.15.30 AM.jpeg',
      'imagenes/congresomatrimonios/WhatsApp Image 2026-05-22 at 9.15.31 AM.jpeg'
      // Pega aquí el resto de imágenes de la carpeta 'congreso matriminios'
    ]
  },
   'campo': {
     title: 'Campo',
     description: 'Imágenes de nuestras salidas y actividades recreativas al aire libre.',
     images: [
       'imagenes/campo/WhatsApp Image 2026-05-24 at 4.11.17 PM (1).jpeg',
       'imagenes/campo/WhatsApp Image 2026-05-24 at 4.11.17 PM (2).jpeg',
       'imagenes/campo/WhatsApp Image 2026-05-24 at 4.11.17 PM.jpeg',
       'imagenes/campo/WhatsApp Image 2026-05-24 at 4.11.18 PM.jpeg'
       // Pega aquí el resto de imágenes de la carpeta 'campo'
     ]
   },
   'pastorpedro': {
     title: 'Pastor Pedro',
     description: 'Galería de fotos del Pastor Pedro Gutierrez Guadamuz.',
     images: [
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.36 PM (2).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.36 PM (1).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.36 PM.jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.35 PM (3).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.35 PM (2).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.35 PM (1).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.35 PM.jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.34 PM (4).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.34 PM (3).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.34 PM (2).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.34 PM (1).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.34 PM.jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.33 PM (1).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.33 PM.jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.21 PM.jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.20 PM (1).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.20 PM.jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.19 PM (1).jpeg',
       'imagenes/Pastor-pedro/WhatsApp Image 2026-05-29 at 9.58.19 PM.jpeg'
     ]
   }
 };

const albumModal = document.getElementById('albumModal');
const albumModalTitle = document.getElementById('albumModalTitle');
const albumModalSubtitle = document.getElementById('albumModalSubtitle');
const albumModalGrid = document.getElementById('albumModalGrid');
const albumModalClose = document.getElementById('albumModalClose');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openAlbum(albumKey) {
  const album = albumData[albumKey];
  if (!album || !albumModal || !albumModalTitle || !albumModalSubtitle || !albumModalGrid) return;

  albumModalTitle.textContent = album.title;
  albumModalSubtitle.textContent = album.description;
  albumModalGrid.innerHTML = '';

  if (!album.images || !album.images.length) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'rounded-3xl bg-slate-100 p-10 text-center text-gray-500';
    emptyMessage.textContent = 'En proceso';
    albumModalGrid.appendChild(emptyMessage);
  } else {
    album.images.forEach((src) => {
      const item = document.createElement('div');
      item.className = 'overflow-hidden rounded-3xl bg-slate-100';
      const img = document.createElement('img');
      img.src = src;
      img.alt = `${album.title} imagen`;
      img.className = 'w-full h-full object-cover';
      img.onclick = () => openLightbox(src);
      item.appendChild(img);
      albumModalGrid.appendChild(item);
    });
  }

  albumModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeAlbum() {
  if (!albumModal) return;
  albumModal.classList.add('hidden');
  document.body.style.overflow = '';
}

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.classList.remove('scale-[2]', 'cursor-zoom-out');
  lightbox.classList.remove('hidden');
  lightbox.classList.add('flex');
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.add('hidden');
  lightbox.classList.remove('flex');
}

if (lightboxImg) {
  lightboxImg.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita que el clic cierre el lightbox
    lightboxImg.classList.toggle('scale-[2]');
    lightboxImg.classList.toggle('cursor-zoom-out');
  });
}

if (lightbox) lightbox.addEventListener('click', closeLightbox);
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

if (albumModalClose) albumModalClose.addEventListener('click', closeAlbum);
if (albumModal) albumModal.addEventListener('click', (event) => {
  if (event.target === albumModal) closeAlbum();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && albumModal && !albumModal.classList.contains('hidden')) {
    closeAlbum();
  }
  if (event.key === 'Escape' && lightbox && !lightbox.classList.contains('hidden')) {
    closeLightbox();
  }
});

document.querySelectorAll('[data-album]').forEach((button) => {
  button.addEventListener('click', () => openAlbum(button.dataset.album));
});