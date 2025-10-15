// auth.js - handles register, login, logout, nav updates
const API_BASE = 'http://localhost:5000/api';

function updateNav() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const loginLink = document.getElementById('nav-login');
  const registerLink = document.getElementById('nav-register');
  const logoutBtn = document.getElementById('nav-logout');
  const navUser = document.getElementById('nav-user');

  if (user) {
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (logoutBtn) { logoutBtn.style.display = 'inline-block'; logoutBtn.onclick = logout; }
    if (navUser) navUser.textContent = `Hello, ${user.name}`;
  } else {
    if (loginLink) loginLink.style.display = 'inline';
    if (registerLink) registerLink.style.display = 'inline';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (navUser) navUser.textContent = '';
  }
  // update cart count if present
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartCount.textContent = cart.reduce((s, i) => s + (i.quantity || 0), 0);
  }
}

async function registerFormHandler(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!name || !email || !password) return alert('Fill all fields');

  try {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    alert('Registered successfully. Please login.');
    window.location.href = 'login.html';
  } catch (err) {
    console.error(err);
    alert('Registration error: ' + err.message);
  }
}

async function loginFormHandler(e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  if (!email || !password) return alert('Fill all fields');

  try {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    // expected { token, user }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    updateNav();
    window.location.href = 'index.html';
  } catch (err) {
    console.error(err);
    alert('Login error: ' + err.message);
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateNav();
  window.location.href = 'index.html';
}

// Attach listeners if forms exist
document.addEventListener('DOMContentLoaded', () => {
  updateNav();

  const registerForm = document.getElementById('register-form');
  if (registerForm) registerForm.addEventListener('submit', registerFormHandler);

  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.addEventListener('submit', loginFormHandler);

  // expose updateNav globally
  window.updateNav = updateNav;
});
