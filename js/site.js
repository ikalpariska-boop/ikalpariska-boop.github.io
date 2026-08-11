// Alpine.data('site') — nav state + global content (name, bio, contact),
// shared by every page. Loaded before the Alpine CDN script on each page.
document.addEventListener('alpine:init', () => {
  Alpine.data('site', () => ({
    name: 'Haikal Aqila',
    tagline: '',
    bio: '',
    bioParagraphs: [],
    email: '',
    instagram: '',
    behance: '',
    scrolled: false,
    menuOpen: false,

    async init() {
      try {
        const res = await fetch('data/site.json');
        if (!res.ok) throw new Error(`data/site.json responded ${res.status}`);
        Object.assign(this, await res.json());
        this.bioParagraphs = (this.bio || '').split('\n\n').filter(Boolean);
      } catch (err) {
        console.error('Could not load data/site.json — check the file exists and is valid JSON.', err);
      }

      this._onScroll = () => { this.scrolled = window.scrollY > 60; };
      window.addEventListener('scroll', this._onScroll, { passive: true });
      this._onScroll();

      window.revealOnScroll(document);
    },

    toggleMenu() { this.menuOpen = !this.menuOpen; },
    closeMenu() { this.menuOpen = false; },
  }));
});

// Fades + rises `.reveal` elements into place once, the first time each
// enters the viewport. No-ops under prefers-reduced-motion (CSS already
// shows those elements at full opacity in that case, so nothing is lost).
window.revealOnScroll = function revealOnScroll(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const scope = root && typeof root.querySelectorAll === 'function' ? root : document;
  const items = scope.querySelectorAll('.reveal:not(.is-visible)');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach((item) => observer.observe(item));
};
