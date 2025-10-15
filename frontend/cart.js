// cart.js - cart page logic + checkout
const API_BASE = 'http://localhost:5000/api';

function renderCart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const wrapper = document.getElementById('cart-contents');
  if (!wrapper) return;

  if (cart.length === 0) {
    wrapper.innerHTML = '<p>Your cart is empty. <a href="index.html">Shop now</a></p>';
    document.getElementById('checkout-area').innerHTML = '';
    updateCartCount();
    return;
  }

  let html = `<table class="cart-table"><thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead><tbody>`;
  let total = 0;
  cart.forEach((it, idx) => {
    const subtotal = it.price * it.quantity;
    total += subtotal;
    html += `<tr data-idx="${idx}">
      <td><img class="cart-image" src="${it.image || 'https://via.placeholder.com/80'}" alt="${it.name}"> ${it.name}</td>
      <td>$${it.price.toFixed(2)}</td>
      <td><button class="qty-decrease">-</button> ${it.quantity} <button class="qty-increase">+</button></td>
      <td>$${subtotal.toFixed(2)}</td>
      <td><button class="remove-item">Remove</button></td>
    </tr>`;
  });
  html += `</tbody></table>`;
  html += `<div style="margin-top:12px"><strong>Total: $${total.toFixed(2)}</strong></div>`;
  wrapper.innerHTML = html;

  // Checkout area
  const checkout = document.getElementById('checkout-area');
  checkout.innerHTML = `<button id="checkout-btn">Checkout</button>`;

  updateCartCount();
}

function saveCartAndRender(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  if (window.updateNav) window.updateNav();

  document.getElementById('cart-contents').addEventListener('click', (e) => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const idx = Number(tr.getAttribute('data-idx'));
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (e.target.classList.contains('qty-increase')) {
      cart[idx].quantity += 1;
      saveCartAndRender(cart);
    } else if (e.target.classList.contains('qty-decrease')) {
      cart[idx].quantity = Math.max(1, cart[idx].quantity - 1);
      saveCartAndRender(cart);
    } else if (e.target.classList.contains('remove-item')) {
      cart.splice(idx, 1);
      saveCartAndRender(cart);
    }
  });

  document.getElementById('checkout-area').addEventListener('click', async (e) => {
    if (e.target.id !== 'checkout-btn') return;
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      alert('Please login before checking out.');
      window.location.href = 'login.html';
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      alert('Cart is empty.');
      return;
    }

    const orderProducts = cart.map(i => ({ productId: i.productId, quantity: i.quantity }));
    const totalAmount = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, products: orderProducts, totalAmount }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Checkout failed');
      }
      const saved = await res.json();
      localStorage.removeItem('cart');
      renderCart();
      alert('Order placed successfully! Order id: ' + saved._id);
    } catch (err) {
      console.error(err);
      alert('Checkout error: ' + err.message);
    }
  });
});
