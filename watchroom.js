// Watchroom page logic
document.addEventListener('DOMContentLoaded', () => {
  // Ensure auth and username
  if (sessionStorage.getItem('authenticated') !== 'true') {
    window.location.href = 'index.html';
    return;
  }
  if (!localStorage.getItem('username')) {
    window.location.href = 'onboarding.html';
    return;
  }
  const videoPlayer = document.getElementById('wr-event-video-player');
  const watchroomGrid = document.getElementById('watchroom-grid');
  const header = document.getElementById('watchroom-header');
  const collapseBtn = document.getElementById('collapse-btn');
  const toast = document.getElementById('wr-toast');
  const profileModal = document.getElementById('wr-profile-modal');
  const profileContent = document.getElementById('wr-profile-content');

  function setVideo() {
    if (window.APP_CONFIG.videoType === 'url') {
      videoPlayer.src = window.APP_CONFIG.videoSrc + '?rel=0&showinfo=0';
    } else {
      videoPlayer.src = window.APP_CONFIG.videoSrc;
    }
  }
  setVideo();

  // Participants
  const maxParticipants = 10;
  let participants = [];
  // Real user as host
  participants.push({
    id: 'user',
    name: localStorage.getItem('username'),
    simulated: false,
    role: 'host',
  });

  // Simulated crowd from home (reuse names)
  const simNames = [];
  for (let i=0; i<window.APP_CONFIG.simCrowdSize; i++) {
    simNames.push('Guest' + (i+1));
  }

  function drawGrid() {
    watchroomGrid.innerHTML = '';
    // Fill grid with participants or plus icons
    for (let i=0; i<maxParticipants; i++) {
      const cell = document.createElement('div');
      cell.style.width = '80px';
      cell.style.height = '90px';
      cell.style.clipPath = 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)';
      cell.style.background = '#1f1433';
      cell.style.display = 'flex';
      cell.style.justifyContent = 'center';
      cell.style.alignItems = 'center';
      cell.style.position = 'relative';
      if (participants[i]) {
        // Show participant avatar (placeholder) and name
        const img = document.createElement('img');
        img.src = 'placeholder_light_gray_block.png';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        cell.appendChild(img);
        const badge = document.createElement('div');
        badge.className = 'badge';
        badge.textContent = participants[i].name.split(' ')[0];
        cell.appendChild(badge);
        cell.addEventListener('click', () => openProfile(participants[i]));
      } else {
        // Show plus icon
        const plus = document.createElement('span');
        plus.textContent = '+';
        plus.style.fontSize = '2rem';
        plus.style.color = '#7b3fe4';
        cell.appendChild(plus);
        cell.addEventListener('click', () => inviteUser());
      }
      watchroomGrid.appendChild(cell);
    }
  }
  drawGrid();

  function inviteUser() {
    // Pick a random simulated name not already invited
    const available = simNames.filter(n => !participants.some(p => p.name === n));
    if (available.length === 0) {
      showToast('No more guests to invite');
      return;
    }
    const name = available[Math.floor(Math.random()*available.length)];
    showToast('You have invited ' + name + ' to your watchroom.');
    // Simulate acceptance after a delay
    setTimeout(() => {
      participants.push({ id: name.toLowerCase(), name, simulated: true, role: 'guest' });
      drawGrid();
      showToast(name + ' has joined your watchroom');
    }, 2000);
  }

  function openProfile(person) {
    profileContent.innerHTML = '';
    const avatar = document.createElement('img');
    avatar.src = 'placeholder_light_gray_block.png';
    profileContent.appendChild(avatar);
    const nameEl = document.createElement('h3');
    nameEl.textContent = person.name;
    nameEl.style.marginTop = '8px';
    profileContent.appendChild(nameEl);
    const roleEl = document.createElement('p');
    roleEl.style.opacity = '0.7';
    roleEl.textContent = person.role === 'host' ? 'Host' : 'Guest';
    profileContent.appendChild(roleEl);
    const btn = document.createElement('button');
    btn.className = 'gradient-button';
    btn.textContent = person.role === 'host' ? 'You are the host' : 'Remove from room';
    if (person.role !== 'host') {
      btn.addEventListener('click', () => {
        removeParticipant(person);
        closeProfile();
      });
    } else {
      btn.disabled = true;
    }
    profileContent.appendChild(btn);
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
    if (e.target === profileModal) closeProfile();
  });

  function removeParticipant(person) {
    participants = participants.filter(p => p.id !== person.id);
    drawGrid();
    showToast(person.name + ' has been removed');
  }

  collapseBtn.addEventListener('click', () => {
    const container = document.getElementById('watchroom-grid-container');
    if (container.style.display === 'none') {
      container.style.display = '';
      collapseBtn.textContent = '∧';
    } else {
      container.style.display = 'none';
      collapseBtn.textContent = '∨';
    }
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // bottom nav
  document.getElementById('wr-nav-home').addEventListener('click', () => {
    window.location.href = 'home.html';
  });
  document.getElementById('wr-nav-watchroom').addEventListener('click', () => {
    // Already here
  });
  document.getElementById('wr-nav-chat').addEventListener('click', () => {
    showToast('Chat feature coming soon');
  });

  // Setup my camera thumb and toggles (simulate)
  const myThumb = document.getElementById('wr-my-camera-thumb');
  myThumb.style.backgroundImage = "url('placeholder_light_gray_block.png')";
  myThumb.style.backgroundSize = 'cover';
  myThumb.style.clipPath = 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)';
  let vidEnabled = true;
  let micEnabled = true;
  document.getElementById('wr-toggle-video-btn').addEventListener('click', () => {
    vidEnabled = !vidEnabled;
    document.getElementById('wr-toggle-video-btn').style.backgroundColor = vidEnabled ? 'rgba(0,0,0,0.5)' : '#7b3fe4';
    showToast('Video ' + (vidEnabled ? 'enabled' : 'disabled'));
  });
  document.getElementById('wr-toggle-audio-btn').addEventListener('click', () => {
    micEnabled = !micEnabled;
    document.getElementById('wr-toggle-audio-btn').style.backgroundColor = micEnabled ? 'rgba(0,0,0,0.5)' : '#7b3fe4';
    showToast('Mic ' + (micEnabled ? 'unmuted' : 'muted'));
  });
  document.getElementById('wr-fullscreen-btn').addEventListener('click', () => {
    if (videoPlayer.requestFullscreen) videoPlayer.requestFullscreen();
  });
});