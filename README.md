# Haikal Aqila — Portfolio

A static portfolio site: finished artwork on the homepage, with each piece's
story and process behind it. No build step, no server, no monthly cost —
hosted free on GitHub Pages at **https://ikal.github.io**.

Everything you'll ever want to change — artwork, project stories, your bio,
contact info — lives in plain text/JSON files. You never need to open or
understand the HTML/CSS to update the site.

---

## Before you launch: finish the text fields

The 12 projects on the site (Metanoia, Arkana Tiara, and the rest) use your
real artwork, real titles, and real alt text. What's still placeholder:

- Each project's `story` field in `data/projects/{id}.json` — the "why I
  made this" paragraphs. I don't know your intent behind each piece, so
  these are still bracketed instructions for you to replace.
- Each project's `medium` and `client` fields — I filled `medium` in as
  "Digital illustration" (accurate but generic); `client` is still
  bracketed.
- Every project's `year` is currently set to 2025 as a placeholder —
  correct any that are wrong.
- Your bio, tagline, location, and contact info in `data/site.json` are
  still bracketed — nothing there is invented, so it needs your input.
- Your portrait photo (`assets/images/about/portrait.jpg`) isn't uploaded
  yet — the About page will show a tinted placeholder until it is.

None of the placeholder text is fake information about you — it's left
blank on purpose. Replace it using the steps below before sharing the link.

## How the artwork placeholders work

Every artwork spot on the site is a small tinted panel. If the image file it
expects isn't there yet, you see the tint. The moment you upload a
correctly-named file to the right folder, it covers the tint automatically —
**no code or JSON changes needed**, the path is already wired up.

---

## To add or replace a project

1. Go to the repo on github.com and log in.
2. Open `assets/images/` → find (or create) the folder named after the
   project's `id`, e.g. `metanoia` or `arkana-tiara`. Rename the folder to
   something meaningful if you like — just make sure the `id` field in the
   JSON files below matches the folder name exactly.
3. Upload into that folder:
   - `cover.jpg` — the image shown on the homepage grid
   - `process-01.jpg` — the sketch/WIP shown on hover (crossfades with the cover)
   - `hero.jpg` — the large image at the top of the project's detail page
   - `process-01.jpg`, `process-02.jpg`, `process-03.jpg`, `final.jpg` (or as
     many as you have) — the process filmstrip on the detail page
   - Keep images under ~2000px on the long edge and under 500KB each (export
     as compressed JPG or WebP) — this keeps the site fast on mobile data.
4. Open `data/projects.json` → click the pencil (edit) icon → update that
   project's `title`, `category`, `year`, `coverAlt` (describe the image —
   this is what makes your work findable on Google Images and accessible to
   screen-reader visitors), and image paths → commit changes.
5. Open `data/projects/{id}.json` (e.g. `data/projects/metanoia.json`) →
   edit `title`, `medium`, `client`, `story` (your paragraphs, separated by
   a blank line), and each `process` entry's `alt` and `caption` → commit.
6. Wait 1–2 minutes — it's live, no further steps.

Want a brand-new project instead of replacing a sample one? Copy an existing
entry in `data/projects.json` and an existing file in `data/projects/`,
give both a new unique `id`, and follow steps 2–5 above.

**`featured: true`** in `data/projects.json` pins a piece to the top of the
homepage grid without needing to reorder the whole file.

## To update your bio, tagline, or contact info

Open `data/site.json` → click the pencil icon → edit directly → commit.
This single file drives your name in the nav, the homepage tagline, the
About page bio, and your email/Instagram/Behance links everywhere on the
site.

Your bio is written as 2–3 paragraphs separated by a blank line — the About
page automatically splits it into separate paragraphs.

## To update your portrait photo

Upload `portrait.jpg` to `assets/images/about/` — no JSON edit needed, the
About page already points at that exact path.

---

## Previewing changes locally (optional)

You don't need this to publish — GitHub Pages does it for you. But if you
want to check something on your own computer first, and you have Python
installed:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. (Opening `index.html`
directly by double-clicking won't work — the `fetch()` calls that load the
JSON need a real server, even a local one.)

---

## Deployment (one-time setup)

1. Create a free GitHub account if you don't have one.
2. Create a repository named **exactly** `ikal.github.io` — this gives the
   clean root URL automatically.
3. Push these files to the `main` branch.
4. In the repo: **Settings → Pages → Source → Deploy from branch → `main` /
   root**.
5. Site goes live at **https://ikal.github.io** within a few minutes.
6. *(Optional, later)* Buying a custom domain is a one-file change
   (`CNAME`) — no rebuild needed.

---

## Technical notes (for Pillarbox / future maintainers)

- **Stack:** static HTML + CSS + [Alpine.js](https://alpinejs.dev) v3.14.x
  (pinned, loaded from jsDelivr — ~15KB, no build step). Content is fetched
  from the JSON files in `data/` at runtime.
- **Pages:** `index.html` (gallery), `project.html?id={slug}` (one template
  for every project, driven by the URL), `about.html` (bio + contact, with
  `#contact` as an in-page anchor target for the nav's Contact link).
- **`js/site.js`** — nav scroll state, mobile menu, and the shared
  `Alpine.data('site')` component (name/bio/contact) used on every page.
  Also defines `window.revealOnScroll()`, the small IntersectionObserver
  helper behind the scroll-in animation on gallery cards and process
  images — it no-ops under `prefers-reduced-motion`.
- **`js/gallery.js`** / **`js/project.js`** — page-specific Alpine
  components. Load order matters: each page's component script must load
  *before* the Alpine CDN script, since Alpine looks for registered
  components the moment it boots.
- **Placeholder/fallback system:** every artwork slot is a tinted
  `.art-slot` div with an `<img>` on top. An `@error` handler adds
  `.art-img--missing`, which hides the broken image and reveals the tint —
  so a missing file degrades gracefully instead of showing a broken-image
  icon, and needs zero code changes when the real file is later added.
- **Signature texture:** a faint (3.5% opacity) inlined SVG grain overlay
  (`.grain`, in `css/style.css`) — a nod to the paper/ink medium, not
  decorative flourish. Static, no animation, no network request.
- **Accessibility:** skip link on every page, visible focus rings
  (`:focus-visible`), semantic landmarks, `alt` text required by the data
  model on every image, `prefers-reduced-motion` respected throughout.
- **Performance:** `loading="lazy"` on every artwork image, system font
  fallbacks while Fraunces/Work Sans load, no images ship in the repo yet
  (nothing to optimize until real art is added) — see the image-size
  guidance above when that happens.
