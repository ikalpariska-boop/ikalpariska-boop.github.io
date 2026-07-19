// Alpine.data('project') — powers the detail page template.
// Reads ?id= from the URL, loads data/projects/{id}.json, and resolves
// prev/next from the shared project index for the bottom nav.
document.addEventListener('alpine:init', () => {
  Alpine.data('project', () => ({
    current: null,
    prev: null,
    next: null,
    storyParagraphs: [],
    loading: true,
    notFound: false,

    async init() {
      const requestedId = new URLSearchParams(window.location.search).get('id');

      try {
        const indexRes = await fetch('data/projects.json');
        if (!indexRes.ok) throw new Error(`data/projects.json responded ${indexRes.status}`);
        const index = await indexRes.json();

        const targetId = requestedId || (index[0] && index[0].id);
        if (!targetId) { this.notFound = true; return; }

        const detailRes = await fetch(`data/projects/${targetId}.json`);
        if (!detailRes.ok) throw new Error(`data/projects/${targetId}.json responded ${detailRes.status}`);
        this.current = await detailRes.json();
        this.storyParagraphs = (this.current.story || '').split('\n\n').filter(Boolean);

        const i = index.findIndex((p) => p.id === targetId);
        this.prev = index[(i - 1 + index.length) % index.length];
        this.next = index[(i + 1) % index.length];

        document.title = `${this.current.title} — Haikal Aqila`;
      } catch (err) {
        console.error('Could not load this project — check the id in the URL matches a file in data/projects/.', err);
        this.notFound = true;
      } finally {
        this.loading = false;
        this.$nextTick(() => window.revealOnScroll(this.$el));
      }
    },
  }));
});
