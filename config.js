// Global configuration for the demo. This object can be updated via the admin page.
// Default configuration values
const defaultConfig = {
  password: 'crowdsurf',
  videoType: 'url',
  videoSrc: 'https://www.youtube.com/embed/8CV8Kl7EHNQ',
  showSimCrowd: true,
  simCrowdSize: 120,
};

// Load overrides from localStorage if present
const overrides = JSON.parse(localStorage.getItem('APP_CONFIG_OVERRIDES') || '{}');

window.APP_CONFIG = { ...defaultConfig, ...overrides };