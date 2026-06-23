/**
 * Shopping Cart State & View Manager
 * Saves to localStorage, renders the items list with mini SVGs,
 * and updates badges/prices.
 */

let cart = JSON.parse(localStorage.getItem('urban_custom_cart')) || [];

function getCart() {
  return cart;
}

function saveCart() {
  localStorage.setItem('urban_custom_cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(item) {
  item.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
  cart.push(item);
  saveCart();
}

function removeFromCart(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  saveCart();
}

function updateQty(itemId, newQty) {
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.qty = Math.max(1, newQty);
    item.totalPrice = item.price * item.qty;
    saveCart();
  }
}

function getCartTotal() {
  return cart.reduce((acc, item) => acc + item.totalPrice, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    badge.textContent = totalItems;
    if (totalItems > 0) {
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

// Format COP currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
}

// Render the cart items list
function renderCartItems(onCartChanged) {
  const listContainer = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  
  if (!listContainer) return;
  
  listContainer.innerHTML = '';
  
  if (cart.length === 0) {
    listContainer.innerHTML = `
      <div class="empty-cart-message glass-panel" style="padding: 3rem; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem;">
        <i data-lucide="shopping-bag" style="width: 48px; height: 48px; color: var(--text-muted)"></i>
        <h3>Tu carrito está vacío</h3>
        <p style="color: var(--text-muted)">¡Empieza a diseñar tus prendas personalizadas en la sección de personalizar!</p>
        <button class="btn btn-primary btn-glow" id="btn-empty-cart-shop">Diseñar Ahora</button>
      </div>
    `;
    
    // Bind click to shop button
    document.getElementById('btn-empty-cart-shop')?.addEventListener('click', () => {
      document.getElementById('nav-customizer')?.click();
    });
    
    subtotalEl.textContent = formatCurrency(0);
    totalEl.textContent = formatCurrency(0);
    
    if (window.lucide) {
      window.lucide.createIcons();
    }
    return;
  }
  
  cart.forEach((item) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    
    // Generate mini SVG markup using window.Garments namespace
    const miniSVG = window.Garments.renderGarmentSVG(item.type, 'front', item.colors);
    
    // List text details of layers
    const layerCount = item.frontLayers.length + item.backLayers.length;
    const layersSummary = layerCount > 0 
      ? `Con ${layerCount} elemento${layerCount > 1 ? 's' : ''} de diseño`
      : 'Sin estampados';
      
    const garmentName = window.Garments.GARMENT_TYPES[item.type]?.name || 'Prenda';

    itemEl.innerHTML = `
      <div class="cart-item-preview">
        ${miniSVG}
      </div>
      <div class="cart-item-details">
        <h4>${garmentName}</h4>
        <div class="cart-item-meta">
          <span>Talla: <span>${item.size}</span></span>
          <span class="cart-item-color-indicator">
            Color: 
            <span class="color-indicator-dot" style="background: ${item.colors.body}" title="Cuerpo"></span>
            <span class="color-indicator-dot" style="background: ${item.colors.sleeves}" title="Mangas"></span>
            <span class="color-indicator-dot" style="background: ${item.colors.collar}" title="Cuello"></span>
          </span>
          <span>Personalización: <span>${layersSummary}</span></span>
        </div>
        <div class="qty-selector" style="margin-top: 8px; width: 100px; height: 32px;">
          <button class="qty-btn btn-qty-dec-item" data-id="${item.id}" style="width: 30px; height: 30px; font-size: 0.9rem;">-</button>
          <input type="number" class="item-qty-input" data-id="${item.id}" value="${item.qty}" min="1" max="99" style="width: 40px; font-size: 0.9rem;">
          <button class="qty-btn btn-qty-inc-item" data-id="${item.id}" style="width: 30px; height: 30px; font-size: 0.9rem;">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <span class="cart-item-price">${formatCurrency(item.totalPrice)}</span>
        <button class="cart-item-remove btn-remove-item" data-id="${item.id}">
          <i data-lucide="trash-2"></i> Eliminar
        </button>
      </div>
    `;
    
    listContainer.appendChild(itemEl);
  });
  
  // Update summaries
  const grandTotal = getCartTotal();
  subtotalEl.textContent = formatCurrency(grandTotal);
  totalEl.textContent = formatCurrency(grandTotal);
  
  // Bind actions
  listContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      removeFromCart(id);
      renderCartItems(onCartChanged);
      if (onCartChanged) onCartChanged();
    });
  });
  
  listContainer.querySelectorAll('.btn-qty-dec-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item && item.qty > 1) {
        updateQty(id, item.qty - 1);
        renderCartItems(onCartChanged);
        if (onCartChanged) onCartChanged();
      }
    });
  });
  
  listContainer.querySelectorAll('.btn-qty-inc-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const item = cart.find(i => i.id === id);
      if (item) {
        updateQty(id, item.qty + 1);
        renderCartItems(onCartChanged);
        if (onCartChanged) onCartChanged();
      }
    });
  });
  
  listContainer.querySelectorAll('.item-qty-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const id = e.currentTarget.dataset.id;
      const val = parseInt(e.currentTarget.value) || 1;
      updateQty(id, val);
      renderCartItems(onCartChanged);
      if (onCartChanged) onCartChanged();
    });
  });
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function clearCart() {
  cart = [];
  saveCart();
}

// Expose variables globally
window.Cart = {
  getCart,
  saveCart,
  addToCart,
  removeFromCart,
  updateQty,
  getCartTotal,
  updateCartBadge,
  formatCurrency,
  renderCartItems,
  clearCart
};
