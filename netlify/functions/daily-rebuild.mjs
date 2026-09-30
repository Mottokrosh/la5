// Rebuilds the site every day so the home page shuffle and footer year stay fresh.
// Requires a build hook (Site configuration > Build & deploy > Build hooks) whose
// URL is stored in the BUILD_HOOK_URL environment variable.
export default async () => {
  const buildHookUrl = process.env.BUILD_HOOK_URL;

  if (!buildHookUrl) {
    console.warn('BUILD_HOOK_URL is not set, skipping the daily rebuild');
    return;
  }

  const response = await fetch(buildHookUrl, { method: 'POST' });
  console.log(`Triggered daily rebuild: ${response.status}`);
};

export const config = {
  schedule: '@daily',
};
