// Password-protects the admin area with Netlify's Basic-Auth. The password
// comes from the ADMIN_PASSWORD environment variable, so it's not in the repo.
export const data = {
  permalink: '/_headers',
  layout: null,
  eleventyExcludeFromCollections: true,
};

export function render() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    // Never deploy the admin area unprotected
    if (process.env.NETLIFY === 'true') throw new Error('ADMIN_PASSWORD must be set to deploy the admin area');
    return '';
  }

  const rules = ['/admin', '/admin/*'].map(path => `${path}
  Basic-Auth: admin:${password}
  X-Robots-Tag: noindex, nofollow
  Cache-Control: private, no-store`);
  return `${rules.join('\n')}\n`;
}
