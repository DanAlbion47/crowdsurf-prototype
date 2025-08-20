// Preview page logic
document.addEventListener('DOMContentLoaded', () => {
  // Redirect if not authenticated
  if (sessionStorage.getItem('authenticated') !== 'true') {
    window.location.href = 'index.html';
    return;
  }
  const videoEl = document.getElementById('camera-video');
  const toggleEl = document.getElementById('camera-toggle');
  const statusEl = document.getElementById('camera-status');
  const joinBtn = document.getElementById('join-btn');
  const backBtn = document.getElementById('back-btn');
  const eventNameEl = document.getElementById('event-name');
  let stream;
  eventNameEl.textContent = 'CrowdSurf Event';

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      videoEl.srcObject = stream;
    } catch (err) {
      console.error('Camera access denied', err);
      statusEl.textContent = 'off';
      toggleEl.classList.remove('active');
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
  }

  toggleEl.addEventListener('click', () => {
    const isActive = toggleEl.classList.toggle('active');
    statusEl.textContent = isActive ? 'on' : 'off';
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
  });

  joinBtn.addEventListener('click', () => {
    // Stop camera and proceed to home
    stopCamera();
    window.location.href = 'home.html';
  });

  backBtn.addEventListener('click', () => {
    window.history.back();
  });

  // Start camera automatically
  toggleEl.classList.add('active');
  startCamera();
});