/**
 * Opens links to video pages in a <dialog> instead of navigating to them.
 * The dialog gets its own history entry, so the back button closes it.
 */
class VideoDialog extends HTMLElement {
  #request = 0;
  #pageTitle = document.title;

  connectedCallback() {
    this.dialog = this.querySelector('dialog');
    this.content = this.querySelector('.modal-content');

    document.addEventListener('click', this.#onClick);
    window.addEventListener('popstate', this.#onPopState);
    this.dialog.addEventListener('close', this.#onClose);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.#onClick);
    window.removeEventListener('popstate', this.#onPopState);
  }

  async open(url, { push = true } = {}) {
    const request = ++this.#request;
    let details;
    let title;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      const page = new DOMParser().parseFromString(await response.text(), 'text/html');
      details = page.querySelector('.video-details');
      title = page.title;
      if (!details) throw new Error('No video details found');
    } catch {
      window.location.href = url;
      return;
    }

    // Another video was opened in the meantime
    if (request !== this.#request) return;

    // Import rather than adopt, so the <video> is created fresh in this document
    this.content.replaceChildren(document.importNode(details, true));
    if (push) window.history.pushState({ videoDialog: url }, '', url);
    document.title = title;

    if (!this.dialog.open) this.dialog.showModal();
    this.dialog.scrollTop = 0;
  }

  #onClick = (event) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a[href^="/videos/"]');
    if (!link || this.dialog.contains(link)) return;

    event.preventDefault();
    this.open(link.pathname);
  };

  #onClose = () => {
    this.#request++;
    this.content.replaceChildren();
    document.title = this.#pageTitle;

    if (window.history.state?.videoDialog) window.history.back();
  };

  #onPopState = (event) => {
    const url = event.state?.videoDialog;

    if (url) {
      this.open(url, { push: false });
    } else if (this.dialog.open) {
      this.dialog.close();
    }
  };
}

customElements.define('video-dialog', VideoDialog);
