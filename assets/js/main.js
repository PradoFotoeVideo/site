/**
 * PRADO FOTO & VÍDEO — Main Script
 * Funcionalidades: navegação mobile, galeria automática, abas, lightbox, vídeos
 */

document.addEventListener('DOMContentLoaded', () => {
	
	  // =========================================
  // HERO — SLIDER AUTOMÁTICO
  // =========================================
  const heroSlider = document.getElementById('heroSlider');

  if (heroSlider) {
    const CONFIG_SLIDER = {
      path: 'assets/images/hero-slide/',
      prefix: 'slide (',
      extension: 'jpg',
      max: 5,
      intervalMs: 8000  // 8 segundos por slide
    };

    const slides = [];

    // Tenta carregar slide-1.jpg, slide-2.jpg, etc.
    async function loadSlides() {
      const promises = [];
      for (let i = 1; i <= CONFIG_SLIDER.max; i++) {
        const src = `${CONFIG_SLIDER.path}${CONFIG_SLIDER.prefix}${i}).${CONFIG_SLIDER.extension}`;
        promises.push(
          new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(null);
            setTimeout(() => resolve(null), 3000);
            img.src = src;
          })
        );
      }

      const results = await Promise.all(promises);
      const loaded = results.filter(s => s !== null);
	  loaded.sort(() => Math.random() - 0.5);

      if (loaded.length === 0) {
        // Se não encontrar nenhuma, usa uma cor sólida como fallback
        heroSlider.style.background = '#1A1A1A';
        return;
      }

      // Cria os slides no DOM
      loaded.forEach((src, idx) => {
        const div = document.createElement('div');
        div.className = 'hero-slide';
        if (idx === 0) div.classList.add('active');
        div.style.backgroundImage = `url('${src}')`;
        heroSlider.insertBefore(div, heroSlider.firstChild);
        slides.push(div);
      });

      // Inicia o ciclo
      startSlider();
    }

    let currentSlide = 0;

    function startSlider() {
      setInterval(() => {
        slides[currentSlide]?.classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide]?.classList.add('active');
      }, CONFIG_SLIDER.intervalMs);
    }

    loadSlides();
  }

  // =========================================
  // 1. NAVEGAÇÃO MOBILE
  // =========================================
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
      });
    });
  }

  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dd => {
    const link = dd.querySelector('a');
    if (window.innerWidth <= 768 && link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dd.classList.toggle('open');
        }
      });
    }
  });

  // =========================================
  // 2. CONFIGURAÇÃO DA GALERIA DE FOTOS
  // =========================================
  const CONFIG = {
    // CAMINHO DAS FOTOS: Coloque suas fotos em assets/images/
    // Nomeie como: foto (1).jpg, foto (2).jpg, foto (3).jpg ...
    imagePath: 'assets/images/',
    imagePrefix: 'foto (',      // Prefixo — Windows 11 sugere "foto (1)"
    imageSuffix: ')',            // Fecha o parêntese do nome
    imageExtension: 'jpg',       // Extensão (jpg, png, webp)
    maxImages: 50,               // Máximo de fotos para procurar

    // VÍDEOS: Configure abaixo os links do YouTube
    videos: [
	{ id: 'PC6snMlgx5o', title: 'Barbara & Henrique', date: 'Setembro 2023' },
	{ id: 'IBapF1tVFY0', title: 'Pre-Wedding Receba & Fábio', date: 'Junho 2022' },
	{ id: 'uLsoSJD2FOs', title: 'Letícia & Vhitor', date: 'Dezembro 2024' },
	{ id: 'ChXnyyCiPIs', title: 'David & Mayara', date: 'Fevereiro 2024' },
	{ id: '33Y_EK4UObQ', title: 'Rebeca & Fábio', date: 'Setembro 2022' },
	{ id: 'yan7sjaHUw4', title: 'Ianara & Thiago', date: 'Janeiro 2025' },
	{ id: 'Jt-C9sHe2UY', title: 'Letícia & Vhitor', date: 'Outubro 2023' },
	{ id: 'kOCNkmMSRlQ', title: 'Andressa & Renato', date: 'Janeiro 2023' },
	{ id: 'GPrGZruopMg', title: 'Bruna & Matheus', date: 'Dezembro 2024' },
	{ id: 'NIIwOGdlO3M', title: 'Nathalia & Henrique', date: 'Julho 2022' },
	{ id: 'snwbdrxoHTU', title: 'Vivi & Sandro', date: 'Novembro 2023' },
	{ id: 'xl-fdsO54sc', title: 'Barbara & Henrique', date: 'Novembro 2023' },
	{ id: '2aRooxBq3tQ', title: 'Cris & Gu', date: 'Dezembro 2022' },
	{ id: '34UHiZUetX0', title: 'Natalia & Guilherme', date: 'Maio 2022' }
	
      // Exemplo:
      // { id: 'dQw4w9WgXcQ', title: 'Casamento Ana & João', date: 'Janeiro 2026' },
      //
      // PARA ADICIONAR:
      // 1. Abra o vídeo no YouTube
      // 2. Copie o ID (11 caracteres depois de "v=")
      //    Ex: https://www.youtube.com/watch?v=ABCDEF12345 → ID: ABCDEF12345
      // { id: 'SEU_ID_AQUI', title: 'Título do vídeo', date: 'Mês Ano' },
    ],
  };

  // =========================================
  // 3. CARREGAR GALERIA DE FOTOS
  // =========================================
  const galleryGrid = document.getElementById('galleryGrid');
  let allImages = [];

  if (galleryGrid) {
    loadGallery();
  }

  async function loadGallery() {
    const promises = [];

    // Tenta carregar foto (1).jpg, foto (2).jpg, etc.
    for (let i = 1; i <= CONFIG.maxImages; i++) {
      const imgSrc = `${CONFIG.imagePath}${CONFIG.imagePrefix}${i}${CONFIG.imageSuffix}.${CONFIG.imageExtension}`;
      promises.push(testImage(imgSrc, i));
    }

    const results = await Promise.all(promises);
    allImages = results.filter(r => r.exists).map(r => r.src);

    if (allImages.length === 0) {
      galleryGrid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:60px 0; color:#8A8A8A;">
          <p style="font-size:1.2rem; margin-bottom:8px;">📷 Nenhuma foto encontrada</p>
          <p>Coloque suas imagens em <strong>assets/images/</strong> com o nome <strong>foto (1).jpg</strong>, <strong>foto (2).jpg</strong> e assim por diante.</p>
        </div>
      `;
      return;
    }

    // Embaralha uma vez ao carregar — depois fica estático
    shuffleArray(allImages);
    displayGallery();
  }

  function testImage(src, index) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve({ exists: true, src });
      img.onerror = () => resolve({ exists: false, src: null });
      setTimeout(() => resolve({ exists: false, src: null }), 3000);
      img.src = src;
    });
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function displayGallery() {
    if (allImages.length === 0) return;

    galleryGrid.innerHTML = '';
    allImages.forEach((src, idx) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.style.animationDelay = `${idx * 0.05}s`;
      item.innerHTML = `<img src="${src}" alt="Fotografia de casamento - Prado Foto e Vídeo" loading="lazy">`;

      item.addEventListener('click', () => openLightbox(allImages, idx));

      galleryGrid.appendChild(item);
    });
  }

  // =========================================
  // 4. LIGHTBOX
  // =========================================
  const lightbox = document.getElementById('lightbox');
  let lightboxImages = [];
  let lightboxIndex = 0;

  function openLightbox(images, index) {
    if (!lightbox) return;
    lightboxImages = images;
    lightboxIndex = index;
    lightbox.classList.add('open');
    updateLightboxImage();
  }

  function updateLightboxImage() {
    const img = lightbox.querySelector('.lightbox-img');
    if (img) {
      img.src = lightboxImages[lightboxIndex];
      img.alt = 'Fotografia de casamento - Prado Foto e Vídeo';
    }
  }

  if (lightbox) {
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    closeBtn?.addEventListener('click', () => lightbox.classList.remove('open'));

    prevBtn?.addEventListener('click', () => {
      lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
      updateLightboxImage();
    });

    nextBtn?.addEventListener('click', () => {
      lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
      updateLightboxImage();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowLeft') prevBtn?.click();
      if (e.key === 'ArrowRight') nextBtn?.click();
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }

  // =========================================
  // 5. ABAS DO PORTFÓLIO (Fotos / Vídeos)
  // =========================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabContents.forEach(tc => tc.classList.remove('active'));
      document.getElementById(target)?.classList.add('active');
    });
  });

  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const tabBtn = document.querySelector(`[data-tab="${hash}"]`);
    if (tabBtn) {
      setTimeout(() => {
        tabBtn.click();
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }

  // =========================================
  // 6. CARREGAR VÍDEOS DO YOUTUBE
  // =========================================
  const videoGrid = document.getElementById('videoGrid');

  if (videoGrid && CONFIG.videos.length > 0) {
    loadVideos();
  } else if (videoGrid) {
    videoGrid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:60px 0; color:#8A8A8A;">
        <p style="font-size:1.2rem; margin-bottom:8px;">🎬 Vídeos em breve</p>
        <p>Os vídeos serão exibidos aqui assim que você configurar os links no arquivo <strong>main.js</strong>.</p>
      </div>
    `;
  }

  function loadVideos() {
	CONFIG.videos.sort(() => Math.random() - 0.5);
	videoGrid.innerHTML = '';
    CONFIG.videos.forEach(video => {
      const item = document.createElement('div');
      item.className = 'video-item';
      item.innerHTML = `
        <div class="video-thumb" data-video-url="https://www.youtube.com/watch?v=${video.id}">
          <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.title}" loading="lazy">
          <div class="video-play">▶</div>
        </div>
        <div class="video-info">
          <h3>${video.title}</h3>
          <p>${video.date || ''}</p>
        </div>
      `;
      const thumb = item.querySelector('.video-thumb');
      thumb.addEventListener('click', () => {
        window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
      });
      videoGrid.appendChild(item);
    });
  }

  // =========================================
  // 7. PLAYER DE VÍDEO MODAL
  // =========================================
  let videoModal = document.querySelector('.video-player-modal');

  function openVideoPlayer(videoId) {
    if (!videoModal) {
      videoModal = document.createElement('div');
      videoModal.className = 'video-player-modal';
      videoModal.innerHTML = `
        <button class="video-player-close">&times;</button>
        <iframe src="" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      `;
      document.body.appendChild(videoModal);

      videoModal.querySelector('.video-player-close').addEventListener('click', closeVideoPlayer);
      videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeVideoPlayer();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('open')) closeVideoPlayer();
      });
    }

    const iframe = videoModal.querySelector('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    videoModal.classList.add('open');
  }

  function closeVideoPlayer() {
    if (!videoModal) return;
    videoModal.classList.remove('open');
    const iframe = videoModal.querySelector('iframe');
    iframe.src = '';
  }

});