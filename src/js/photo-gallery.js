import PhotoSwipeLightbox from '/js/vendor/photoswipe-lightbox.esm.min.js';
import PhotoSwipeTrackpadGestures from '/js/vendor/trackpad-gestures.js';

/**
 * Opens the photo tiles inside it in a PhotoSwipe lightbox, and fades each
 * thumbnail in once it has loaded. Tiles added later (the admin grid appends
 * them as you scroll) are picked up too.
 */
class PhotoGallery extends HTMLElement {
  #lightbox;
  #avif = null;

  connectedCallback() {
    this.addEventListener('load', event => event.target.classList?.add('ready'), true);
    this.reveal();

    this.#lightbox = new PhotoSwipeLightbox({
      gallery: this,
      children: 'a.photo',
      pswpModule: () => import('/js/vendor/photoswipe.esm.min.js'),
      bgOpacity: 0.96,
      padding: { top: 20, bottom: 40, left: 20, right: 20 },
    });

    // Open the full size in whichever format the thumbnails' <picture> picked
    this.#lightbox.addFilter('itemData', (data) => {
      const avif = data.element?.dataset.avif;
      if (avif && this.#takesAvif()) data.src = avif;
      return data;
    });

    this.#lightbox.on('uiRegister', () => {
      this.#lightbox.pswp.ui.registerElement({
        name: 'caption',
        order: 9,
        isButton: false,
        appendTo: 'root',
        onInit: (element, pswp) => {
          element.className = 'pswp__caption';
          pswp.on('change', () => {
            element.textContent = pswp.currSlide?.data.element?.querySelector('img')?.alt ?? '';
          });
        },
      });
    });

    new PhotoSwipeTrackpadGestures(this.#lightbox);
    this.#lightbox.init();
  }

  disconnectedCallback() {
    this.#lightbox?.destroy();
  }

  /** Marks thumbnails that loaded before the load listener was attached. */
  reveal() {
    for (const img of this.querySelectorAll('a.photo img:not(.ready)')) {
      if (img.complete && img.naturalWidth) img.classList.add('ready');
    }
  }

  #takesAvif() {
    if (this.#avif === null) {
      const seen = [...this.querySelectorAll('a.photo img')].find(img => img.currentSrc);
      if (seen) this.#avif = seen.currentSrc.endsWith('.avif');
    }
    return this.#avif === true;
  }
}

customElements.define('photo-gallery', PhotoGallery);
