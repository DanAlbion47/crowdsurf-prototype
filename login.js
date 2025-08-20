// Login page logic
document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('login-btn');
  const errorMsg = document.getElementById('login-error');

  function attemptLogin() {
    const entered = passwordInput.value.trim();
    if (entered === '') return;
    if (entered === window.APP_CONFIG.password) {
      // Store authenticated flag in session storage
      sessionStorage.setItem('authenticated', 'true');
      // Redirect to onboarding if not visited before, else to home
      const hasName = !!localStorage.getItem('username');
      window.location.href = hasName ? 'preview.html' : 'onboarding.html';
    } else {
      errorMsg.style.display = 'block';
    }
  }

  loginBtn.addEventListener('click', attemptLogin);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      attemptLogin();
    }
  });
});