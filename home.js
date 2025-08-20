// Home (event + crowd) logic
document.addEventListener('DOMContentLoaded', () => {
  // Ensure user is authenticated and has a username
  if (sessionStorage.getItem('authenticated') !== 'true') {
    window.location.href = 'index.html';
    return;
  }
  if (!localStorage.getItem('username')) {
    window.location.href = 'onboarding.html';
    return;
  }
  const videoPlayer = document.getElementById('event-video-player');
  const grid = document.getElementById('crowd-grid');
  const profileModal = document.getElementById('profile-modal');
  const profileContent = document.getElementById('profile-content');
  const toast = document.getElementById('toast');

  // Set event video
  function setVideo() {
    if (window.APP_CONFIG.videoType === 'url') {
      videoPlayer.src = window.APP_CONFIG.videoSrc + '?rel=0&showinfo=0';
    } else {
      // For file-based video, we would set src to a video file stored in public
      videoPlayer.src = window.APP_CONFIG.videoSrc;
    }
  }

  setVideo();

  // Generate simulated crowd
  const simCrowdSize = window.APP_CONFIG.showSimCrowd ? window.APP_CONFIG.simCrowdSize : 0;
  const crowdData = [];
  const firstNames = ['Alex','Sam','Taylor','Jordan','Chris','Jamie','Morgan','Skylar','Casey','Dana','Riley','Jesse','Harper','Robin','Avery'];
  const lastNames = ['Smith','Johnson','Williams','Jones','Brown','Davis','Miller','Wilson','Moore','Taylor'];
  function randomName() {
    return firstNames[Math.floor(Math.random()*firstNames.length)] + ' ' + lastNames[Math.floor(Math.random()*lastNames.length)];
  }
  function randomStatus() {
    // 70% idle, 20% in watchroom, 10% host
    const r = Math.random();
    if (r < 0.1) return { label:'Host', type:'host' };
    if (r < 0.3) return { label:'In room', type:'room' };
    return { label:'', type:'idle' };
  }
  // Real user appears first
  crowdData.push({
    id: 'user',
    name: localStorage.getItem('username'),
    avatar: null,
    simulated: false,
    status: { label:'You', type:'user' }
  });
  for (let i=0; i<simCrowdSize; i++) {
    const status = randomStatus();
    crowdData.push({
      id: 'sim-' + i,
      name: randomName(),
      avatar: null,
      simulated: true,
      status
    });
  }

  function createHexCell(person) {
    const cell = document.createElement('div');
    cell.className = 'hex-cell';
    // Use placeholder image or create colored background
    const img = document.createElement('img');
    if (person.simulated) {
      // Use placeholder image tinted by random color
      img.src = 'placeholder_light_gray_block.png';
    } else {
      // Real user: show placeholder or maybe video thumbnail
      img.src = 'placeholder_light_gray_block.png';
    }
    cell.appendChild(img);
    if (person.status.label) {
      const badge = document.createElement('div');
      badge.className = 'badge';
      badge.textContent = person.status.label;
      cell.appendChild(badge);
    }
    cell.addEventListener('click', () => {
      openProfile(person);
    });
    return cell;
  }

  function populateGrid() {
    grid.innerHTML = '';
    crowdData.forEach((person) => {
      const cell = createHexCell(person);
      grid.appendChild(cell);
    });
  }

  function openProfile(person) {
    // Build profile content
    profileContent.innerHTML = '';
    const avatar = document.createElement('img');
    avatar.src = 'placeholder_light_gray_block.png';
    profileContent.appendChild(avatar);
    const nameEl = document.createElement('h3');
    nameEl.textContent = person.name;
    nameEl.style.marginTop = '8px';
    profileContent.appendChild(nameEl);
    const statusEl = document.createElement('p');
    statusEl.style.opacity = '0.7';
    statusEl.style.fontSize = '0.9rem';
    statusEl.textContent = person.simulated ? 'Simulated user' : 'Real user';
    profileContent.appendChild(statusEl);
    // Buttons
    if (person.simulated) {
      const inviteBtn = document.createElement('button');
      inviteBtn.className = 'gradient-button';
      inviteBtn.textContent = 'Invite to watchroom';
      inviteBtn.disabled = true;
      profileContent.appendChild(inviteBtn);
    } else if (person.id !== 'user') {
      const knockBtn = document.createElement('button');
      knockBtn.className = 'gradient-button';
      knockBtn.textContent = 'Knock to join room';
      knockBtn.addEventListener('click', () => {
        showToast('Knock sent to ' + person.name);
        closeProfile();
      });
      profileContent.appendChild(knockBtn);
    } else {
      const myBtn = document.createElement('button');
      myBtn.className = 'gradient-button';
      myBtn.textContent = 'Go to my watchroom';
      myBtn.addEventListener('click', () => {
        window.location.href = 'watchroom.html';
      });
      profileContent.appendChild(myBtn);
    }
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.marginTop = '8px';
    closeBtn.style.background = 'transparent';
    closeBtn.style.color = '#7b3fe4';
    closeBtn.style.border = 'none';
    closeBtn.addEventListener('click', closeProfile);
    profileContent.appendChild(closeBtn);
    profileModal.style.display = 'flex';
  }
  function closeProfile() {
    profileModal.style.display = 'none';
  }
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      closeProfile();
    }
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // Bottom navigation
  document.getElementById('nav-home').addEventListener('click', () => {
    // Already on home
  });
  document.getElementById('nav-watchroom').addEventListener('click', () => {
    window.location.href = 'watchroom.html';
  });
  document.getElementById('nav-chat').addEventListener('click', () => {
    showToast('Chat feature coming soon');
  });

  populateGrid();

  // Set up my camera thumbnail (placeholder; real camera not streamed here)
  const myCameraThumb = document.getElementById('my-camera-thumb');
  myCameraThumb.style.backgroundImage = "url('placeholder_light_gray_block.png')";
  myCameraThumb.style.backgroundSize = 'cover';
  myCameraThumb.style.clipPath = 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)';

  // Video/audio toggle buttons (for demonstration only)
  const toggleVideoBtn = document.getElementById('toggle-video-btn');
  const toggleAudioBtn = document.getElementById('toggle-audio-btn');
  let videoEnabled = true;
  let audioEnabled = true;
  toggleVideoBtn.addEventListener('click', () => {
    videoEnabled = !videoEnabled;
    toggleVideoBtn.style.backgroundColor = videoEnabled ? 'rgba(0,0,0,0.5)' : '#7b3fe4';
    showToast('Video ' + (videoEnabled ? 'enabled' : 'disabled'));
  });
  toggleAudioBtn.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    toggleAudioBtn.style.backgroundColor = audioEnabled ? 'rgba(0,0,0,0.5)' : '#7b3fe4';
    showToast('Audio ' + (audioEnabled ? 'unmuted' : 'muted'));
  });
  document.getElementById('fullscreen-btn').addEventListener('click', () => {
    // Fullscreen for iframe
    const iframe = videoPlayer;
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    }
  });

  // Simulate network connection warning occasionally
  setTimeout(() => {
    showToast('Your network connection is unstable');
  }, 10000);
});