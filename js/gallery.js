// Alpine.data('gallery') — powers the homepage masonry grid.
// Fetches the project index once; the grid re-renders whenever
// data/projects.json changes (no code edits needed to add a project).
document.addEventListener('alpine:init', () => {
  Alpine.data('gallery', () => ({
    projects: [],
    loading: true,
    error: false,

    async init() {
      try {
        const res = await fetch('data/projects.json');
        if (!res.ok) throw new Error(`data/projects.json responded ${res.status}`);
        const data = await res.json();
        // `featured: true` pins a piece to the top of the grid without
        // needing to reorder the whole file — see README.
        this.projects = data
          .map((p, i) => ({ ...p, _order: i }))
          .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a._order - b._order);
      } catch (err) {
        console.error('Could not load data/projects.json — check the file exists and is valid JSON.', err);
        this.error = true;
      } finally {
        this.loading = false;
        this.$nextTick(() => window.revealOnScroll(this.$el));
      }
    },
  }));
});
