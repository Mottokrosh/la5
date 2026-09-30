const COOKIE = 'la5warning';
const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;

/**
 * Upgrades the statically open age warning <dialog> to a modal one, and
 * remembers for two weeks that it was accepted.
 */
class AgeGate extends HTMLElement {
  connectedCallback() {
    if (document.cookie.split('; ').includes(`${COOKIE}=1`)) {
      this.remove();
      return;
    }

    const dialog = this.querySelector('dialog');

    dialog.addEventListener('cancel', event => event.preventDefault());
    dialog.addEventListener('close', () => {
      // Ignore the close event caused by re-opening as a modal below
      if (dialog.open) return;

      const expires = new Date(Date.now() + TWO_WEEKS).toUTCString();
      document.cookie = `${COOKIE}=1; expires=${expires}; path=/; SameSite=Lax`;
      this.remove();
    });

    // Re-open as a modal, which makes the rest of the page inert
    dialog.close();
    dialog.showModal();
  }
}

customElements.define('age-gate', AgeGate);
