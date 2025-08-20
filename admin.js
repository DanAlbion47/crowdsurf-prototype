// Admin panel logic
document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('admin-password');
  const passwordSave = document.getElementById('password-save');
  const videoUrlInput = document.getElementById('video-url');
  const videoSave = document.getElementById('video-save');
  const simCrowdToggle = document.getElementById('sim-crowd-toggle');
  const crowdSizeInput = document.getElementById('crowd-size');
  const settingsSave = document.getElementById('settings-save');
  const resetBtn = document.getElementById('reset-btn');

  // Populate fields with current config
  function loadConfig() {
    const cfg = window.APP_CONFIG;
    passwordInput.value = cfg.password;
    videoUrlInput.value = cfg.videoSrc;
    simCrowdToggle.checked = cfg.showSimCrowd;
    crowdSizeInput.value = cfg.simCrowdSize;
  }
  loadConfig();

  function saveConfig(newConfig) {
    const overrides = JSON.parse(localStorage.getItem('APP_CONFIG_OVERRIDES') || '{}');
    Object.assign(overrides, newConfig);
    localStorage.setItem('APP_CONFIG_OVERRIDES', JSON.stringify(overrides));
    alert('Settings saved. Reload pages to apply.');
  }

  passwordSave.addEventListener('click', () => {
    const pwd = passwordInput.value.trim();
    if (!pwd) return alert('Password cannot be empty');
    saveConfig({ password: pwd });
  });
  videoSave.addEventListener('click', () => {
    const url = videoUrlInput.value.trim();
    if (!url) return alert('Video URL cannot be empty');
    // If YouTube link, convert to embed
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    saveConfig({ videoType: 'url', videoSrc: embedUrl });
  });
  settingsSave.addEventListener('click', () => {
    const showSim = simCrowdToggle.checked;
    let size = parseInt(crowdSizeInput.value, 10);
    if (isNaN(size) || size < 0) size = 0;
    saveConfig({ showSimCrowd: showSim, simCrowdSize: size });
  });
  resetBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the demo? This will clear overrides and session data.')) {
      localStorage.removeItem('APP_CONFIG_OVERRIDES');
      sessionStorage.removeItem('authenticated');
      // Keep username? We'll clear for a fresh demo
      localStorage.removeItem('username');
      alert('Demo reset. Please refresh the page.');
    }
  });
});