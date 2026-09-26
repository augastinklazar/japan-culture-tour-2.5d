# 幽玄 YŪGEN — 2.5D Japanese Culture Tour

> **Awwwards-Caliber Interactive 2.5D Cultural Immersion**  
> Hand-sculpted in Canvas, SVG, Zdog, GSAP ScrollTrigger, Lenis, and Anime.js.  
> Strictly designed with authentic craftsmanship, without corporate flat art or generic templates.

---

## ⛩️ Live Experience Overview

**YŪGEN (幽玄)** embodies a profound sense of the beauty of the universe and the sad beauty of human suffering. This interactive Single Page Application (SPA) invites visitors through a tactile, multi-dimensional journey across Japanese aesthetics:

1. **The Global Loader (Zen Enso 円相)**: An authentic calligraphic broken brushstroke circle drawn dynamically using Anime.js SVG line-drawing, paired with a monospace counter (`000%` → `100%`) and an expanding circular portal reveal.
2. **The Sacred Portal (2.5D Zdog Torii Gate 鳥居)**: An authentic Shinto Torii rendered in 2.5D vector space (Kasagi, Shimaki, Gakuzuka plaque, Nuki crossbeam, and Kamebara stone plinths). Moves with mouse parallax inertia and zooms the viewer through the portal upon scrolling.
3. **Ukiyo-e Parallax Stage (浮世絵 — The Floating World)**: Multi-plane 2.5D depth staging separating the foreground Great Wave talons and spray particles, midground traditional *Wasen* fishing boats and pine groves, and deep background Mt. Fuji with the crimson *Hinode* sun. Includes woodblock color separation inspection (*Sumi*, *Ai*, *Shu*).
4. **Kintsugi Restoration (金継ぎ — Golden Joinery)**: An exploded Raku Chawan tea bowl fractured into distinct ceramic shards. As the user scrolls (or scrubs the restoration control), the shards reassemble and Anime.js traces glowing liquid gold Urushi lacquer veins along the cracks, scattering shimmering 24K *Kinsunago* gold leaf dust.
5. **Ma & Zen Sand Garden (枯山水 — Negative Space)**: An interactive gravel canvas where moving the brush rakes meditative sand ripples and clicking places moss-accented stones.
6. **2.5D Background Ecosystem (三重塔 Pagoda, 松 Matsu & 雲 Kumo)**: Procedurally modeled 3-tier pagoda, black pine grove, and bamboo stalks flanking the screen with swinging Chochin lanterns and drifting clouds, animated in a multi-speed GSAP ScrollTrigger parallax system.
7. **Custom Shodo Brush Cursor (書道)**: Canvas-based calligraphic brush stroke trailing the cursor with velocity-dependent thickness, organic ink dissipation, and flick splatters.
8. **Synthesized Zen Soundscape (Web Audio API)**: Zero-dependency sound design generating resonant Tibetan/Japanese singing bowl harmonics (*Rin* 鈴) and mountain wind breeze.
9. **Unified Wind & Atmospheric Texture System (WindSystem.js)**: Lenis scroll-reactive wind physics generating transient calligraphic Bézier streamlines (*Kaze-sen* 風線), drifting procedural elements (Matsu pine needles, 24K Kinpaku gold leaf flakes, Sakura petals), Washi paper tooth overlay (`#washi-grain`), Woodblock ink bleed edge softening (`#ink-bleed`), and interactive Kinpaku metallic shimmer.

---

## 🎨 Design System & Palette

| Name | Kanji | Hex Code | Significance |
| :--- | :--- | :--- | :--- |
| **Sumi** | 墨 | `#1C1C1C` | Traditional calligraphy ink; deep, matte, grounded |
| **Gofun** | 胡粉 | `#FFFFFB` | Shell white pigment; aged washi paper tone |
| **Kurenai** | 紅 | `#CB1B45` | Sacred Shinto vermillion/crimson; Torii gate, lanterns & Hanko seals |
| **Kin** | 金箔 | `#D4AF37` | 24-karat gold leaf used in Kintsugi lacquer joinery & Kinpaku shimmer |
| **Ai** | 藍 | `#162D42` | Edo period woodblock indigo dye |
| **Uguisu-iro** | 鶯色 | `#838A2D` | Muted nightingale green; evergreen Matsu needles & bamboo |
| **Kogecha** | 焦茶 | `#69543B` | Dark wood brown; pagoda timber framing & pine bark |
| **Seiji** | 青磁 | `#81C7D4` | Celadon blue/green; delicate swirling Yamagasumi clouds |
| **Matsuba** | 松葉 | `#25342F` | Evergreen coastal pine needle shadow |

* **Paper Texture**: Authentic *Echizen Washi* paper grain simulated via global CSS `mix-blend-mode: multiply` and procedural SVG fractal noise filters.
* **Typography**: Google Fonts **Shippori Mincho** (Headings & Kanji) and **Noto Sans JP** (Body), alongside Japanese vertical typesetting (`writing-mode: vertical-rl; text-orientation: upright;`).

---

## 📁 Directory Structure

```text
Japan/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Zero-config GitHub Pages automated build & deployment
├── src/
│   ├── modules/
│   │   ├── audio.js          # Web Audio API singing bowl & wind breeze synthesis
│   │   ├── cursor.js         # Canvas Shodo ink brush cursor with fluid physics
│   │   ├── ecosystem.js      # 2.5D Zdog Pagoda, Matsu trees, lanterns & clouds parallax
│   │   ├── kintsugi.js       # Ceramic shard reassembly & Anime.js gold veins
│   │   ├── loader.js         # Anime.js Enso circle line drawing & portal reveal
│   │   ├── navigation.js     # Section spy, Tokyo JST live clock & Lenis anchor jumps
│   │   ├── torii.js          # Zdog 2.5D Torii Gate with mouse parallax & camera zoom
│   │   ├── ukiyo.js          # Multi-plane parallax, wave spray & woodblock filters
│   │   └── zen-garden.js     # Meditative raked gravel canvas & stone placement
│   ├── ContentAnimations.js  # Aesthetic philosophy mechanics (solar dial, shodo mask, triad, shards)
│   ├── main.js               # Home portal coordinator, Lenis + GSAP ScrollTrigger bridge
│   ├── narrative.js          # Philosophy narrative SPA controller
│   └── WindSystem.js         # Atmospheric wind engine, calligraphic streamlines & particles
├── index.html                # 2.5D Culture Tour Home Portal
├── narrative.html            # 4-Section Japanese Aesthetic Philosophies Narrative
├── package.json              # Scripts for dev, build, preview, and gh-pages deploy
├── styles.css                # Comprehensive bespoke styles, textures, vertical text
├── vite.config.js            # Multi-page Vite configuration with relative base path (base: './')
└── README.md                 # Complete documentation & deployment guide
```

---

## 🚀 Running Locally

### Option 1: Via Vite (Recommended)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000`.

3. **Build for production**:
   ```bash
   npm run build
   ```
   Outputs the optimized, minified bundle to `./dist`.

4. **Preview the production build**:
   ```bash
   npm run preview
   ```

---

### Option 2: Zero-Build / Direct Static Server

Because all external dependencies (GSAP, ScrollTrigger, Lenis, Zdog, Anime.js) are loaded via high-availability CDNs and the JavaScript code uses standard ES Modules (`<script type="module" src="./src/main.js">`), you can also run the project directly with any static server:

```bash
# Using npx serve:
npx serve .

# Or Python 3:
python -m http.server 8000

# Or VS Code Live Server extension:
# Right-click index.html -> "Open with Live Server"
```

---

## 🌐 Deploying to GitHub Pages

The project is strictly pre-configured for GitHub Pages deployment. You have two effortless options:

### Method A: Automated GitHub Actions (Recommended)

A GitHub Actions workflow is already present in `.github/workflows/deploy.yml`.

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial 2.5D Japanese Culture Tour codebase"
   git branch -M main
   git remote add origin https://github.com/augastinklazar/japan-culture-tour-2.5d.git
   git push -u origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Every subsequent push to `main` will automatically build the site and deploy it to `https://augastinklazar.github.io/japan-culture-tour-2.5d/`.

---

### Method B: One-Command CLI Deploy (`gh-pages`)

If you prefer deploying directly from your local terminal:

1. Run:
   ```bash
   npm run deploy
   ```
2. This runs `vite build` and pushes the `dist` directory to the `gh-pages` branch on GitHub.
3. In GitHub repository **Settings** → **Pages**, select **Deploy from a branch** → `gh-pages` branch → `/ (root)`.

---

## 🛠️ Technical Stack & Framework Attribution

- **GSAP (GreenSock) 3.12.5**: High-performance animation runtime.
- **GSAP ScrollTrigger**: Scroll-bound kinematics and pinned parallax scrubbing.
- **Lenis 1.1.18**: Momentum-based smooth scroll engine.
- **Zdog 1.1.3**: Pseudo-3D / 2.5D vector illustration engine for Canvas.
- **Anime.js 3.2.2**: Complex SVG path calculations and `stroke-dashoffset` line drawing.
- **Web Audio API**: Real-time generative audio synthesis (breeze noise filter & singing bowl resonance).
- **Google Fonts**: `Shippori Mincho`, `Noto Sans JP`, and `Space Mono`.

---

## 📜 Design Principles & Bespoke Craft

- **Authentic Craftsmanship**: No generic flat-vector figures, corporate clichés, or plastic isometric blobs. Every illustration is hand-crafted with traditional Japanese woodblock and ceramic aesthetics.
- **Zero Bootstrap / Tailwind boilerplate**: 100% bespoke, semantic CSS tokens with authentic Japanese traditional color nomenclature.
- **Thematic Zen Enso Preloader**: Hand-crafted calligraphic line-drawing animation and ink-bleed portal transition.

---

## ✍️ Author & Credits

**Project AKL** — An education Information Initiative by **augastinklazar**  
- **GitHub**: [https://github.com/augastinklazar](https://github.com/augastinklazar)  
- **LinkedIn**: [https://www.linkedin.com/in/augastin-k-lazar/](https://www.linkedin.com/in/augastin-k-lazar/)

---

*一期一会 (Ichigo Ichie) — "Treasuring the unrepeatable moment."*
