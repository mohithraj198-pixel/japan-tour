# JAPAN TOURS • Ultra-Luxury 10-Day Curated Expedition

> 🔗 **Live Demo:** [japan-tour-blue.vercel.app](https://japan-tour-blue.vercel.app/)

A production-ready, client-facing single-page website for **JAPAN TOURS**, showcasing an ultra-luxury 10-day curated expedition across Osaka, Kyoto, and Tokyo. 

### Core Features Overview
- **Pure Dark Mode Aesthetics:** Deep pitch-black (`#000000`) canvas with luminous neon violet, magenta, and electric cyan accents.
- **Interactive 3D Fluid Visual:** Inertia-damped 3D perspective mouse tilt and mobile harmonic oscillation with 300-frame scroll animation.
- **Photo Lightbox Modal:** Full-screen pop-up modal with radial edge blending, metadata specs, and keyboard navigation.
- **Osaka Blue Hour Destination Photography:** Editorial photograph of Dotonbori canal with Glico Running Man and illuminated canal reflections.
- **Upgraded Concierge & Reservation Engine:** Bespoke two-column contact section with live destination selection, country-code phone formatting, guest counter, and genuine API persistence.
- **Responsive & Modern Architecture:** Fluid typography, glassmorphism cards, and seamless multi-device layout.

---

## Highlights & Features

- **Fixed-Background Canvas Scroll Engine:** Smooth lerp-damped rendering across a 300-frame image sequence.
- **Real-Time JST Tokyo Clock Ticker:** Live clock in the navbar showing Tokyo time with status ping.
- **3D Mouse-Follow Perspective Rig:** Physics-based tilt with lerp inertia damping and continuous 60fps harmonic oscillation floating loops (`fluidLevitate`) for mobile/touch screens.
- **Interactive Lightbox Modal Engine:** Full-screen modal with blurred pitch-black backdrop, spec breakdowns, and keyboard (`Escape`) dismissal.
- **Editorial Destination Photography:** Photorealistic imagery across Tokyo (Shibuya), Kyoto (Fushimi Inari, Gion), and Osaka (Dotonbori canal at blue hour).
- **Luxury Image Edge Blending:** Radial vignettes and alpha masks melting photo boundaries into the pure `#000000` canvas without harsh edges.
- **Web Audio API Zen Synthesizer:** Ambient pentatonic chime soundscape and haptic feedback.
- **Booking Drawer & Price Calculator:** Real-time seasonal pricing (Autumn / Spring) and guest calculation.
- **Itinerary Process Breakdown:** Accordion steps from A-01 (Osaka) to D-04 (Departure & Extensions).
- **Bespoke Journey Contact Form:** Validated two-column reservation panel with country-code support, date picker, guest stepper, and genuine server-side enquiry storage (`POST /api/contact` -> `enquiries.json`).
- **Confirmation Modal:** Animated flight confirmation modal showing personalized expedition details and booking reference ID.

---

## Project Structure

```text
japan-tour/
├── index.html                   # Core single-page website
├── server.js                    # Local HTTP server with API endpoints & image caching
├── enquiries.json               # Persisted journey enquiries and bookings
├── .gitignore                   # Git ignore configuration
├── README.md                    # Project documentation
├── assets/
│   ├── css/
│   │   └── style.css            # Luxury design system & responsive styling
│   ├── js/
│   │   └── main.js              # Application physics, audio, form submission & lightbox engine
│   └── images/                  # High-definition destination photography
│       ├── hero-kimono-fuji.jpg
│       ├── tokyo-shibuya-night.jpg
│       ├── fuji-twilight-lake.jpg
│       ├── artisan-ramen-macro.jpg
│       ├── kyoto-gion-lanterns.jpg
│       ├── fushimi-torii-editorial.jpg
│       └── osaka-dotonbori-night.jpg
└── ezgif-frame-001.jpg ... 300  # Scroll animation frame sequence
```

---

## Quick Start

Run the server with Node.js:

```bash
node server.js
```

Open your browser at `http://localhost:3000/`.

---

## API Endpoints

### `POST /api/contact`
Receives and records luxury expedition requests.

**Payload:**
```json
{
  "name": "Alexander Vance",
  "email": "alexander.vance@example.com",
  "phone": "+81 90-1234-5678",
  "destination": "Osaka",
  "travelDate": "2026-11-20",
  "travelers": 2,
  "notes": "Interested in private architecture guides and Michelin dining."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Your enquiry has been received.",
  "enquiry": {
    "id": "JP-MVQTFNHP",
    "destination": "Osaka",
    "travelDate": "2026-11-20",
    "travelers": 2
  }
}
```

---

## License

&copy; 2026 JAPAN TOURS. All rights reserved.
