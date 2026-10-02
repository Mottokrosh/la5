const BATCH_SIZE = 150;
const DEBOUNCE = 200;

const normalize = text => text.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Shows every gallery photo, newest first, filtered by a search over each
 * gallery's title, models and description. Tiles are added in batches as the
 * grid scrolls into view; the <photo-gallery> inside handles the lightbox.
 */
class AdminGallery extends HTMLElement {
  #sets = [];
  #base = '';
  #matches = [];
  #shown = 0;
  #timer;

  async connectedCallback() {
    this.input = this.querySelector('input');
    this.status = this.querySelector('.search-status');
    this.gallery = this.querySelector('photo-gallery');
    this.grid = this.querySelector('.photo-grid');

    this.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#filter();
    });
    this.input.addEventListener('input', () => {
      clearTimeout(this.#timer);
      this.#timer = setTimeout(() => this.#filter(), DEBOUNCE);
    });

    this.sentinel = this.querySelector('.sentinel');
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) this.#showMore();
    }, { rootMargin: '1500px' }).observe(this.sentinel);

    try {
      const response = await fetch(this.dataset.src);
      if (!response.ok) throw new Error(response.statusText);
      const { base, sets } = await response.json();
      this.#base = base;
      this.#sets = sets.map(set => ({
        ...set,
        caption: set.models.length ? `${set.title} – ${set.models.join(', ')}` : set.title,
        text: normalize(`${set.title} ${set.models.join(' ')} ${set.description}`),
      }));
    } catch {
      this.status.textContent = 'The photos couldn’t be loaded.';
      return;
    }

    this.input.value = new URLSearchParams(location.search).get('q') ?? '';
    this.#filter();
  }

  #filter() {
    const query = this.input.value.trim();
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    const sets = this.#sets.filter(set => tokens.every(token => set.text.includes(token)));

    this.#matches = sets.flatMap(set => set.photos.map(photo => [set, photo]));
    this.#shown = 0;
    this.grid.replaceChildren();

    const url = new URL(location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);

    const photos = this.#matches.length.toLocaleString();
    const galleries = `${sets.length.toLocaleString()} ${sets.length === 1 ? 'gallery' : 'galleries'}`;
    this.status.textContent = this.#matches.length
      ? `${photos} photos in ${galleries}`
      : `No photos found for “${query}”.`;

    this.#showMore();
  }

  #showMore() {
    if (this.#shown >= this.#matches.length) return;
    const batch = this.#matches.slice(this.#shown, this.#shown + BATCH_SIZE);
    this.#shown += batch.length;
    this.grid.append(...batch.map(([set, photo]) => this.#tile(set, photo)));

    // The observer only fires on changes, so keep going while the sentinel is still near
    requestAnimationFrame(() => {
      if (this.sentinel.getBoundingClientRect().top < innerHeight + 1500) this.#showMore();
    });
  }

  #tile(set, [key, width, height, color]) {
    const url = (size, format) => `${this.#base}/${size}/${key}.${format}`;

    const link = document.createElement('a');
    link.className = 'photo';
    link.href = url('full', 'jpg');
    link.target = '_blank';
    link.dataset.avif = url('full', 'avif');
    link.dataset.pswpWidth = width;
    link.dataset.pswpHeight = height;
    link.style.setProperty('--r', (width / height).toFixed(4));
    link.style.backgroundColor = color;

    const source = document.createElement('source');
    source.type = 'image/avif';
    source.srcset = url('thumb', 'avif');

    const img = document.createElement('img');
    img.src = url('thumb', 'jpg');
    img.alt = set.date ? `${set.caption} (${set.date})` : set.caption;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = width;
    img.height = height;

    const picture = document.createElement('picture');
    picture.append(source, img);
    link.append(picture);

    if (set.permanent) {
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.title = 'Permanent collection';
      badge.textContent = 'PC';
      link.append(badge);
    }
    return link;
  }
}

customElements.define('admin-gallery', AdminGallery);
