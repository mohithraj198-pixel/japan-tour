/**
 * JAPAN TOURS • LUXURY CLIENT-FACING APPLICATION JAVASCRIPT
 * Optics, Physics, Web Audio & Lightbox Engine
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. REAL-TIME JST (JAPAN STANDARD TIME) CLOCK TICKER
  // =========================================================================
  function initJSTClock() {
    const clockEl = document.getElementById('jstClockTicker');
    if (!clockEl) return;

    function update() {
      const now = new Date();
      // Format time in Tokyo time zone (UTC+9)
      const options = {
        timeZone: 'Asia/Tokyo',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      clockEl.textContent = `${formatter.format(now)} JST`;
    }

    update();
    setInterval(update, 1000);
  }

  // =========================================================================
  // 2. 300-FRAME IMAGE SEQUENCE FIXED CANVAS SCROLL ENGINE
  // =========================================================================
  function initScrollAnimation() {
    const canvas = document.getElementById('animation-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    const TOTAL_FRAMES = 300;
    const images = [];
    let loadedCount = 0;
    let targetProgress = 0;
    let currentProgress = 0;
    let lastRenderedFrame = -1;

    function getFrameSrc(index) {
      const num = String(index + 1).padStart(3, '0');
      return `ezgif-frame-${num}.jpg`;
    }

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      lastRenderedFrame = -1;
      renderFrame(getCurrentFrameIndex());
    }

    function updateTargetFromScroll() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) {
        targetProgress = 0;
      } else {
        targetProgress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      }
    }

    function getCurrentFrameIndex() {
      return Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(currentProgress * (TOTAL_FRAMES - 1))));
    }

    function renderFrame(frameIndex) {
      if (frameIndex === lastRenderedFrame) return;
      const img = images[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Center crop cover
      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) / 2;

      ctx.drawImage(img, sx, sy, sw, sh);
      lastRenderedFrame = frameIndex;
    }

    function tick() {
      const lerpFactor = 0.12;
      const diff = targetProgress - currentProgress;

      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * lerpFactor;
        const frameToRender = getCurrentFrameIndex();
        renderFrame(frameToRender);
      } else if (currentProgress !== targetProgress) {
        currentProgress = targetProgress;
        renderFrame(getCurrentFrameIndex());
      }

      requestAnimationFrame(tick);
    }

    function initImages() {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFrameSrc(i);
        img.onload = function () {
          loadedCount++;
          if (lastRenderedFrame === -1 || getCurrentFrameIndex() === i) {
            renderFrame(getCurrentFrameIndex());
          }
        };
        images.push(img);
      }
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', updateTargetFromScroll, { passive: true });

    resizeCanvas();
    initImages();
    updateTargetFromScroll();
    requestAnimationFrame(tick);
  }

  // =========================================================================
  // 3. DYNAMIC CURSOR SPOTLIGHT (Disabled on Touch)
  // =========================================================================
  function initSpotlight() {
    const spotlight = document.getElementById('cursor-spotlight');
    if (!spotlight) return;

    const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    if (isTouch) {
      spotlight.style.display = 'none';
      return;
    }

    window.addEventListener('mousemove', (e) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    });
  }

  // =========================================================================
  // 4. ADVANCED 3D PERSPECTIVE ROTATOR ENGINE WITH MOBILE HARMONIC FALLBACK
  // =========================================================================
  class RotatorFollower {
    constructor({ containerId, targetId, readoutId, maxTilt = 22, rotMultiplier = 1, onSpeedChange = null }) {
      this.container = document.getElementById(containerId);
      this.target = document.getElementById(targetId);
      this.readout = document.getElementById(readoutId);
      this.maxTilt = maxTilt;
      this.rotMultiplier = rotMultiplier;
      this.onSpeedChange = onSpeedChange;

      this.currentRotateZ = 0;
      this.targetRotateZ = 0;
      this.currentTiltX = 0;
      this.targetTiltX = 0;
      this.currentTiltY = 0;
      this.targetTiltY = 0;
      this.currentScale = 1;
      this.targetScale = 1;

      this.lastX = 0;
      this.lastY = 0;
      this.cursorSpeed = 0;
      this.isHovered = false;

      // Touch & coarse pointer performance check
      this.isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;

      this.init();
    }

    init() {
      if (!this.container || !this.target) return;

      if (!this.isTouch) {
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        this.container.addEventListener('mouseenter', () => {
          this.isHovered = true;
          this.targetScale = 1.06;
        });

        this.container.addEventListener('mouseleave', () => {
          this.isHovered = false;
          this.targetScale = 1.0;
          this.targetTiltX = 0;
          this.targetTiltY = 0;
        });
      } else {
        // Touch device fallback: fluid interactive taps without mousemove overhead
        this.container.addEventListener('touchstart', () => {
          this.targetScale = 1.08;
          this.targetRotateZ += 30;
          setTimeout(() => { this.targetScale = 1.0; }, 260);
        }, { passive: true });
      }

      this.animateLoop();
    }

    handleMouseMove(e) {
      const rect = this.container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      const moveDist = Math.hypot(e.clientX - this.lastX, e.clientY - this.lastY);
      this.cursorSpeed = Math.min(moveDist * 0.5, 40);
      this.lastX = e.clientX;
      this.lastY = e.clientY;

      if (distance < 900) {
        let angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
        if (angleDeg < 0) angleDeg += 360;

        let diff = (angleDeg - (this.targetRotateZ % 360));
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;
        this.targetRotateZ += diff * this.rotMultiplier;

        const normX = Math.max(-1, Math.min(1, dx / (rect.width * 1.5)));
        const normY = Math.max(-1, Math.min(1, dy / (rect.height * 1.5)));

        this.targetTiltX = -normY * this.maxTilt;
        this.targetTiltY = normX * this.maxTilt;

        if (this.onSpeedChange) {
          this.onSpeedChange(distance, this.cursorSpeed);
        }
      }
    }

    animateLoop() {
      if (this.isTouch) {
        // 60fps continuous subtle harmonic oscillation floating loop on mobile
        const t = performance.now() * 0.0012;
        this.targetTiltX = Math.sin(t * 0.8) * (this.maxTilt * 0.45);
        this.targetTiltY = Math.cos(t * 0.6) * (this.maxTilt * 0.45);
        this.targetRotateZ += 0.22;
        this.targetScale = 1.0 + Math.sin(t * 1.5) * 0.03;
      }

      const lerpFactor = 0.09;
      this.currentRotateZ += (this.targetRotateZ - this.currentRotateZ) * lerpFactor;
      this.currentTiltX += (this.targetTiltX - this.currentTiltX) * lerpFactor;
      this.currentTiltY += (this.targetTiltY - this.currentTiltY) * lerpFactor;
      this.currentScale += (this.targetScale - this.currentScale) * lerpFactor;

      this.target.style.transform = `perspective(1000px) rotateX(${this.currentTiltX.toFixed(2)}deg) rotateY(${this.currentTiltY.toFixed(2)}deg) rotateZ(${this.currentRotateZ.toFixed(2)}deg) scale3d(${this.currentScale.toFixed(3)}, ${this.currentScale.toFixed(3)}, ${this.currentScale.toFixed(3)})`;

      if (this.readout) {
        let normalized = Math.round(this.currentRotateZ % 360);
        if (normalized < 0) normalized += 360;
        this.readout.textContent = `${normalized}°`;
      }

      requestAnimationFrame(() => this.animateLoop());
    }
  }

  // =========================================================================
  // 5. CLICK BURST & ENERGY PULSES
  // =========================================================================
  let vortexRotator = null;
  let flameRotator = null;

  window.triggerOrbBurst = function (e) {
    const ring = document.getElementById('vortexShockwave');
    const target = document.getElementById('vortexTarget');
    if (!ring || !target || !vortexRotator) return;

    ring.classList.remove('shockwave-active');
    void ring.offsetWidth;
    ring.classList.add('shockwave-active');

    target.style.transition = 'transform 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    vortexRotator.targetScale = 1.18;
    vortexRotator.targetRotateZ += 45;

    setTimeout(() => {
      target.style.transition = '';
      vortexRotator.targetScale = 1.0;
    }, 180);

    playHapticTone(784.00);
  };

  window.triggerFlameBurst = function (e) {
    const ring = document.getElementById('flameShockwave');
    const target = document.getElementById('flameTarget');
    if (!ring || !target || !flameRotator) return;

    ring.classList.remove('shockwave-active');
    void ring.offsetWidth;
    ring.classList.add('shockwave-active');

    flameRotator.targetScale = 1.15;
    flameRotator.targetRotateZ += 30;

    setTimeout(() => {
      flameRotator.targetScale = 1.0;
    }, 180);

    playHapticTone(659.25);
  };

  // =========================================================================
  // 6. HERO SLIDE CONTROLS
  // =========================================================================
  const heroCities = ['OSAKA', 'KYOTO', 'TOKYO'];
  let currentHeroIndex = 0;

  function updateHeroSlide() {
    const indicator = document.getElementById('heroSlideIndicator');
    if (indicator) {
      indicator.textContent = `0${currentHeroIndex + 1} / 03`;
    }
  }

  window.nextHeroSlide = function () {
    currentHeroIndex = (currentHeroIndex + 1) % heroCities.length;
    updateHeroSlide();
    playHapticTone(523.25);
  };

  window.prevHeroSlide = function () {
    currentHeroIndex = (currentHeroIndex - 1 + heroCities.length) % heroCities.length;
    updateHeroSlide();
    playHapticTone(440.00);
  };

  // =========================================================================
  // 7. ITINERARY ACCORDION TOGGLE (A-01 to D-04)
  // =========================================================================
  window.toggleProcessRow = function (stepId) {
    const el = document.getElementById(stepId);
    if (!el) return;

    const icon = document.getElementById(`icon-${stepId}`);
    const isOpen = el.style.maxHeight && el.style.maxHeight !== '0px';

    // Close all rows
    ['step-1', 'step-2', 'step-3', 'step-4'].forEach(sId => {
      const row = document.getElementById(sId);
      const iconContainer = document.getElementById(`icon-${sId}`);
      if (row) {
        row.style.maxHeight = '0px';
        row.style.opacity = '0';
      }
      if (iconContainer) {
        iconContainer.innerHTML = `<i data-lucide="plus" class="w-4 h-4"></i>`;
      }
    });

    if (!isOpen) {
      el.style.maxHeight = '950px';
      el.style.opacity = '1';
      if (icon) {
        icon.innerHTML = `<i data-lucide="minus" class="w-4 h-4"></i>`;
      }
      playHapticTone(493.88);
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  };

  // =========================================================================
  // 8. BOOKING DRAWER & PRICE ESTIMATOR MODAL
  // =========================================================================
  let currentSeasonPrice = 3450;
  let guestCount = 1;

  window.openBookingDrawer = function () {
    const modal = document.getElementById('bookingModal');
    const card = document.getElementById('bookingCard');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (card) {
      card.classList.remove('modal-exit');
      card.classList.add('modal-enter');
    }
    document.body.style.overflow = 'hidden';
    recalcPrice();
    playHapticTone(523.25);
  };

  window.closeBookingDrawer = function () {
    const modal = document.getElementById('bookingModal');
    const card = document.getElementById('bookingCard');
    if (!modal || modal.classList.contains('hidden')) return;

    if (card) {
      card.classList.remove('modal-enter');
      card.classList.add('modal-exit');
    }
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      if (card) card.classList.remove('modal-exit');
      document.body.style.overflow = '';
    }, 220);
  };

  window.setSeason = function (season, price) {
    currentSeasonPrice = price;
    const autumn = document.getElementById('seasonBtnAutumn');
    const spring = document.getElementById('seasonBtnSpring');

    if (season === 'autumn') {
      if (autumn) autumn.className = "p-3.5 rounded-2xl border border-white bg-white/10 text-left transition-all";
      if (spring) spring.className = "p-3.5 rounded-2xl border border-white/20 bg-black text-left hover:border-white/50 transition-all";
    } else {
      if (spring) spring.className = "p-3.5 rounded-2xl border border-white bg-white/10 text-left transition-all";
      if (autumn) autumn.className = "p-3.5 rounded-2xl border border-white/20 bg-black text-left hover:border-white/50 transition-all";
    }
    recalcPrice();
    playHapticTone(587.33);
  };

  window.updateGuests = function (delta) {
    guestCount = Math.max(1, Math.min(6, guestCount + delta));
    const label = document.getElementById('guestCount');
    if (label) label.textContent = guestCount;
    recalcPrice();
    playHapticTone(659.25);
  };

  function recalcPrice() {
    const total = currentSeasonPrice * guestCount;
    const rateEl = document.getElementById('rateLabel');
    const totalEl = document.getElementById('totalPriceLabel');
    if (rateEl) rateEl.textContent = `$${currentSeasonPrice.toLocaleString()} × ${guestCount}`;
    if (totalEl) totalEl.textContent = `$${total.toLocaleString()} USD`;
  }

  window.submitReservation = function () {
    closeBookingDrawer();
    const toast = document.getElementById('formToast');
    if (toast) {
      toast.classList.remove('hidden');
      toast.scrollIntoView({ behavior: 'smooth' });
    }
    playHapticTone(880.00);
  };

  // =========================================================================
  // 9. INCLUSIONS MODAL
  // =========================================================================
  window.showIncludedInfo = function (title, description) {
    const modal = document.getElementById('infoModal');
    const card = document.getElementById('infoCard');
    const titleEl = document.getElementById('infoTitle');
    const contentEl = document.getElementById('infoContent');

    if (titleEl) titleEl.textContent = title;
    if (contentEl) contentEl.textContent = description;

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      if (card) {
        card.classList.remove('modal-exit');
        card.classList.add('modal-enter');
      }
      document.body.style.overflow = 'hidden';
    }

    if (window.lucide) lucide.createIcons();
    playHapticTone(587.33);
  };

  window.closeInfoModal = function () {
    const modal = document.getElementById('infoModal');
    const card = document.getElementById('infoCard');
    if (!modal || modal.classList.contains('hidden')) return;

    if (card) {
      card.classList.remove('modal-enter');
      card.classList.add('modal-exit');
    }
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      if (card) card.classList.remove('modal-exit');
      document.body.style.overflow = '';
    }, 220);
  };

  // =========================================================================
  // 10. CONTACT FORM SUBMISSION
  // =========================================================================
  window.handleFormSubmit = function (e) {
    e.preventDefault();
    const btn = document.getElementById('submitFormBtn');
    const toast = document.getElementById('formToast');

    if (btn) {
      btn.innerHTML = `<span>Sending...</span>`;
      btn.disabled = true;
    }

    playHapticTone(659.25);

    setTimeout(() => {
      if (toast) toast.classList.remove('hidden');
      if (btn) {
        btn.innerHTML = `<span>Sent ✓</span>`;
      }
      const form = document.getElementById('requestForm');
      if (form) form.reset();
      playHapticTone(784.00);
    }, 600);
  };

  // =========================================================================
  // 11. WEB AUDIO API ZEN SYNTHESIZER & HAPTIC EFFECTS
  // =========================================================================
  let audioCtx = null;
  let isPlaying = false;
  let zenTimer = null;

  function playHapticTone(freq = 587.33) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (e) {}
  }

  window.playHapticTone = playHapticTone;

  window.toggleZenAudio = function () {
    const icon = document.getElementById('zenAudioIcon');
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (isPlaying) {
      isPlaying = false;
      clearInterval(zenTimer);
      if (icon) icon.setAttribute('data-lucide', 'volume-x');
    } else {
      isPlaying = true;
      audioCtx.resume();
      if (icon) icon.setAttribute('data-lucide', 'volume-2');
      playZenNote();
      zenTimer = setInterval(playZenNote, 3200);
    }
    if (window.lucide) lucide.createIcons();
  };

  function playZenNote() {
    if (!isPlaying || !audioCtx) return;
    const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.0);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 3.2);
  }

  // =========================================================================
  // 12. INTERACTIVE LUXURY PHOTO LIGHTBOX ENGINE
  // =========================================================================
  const photoData = {
    'hero-kimono': {
      src: 'assets/images/hero-kimono-fuji.jpg',
      tag: 'Yamanashi • Dawn Valley',
      title: 'Tranquility in Silk: Dawn Over Mount Fuji',
      description: 'Witness the first light of day illuminating Mount Fuji as morning mist winds through the tranquil valleys. Dressed in authentic silk kimono with hand-embroidered cherry blossom motifs, you will experience an intimate tea meditation overlooking Japan’s sacred mountain away from the crowds.',
      specs: [
        { label: 'Recommended Time', val: 'Early Morning (2–3 Hours)' },
        { label: 'Included Privileges', val: 'Private Tea Master & Kimono Fitting' },
        { label: 'Experience Type', val: 'Mindfulness & Fine-Art Photography' },
        { label: 'Group Access', val: 'Exclusive to Japan Tours Guests' }
      ]
    },
    'tokyo-shibuya': {
      src: 'assets/images/tokyo-shibuya-night.jpg',
      tag: 'Tokyo • Shibuya Metropolis',
      title: 'Neon Odyssey: Shibuya Crossing After Rain',
      description: 'Walk the world’s most iconic intersection under a canopy of vibrant LED billboards reflecting onto rain-slicked asphalt. Accompanied by our local street culture photographer, you’ll discover hidden elevated viewpoints, rooftop bars, and intimate yakitori alleys in Nonbei Yokocho.',
      specs: [
        { label: 'Recommended Time', val: 'Evening / Dusk (3 Hours)' },
        { label: 'Included Privileges', val: 'Private Guide & Rooftop Access Pass' },
        { label: 'Experience Type', val: 'Urban Exploration & Night Photography' },
        { label: 'Group Access', val: 'Reserved VIP Table at Rooftop Lounge' }
      ]
    },
    'fuji-twilight': {
      src: 'assets/images/fuji-twilight-lake.jpg',
      tag: 'Fuji Five Lakes • Lake Kawaguchi',
      title: 'Twilight Solitude: Blue Hour at Lake Kawaguchi',
      description: 'Reflective silence falls across the water as the snow-capped volcanic cone glows softly against the indigo twilight sky. Savor private lakeside Kaiseki dining with seasonal local ingredients while watching the twilight mirrored across the glassy lake surface.',
      specs: [
        { label: 'Recommended Time', val: 'Full Evening Sunset (4 Hours)' },
        { label: 'Included Privileges', val: 'Lakeside Kaiseki Dinner & Luxury Chauffeur' },
        { label: 'Experience Type', val: 'Fine Dining & Scenic Landscape' },
        { label: 'Group Access', val: 'Private Waterfront Pavilion' }
      ]
    },
    'artisan-ramen': {
      src: 'assets/images/artisan-ramen-macro.jpg',
      tag: 'Tokyo & Osaka • Culinary Masters',
      title: 'Artisan Tonkotsu & Michelin Bib Gourmand Ramen',
      description: 'Immerse your senses in Tokyo and Osaka’s most revered ramen bars. Savor 18-hour simmered pork bone broth, tender flame-torched chashu, house-made noodles with tailored chew, and molten ajitsuke tamago eggs with access to exclusive chef counter seating.',
      specs: [
        { label: 'Recommended Time', val: 'Lunch or Dinner (2 Hours)' },
        { label: 'Included Privileges', val: 'Chef Counter Seating & Craft Pairing Drink' },
        { label: 'Experience Type', val: 'Curated Gastronomy & Flavor Profile Walk' },
        { label: 'Group Access', val: 'Skip-The-Line Priority Reservation' }
      ]
    },
    'kyoto-gion': {
      src: 'assets/images/kyoto-gion-lanterns.jpg',
      tag: 'Kyoto • Historic Gion District',
      title: 'Twilight Whispers: Gion Machiya & Paper Lanterns',
      description: 'Stroll along cobblestone pathways between centuries-old dark cedar wooden machiya townhouses as warm amber chochin lanterns flicker awake at dusk. Learn the refined customs of geiko and maiko culture with our licensed Kyoto cultural heritage historian.',
      specs: [
        { label: 'Recommended Time', val: 'Dusk to Twilight (2.5 Hours)' },
        { label: 'Included Privileges', val: 'Heritage Historian & Tea House Invitation' },
        { label: 'Experience Type', val: 'Cultural Heritage & Evening Walk' },
        { label: 'Group Access', val: 'Private Okiya Traditional Visit' }
      ]
    },
    'fushimi-torii': {
      src: 'assets/images/fushimi-torii-editorial.jpg',
      tag: 'Kyoto • Fushimi Inari Taisha',
      title: 'Path of the Kami: Sunrise at Fushimi Inari',
      description: 'Bypass the daytime crowds with an exclusive sunrise expedition through thousands of vivid vermillion Torii gates winding up Mount Inari. Shafts of morning light pierce the sacred cedar forest as priests begin their morning Shinto rituals.',
      specs: [
        { label: 'Recommended Time', val: 'Early Sunrise (3 Hours)' },
        { label: 'Included Privileges', val: 'Private Guide & Shrine Blessing Ceremony' },
        { label: 'Experience Type', val: 'Spiritual Heritage & Nature Hike' },
        { label: 'Group Access', val: 'Early Morning Private Transit' }
      ]
    }
  };

  let activeLightboxKey = null;

  window.openPhotoLightbox = function (photoKey) {
    const data = photoData[photoKey];
    if (!data) return;

    activeLightboxKey = photoKey;
    const modal = document.getElementById('photoLightboxModal');
    const card = document.getElementById('lightboxCard');
    const img = document.getElementById('lightboxImg');
    const tag = document.getElementById('lightboxTag');
    const title = document.getElementById('lightboxTitle');
    const desc = document.getElementById('lightboxDesc');
    const specsContainer = document.getElementById('lightboxSpecs');

    if (img) {
      img.src = data.src;
      img.alt = data.title;
    }
    if (tag) tag.textContent = data.tag;
    if (title) title.textContent = data.title;
    if (desc) desc.textContent = data.description;

    if (specsContainer) {
      specsContainer.innerHTML = data.specs.map(spec => `
        <div class="flex items-center justify-between py-1.5 border-b border-white/5 text-xs">
          <span class="text-white/50 font-mono uppercase tracking-wider text-[10px]">${spec.label}:</span>
          <span class="text-white font-medium text-right">${spec.val}</span>
        </div>
      `).join('');
    }

    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
    if (card) {
      card.classList.remove('lightbox-exit');
      card.classList.add('lightbox-enter');
    }

    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
    playHapticTone(659.25);
  };

  window.closePhotoLightbox = function () {
    const modal = document.getElementById('photoLightboxModal');
    const card = document.getElementById('lightboxCard');
    if (!modal || modal.classList.contains('hidden')) return;

    if (card) {
      card.classList.remove('lightbox-enter');
      card.classList.add('lightbox-exit');
    }

    setTimeout(() => {
      modal.classList.remove('flex');
      modal.classList.add('hidden');
      if (card) card.classList.remove('lightbox-exit');
      document.body.style.overflow = '';
    }, 220);
  };

  window.bookCurrentExperience = function () {
    closePhotoLightbox();
    setTimeout(() => {
      openBookingDrawer();
    }, 240);
  };

  // Global Key Listener for Modal Dismissal (Esc Key)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePhotoLightbox();
      closeBookingDrawer();
      closeInfoModal();
    }
  });

  // =========================================================================
  // 13. DOM READY INITIALIZATION
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Start Tokyo live clock ticker
    initJSTClock();

    // 2. Initialize scroll sequence
    initScrollAnimation();

    // 3. Initialize cursor spotlight
    initSpotlight();

    // 4. Initialize Hero Swirl Vortex Rotator
    vortexRotator = new RotatorFollower({
      containerId: 'vortexInteractiveZone',
      targetId: 'vortexTarget',
      readoutId: 'vortexAngleReadout',
      maxTilt: 24,
      rotMultiplier: 1.0,
      onSpeedChange: (dist, speed) => {
        const halo = document.getElementById('vortexGlowHalo');
        if (halo) {
          const intensity = Math.max(0.2, 0.65 - (dist / 1400) + (speed * 0.015));
          halo.style.opacity = intensity;
        }
      }
    });

    // 5. Initialize About Flame Petal Rotator
    flameRotator = new RotatorFollower({
      containerId: 'flameInteractiveZone',
      targetId: 'flameTarget',
      readoutId: 'flameAngleReadout',
      maxTilt: 18,
      rotMultiplier: 0.65
    });

    // 6. Lucide icons render
    if (window.lucide) {
      lucide.createIcons();
    }
  });

})();
