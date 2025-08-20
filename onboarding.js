// Onboarding logic
document.addEventListener('DOMContentLoaded', () => {
  // Redirect if not authenticated
  if (sessionStorage.getItem('authenticated') !== 'true') {
    window.location.href = 'index.html';
    return;
  }
  const slides = Array.from(document.querySelectorAll('.onboarding-slide'));
  const pagination = document.getElementById('pagination');
  const skipBtn = document.getElementById('skip-btn');
  const nextBtn = document.getElementById('next-btn');
  const nameInput = document.getElementById('name-input');
  let current = 0;

  // Create pagination dots
  slides.forEach((slide, idx) => {
    const dot = document.createElement('div');
    dot.className = 'pagination-dot' + (idx === current ? ' active' : '');
    pagination.appendChild(dot);
  });

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.style.display = idx === index ? 'flex' : 'none';
    });
    // Update dots
    Array.from(pagination.children).forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
    // Hide skip button on last slide
    skipBtn.style.visibility = index === slides.length - 1 ? 'hidden' : 'visible';
    // Change next button text to Finish on last slide
    nextBtn.textContent = index === slides.length - 1 ? 'Finish' : 'Next';
    current = index;
  }

  function goToNext() {
    if (current < slides.length - 1) {
      showSlide(current + 1);
    } else {
      // Finish onboarding
      const name = nameInput.value.trim();
      if (!name) {
        alert('Please enter your name');
        return;
      }
      localStorage.setItem('username', name);
      // Redirect to preview
      window.location.href = 'preview.html';
    }
  }

  function skipOnboarding() {
    // Skip slides and go to name input
    showSlide(slides.length - 1);
  }

  nextBtn.addEventListener('click', goToNext);
  skipBtn.addEventListener('click', skipOnboarding);

  showSlide(current);
});