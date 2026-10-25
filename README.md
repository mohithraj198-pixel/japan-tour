# JAPAN TOURS • Ultra-Luxury 10-Day Curated Expedition

> 🔗 **Live Demo:** [japan-tour-blue.vercel.app](https://japan-tour-blue.vercel.app/)

A production-ready, client-facing single-page website for **JAPAN TOURS**, showcasing an ultra-luxury 10-day curated expedition across Osaka, Kyoto, and Tokyo. 

### Core Features Overview
- **Pure Dark Mode Aesthetics:** Deep pitch-black (`#000000`) canvas with luminous neon violet, magenta, and electric cyan accents.
- **Interactive 3D Fluid Visual:** Inertia-damped 3D perspective mouse tilt and mobile harmonic oscillation with 300-frame scroll animation.
- **Photo Lightbox Modal:** Full-screen pop-up modal with radial edge blending, metadata specs, and keyboard navigation.
- **Responsive & Modern Architecture:** Fluid typography, glassmorphism cards, and seamless multi-device layout.

---

## Highlights & Features

- **Fixed-Background Canvas Scroll Engine:** Smooth lerp-damped rendering across a 300-frame image sequence.
- **Real-Time JST Tokyo Clock Ticker:** Live clock in the navbar showing Tokyo time with status ping.
- **3D Mouse-Follow Perspective Rig:** Physics-based tilt with lerp inertia damping and continuous 60fps harmonic oscillation floating loops (`fluidLevitate`) for mobile/touch screens.
- **Interactive Lightbox Modal Engine:** Full-screen modal with blurred pitch-black backdrop, spec breakdowns, and keyboard (`Escape`) dismissal.
- **Luxury Image Edge Blending:** Radial vignettes and alpha masks melting photo boundaries into the pure `#000000` canvas without harsh edges.
- **Web Audio API Zen Synthesizer:** Ambient pentatonic chime soundscape and haptic feedback.
- **Booking Drawer & Price Calculator:** Real-time seasonal pricing (Autumn / Spring) and guest calculation.
- **Itinerary Process Breakdown:** Accordion steps from A-01 (Osaka) to D-04 (Departure & Extensions).

---

## Project Structure

```text
japan-tour/
├── index.html                   # Core single-page website
├── server.js                    # Local HTTP server with image caching
├── .gitignore                   # Git ignore configuration
├── README.md                    # Project documentation
├── assets/
│   ├── css/
│   │   └── style.css            # Luxury design system & responsive styling
│   ├── js/
│   │   └── main.js              # Application physics, audio & lightbox engine
│   └── images/                  # High-definition local photography
│       ├── hero-kimono-fuji.jpg
│       ├── tokyo-shibuya-night.jpg
│       ├── fuji-twilight-lake.jpg
│       ├── artisan-ramen-macro.jpg
│       ├── kyoto-gion-lanterns.jpg
│       └── fushimi-torii-editorial.jpg
└── ezgif-frame-001.jpg ... 300  # Scroll animation frame sequence
```

---

## Quick Start

Run the static server with Node.js:

```bash
node server.js
```

Open your browser at `http://localhost:3000/`.

---

## License

&copy; 2026 JAPAN TOURS. All rights reserved.
