const PAGE_SIZE = 10;

/**
 * Searches the videos using the Pagefind index generated at build time.
 * Pagefind is only loaded once the search field is focused.
 */
class VideoSearch extends HTMLElement {
  #pagefind;
  #results = [];
  #shown = 0;
  #search = 0;

  connectedCallback() {
    this.input = this.querySelector('input');
    this.output = this.querySelector('.search-results');

    this.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      this.#run(this.input.value.trim(), { immediate: true });
    });
    this.input.addEventListener('focus', () => this.#load().catch(() => {}), { once: true });
    this.input.addEventListener('input', () => this.#run(this.input.value.trim()));
  }

  #load() {
    this.#pagefind ??= import('/pagefind/pagefind.js').then(async (pagefind) => {
      await pagefind.options({ excerptLength: 24 });
      pagefind.init();
      return pagefind;
    }).catch((error) => {
      this.#pagefind = undefined; // Retry on the next search
      throw error;
    });
    return this.#pagefind;
  }

  async #run(query, { immediate = false } = {}) {
    const search = ++this.#search;

    if (!query) {
      this.output.replaceChildren();
      return;
    }

    let response;
    try {
      const pagefind = await this.#load();
      response = immediate ? await pagefind.search(query) : await pagefind.debouncedSearch(query, {}, 250);
    } catch {
      this.#status('Search is unavailable right now.');
      return;
    }

    // A newer search has started, or this one was debounced away
    if (response === null || search !== this.#search) return;

    this.#results = response.results;
    this.#shown = 0;
    this.output.replaceChildren();

    if (!this.#results.length) {
      this.#status(`No videos found for “${query}”.`);
      return;
    }

    await this.#showMore(search);
  }

  async #showMore(search) {
    const batch = this.#results.slice(this.#shown, this.#shown + PAGE_SIZE);
    const data = await Promise.all(batch.map(result => result.data()));
    if (search !== this.#search) return;

    this.#shown += batch.length;
    this.output.querySelector('.show-more')?.remove();
    this.output.append(...data.map(result => this.#render(result)));

    if (this.#shown < this.#results.length) {
      const button = document.createElement('button');
      button.className = 'show-more';
      button.textContent = `Show more (${this.#results.length - this.#shown} left)`;
      button.addEventListener('click', () => this.#showMore(search));
      this.output.append(button);
    }
  }

  #render({ url, meta, excerpt }) {
    const link = document.createElement('a');
    link.className = 'result';
    link.href = url;
    link.innerHTML = `
      <div class="cover"><img alt="" loading="lazy"></div>
      <div class="text">
        <h4></h4>
        <p class="models"></p>
        <p class="excerpt"></p>
      </div>`;
    link.querySelector('img').src = meta.image;
    link.querySelector('h4').textContent = meta.title;
    link.querySelector('.models').textContent = meta.models;
    // Pagefind escapes the excerpt and only adds <mark> elements
    link.querySelector('.excerpt').innerHTML = excerpt;
    return link;
  }

  #status(message) {
    const status = document.createElement('p');
    status.className = 'search-status';
    status.textContent = message;
    this.output.replaceChildren(status);
  }
}

customElements.define('video-search', VideoSearch);
