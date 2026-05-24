# cinematic-portfolio

> If this project helped or inspired you, consider giving it a ⭐ on GitHub — it helps others find it too.

Animated personal portfolio built with **Next.js 16**, **GSAP**, **Three.js**, and **CSS Modules**.

**Live:** [vaibhavkhushalani.dev](https://vaibhavkhushalani.dev) &nbsp;|&nbsp; **GitHub:** [VaibhavKhushalani/cinematic-portfolio](https://github.com/VaibhavKhushalani/cinematic-portfolio)

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.2 (App Router, React Compiler) |
| Animations | GSAP 3 + Three.js |
| Styling | CSS Modules + Tailwind v4 (tokens only) |
| UI primitives | Base UI + shadcn/ui |
| Icons | react-icons |
| Fonts | Geist, Baloo 2, Dancing Script (via `next/font`) |

---

## Project Structure

```
app/
  layout.js          # Root layout — metadata, fonts, JSON-LD, Cursor
  page.js            # Scroll-snap container (100 vh per section)
  globals.css        # All CSS design tokens (retheme here)
  robots.js          # Dynamic robots.txt
  sitemap.js         # Dynamic sitemap

components/
  sections/
    ScreenLoader.jsx              # Glass split-screen intro overlay
    VideoIntro.jsx                # Full-screen video hero (section 0)
    HeroSection.jsx               # Animated name + role (section 1)
    AboutSection.jsx              # Bio + social links (section 2)
    ProjectsSection.jsx           # Project cards carousel (sections 3–4)
    WorkExperienceSection.jsx     # Timeline (section 5)
    PublicationsFooterSection.jsx # Publications + footer merged (sections 6–8)
  three/
    CinematicLayer.jsx    # WebGL bokeh overlay on VideoIntro
    HeroBackground.jsx    # Three.js particles on HeroSection
    WorkExpParticles.jsx  # Three.js particles on WorkExperience
  ui/
    Navbar.jsx            # Fixed navbar + mobile hamburger + live IST clock
    Cursor.jsx            # Custom cursor
    navigation-menu.jsx   # Base UI navigation primitive
    button.jsx            # Base UI button primitive

data/
  profile.json       # All portfolio content — edit this to personalise

lib/
  gsap.js            # GSAP + ScrollTrigger registration
  siteConfig.js      # SITE_URL constant
  utils.js           # cn() helper (clsx + tailwind-merge)

styles/
  sections/          # CSS Modules per section
  ui/                # CSS Modules for Navbar

public/
  assets/            # Video and image assets (see Assets section)
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/VaibhavKhushalani/cinematic-portfolio.git
cd cinematic-portfolio

# 2. Install
npm install

# 3. Dev
npm run dev
# → http://localhost:3000

# 4. Build for production
npm run build
npm start
```

---

## Personalise

**All portfolio content lives in `data/profile.json`.** Edit that file — no component code changes needed for content updates.

Key fields:

| Field | What it controls |
|---|---|
| `name` | Name rendered in VideoIntro + Navbar |
| `tagline` | Eyebrow text on VideoIntro |
| `roles` | Role subtitle on VideoIntro + Hero |
| `bio` | About section body text |
| `experience[]` | Work experience cards |
| `projects[]` | Project carousel cards |
| `publications[]` | Publications section entries |
| `social` | Social link URLs (GitHub, LinkedIn, etc.) |
| `email` | Contact email |

**To retheme colors** edit the CSS tokens in `app/globals.css` under `:root`.

Key tokens: `--accent`, `--hero-start / --hero-mid / --hero-end`, `--text-primary`.

---

## Assets

Place all media in `public/assets/`:

| File | Used by | Notes |
|---|---|---|
| `about-me.mp4` | VideoIntro | Autoplay ambient bg + main intro video |
| `hero.png` | HeroSection | Portrait photo (right side) |
| `about.png` | AboutSection | About photo |
| `work-experience.png` | WorkExperienceSection | Primary company image |
| `work-experience-2.png` | WorkExperienceSection | Secondary image |
| `work-experience-3.png` | WorkExperienceSection | Tertiary image |
| `footer.png` | PublicationsFooterSection | Transitions into footer |
| `footer-video.mp4` | PublicationsFooterSection | Footer background video |
| `project-*.png` | ProjectsSection | One image per project in profile.json |

---

## Scroll Architecture

Custom scroll-snap (not CSS scroll-snap):

- `<main>` is the scroller (`overflowY: scroll`)
- Each section is exactly `100vh`
- `goTo(idx)` in `page.js` animates `scrollTop = idx × window.innerHeight` via GSAP
- `PublicationsFooterSection` spans **3 scroll steps** (300 vh wrapper, sticky inner)
- Total scroll steps: `7 + projects.length`
- Footer → top wrap uses a fade-cut to skip scrolling back through all sections

---

## Deployment

Deploys to **Vercel** with zero config:

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repo in the Vercel dashboard.

Set your domain in `lib/siteConfig.js` (`SITE_URL`) before deploying.

---

## Adding a New Section

1. Create `components/sections/YourSection.jsx`
2. Create `styles/sections/YourSection.module.css`
3. Import and add it inside the `<div>` in `app/page.js`
4. Increment `TOTAL` in `page.js` if it adds a scroll step

---

## License

MIT — free to fork, adapt, and use as your own portfolio base.

---

Made with care by [Vaibhav Khushalani](https://vaibhavkhushalani.dev). If this saved you time, a ⭐ on GitHub goes a long way.
