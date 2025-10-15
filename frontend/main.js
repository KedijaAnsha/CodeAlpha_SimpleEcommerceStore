javascript
// File: frontend/js/main.js

const API_BASE = "http://localhost:5000/api";

// Fetch and display all products on index.html
document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list");
  if (!productList) return; // prevent running on other pages

  try {
    const res = await fetch(`${API_BASE}/products`);
    const products = await res.json();

    if (!products || products.length === 0) {
      productList.innerHTML = "<p>No products found.</p>";
      return;
    }

    productList.innerHTML = products
      .map(
        (p) => 
        <div class="product-card">
          <img src="${p.image || 'https://via.placeholder.com/200'}" alt="${p.name}" />
          <h3>${p.name}</h3>
          <p>$${p.price}</p>
          <button onclick="addToCart('${p._id}', '${p.name}', ${p.price})">Add to Cart</button>
          <a href="product.html?id=${p._id}" class="details-link">View Details</a>
        </div>
      
      )
      .join("");
  } catch (error) {
    console.error("Error fetching products:", error);
    productList.innerHTML = "<p>Failed to load products. Please try again later.</p>";
  }

  updateCartCount();
});

// Add product to cart (stored in localStorage)
function addToCart(id, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert(`${name} added to cart!`);
}

// Update cart count in navigation
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = count;
}

