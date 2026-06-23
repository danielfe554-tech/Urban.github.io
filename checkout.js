/**
 * Simulated Checkout Controller
 * Validates shipping info and mock Stripe payment gateway fields.
 * Simulates a Stripe payment request.
 */

function initCheckout(onPaymentSuccess) {
  const form = document.getElementById('payment-form');
  const ccInput = document.getElementById('card-number');
  const expiryInput = document.getElementById('card-expiry');
  const cvcInput = document.getElementById('card-cvc');
  const errorMsg = document.getElementById('payment-error-msg');
  const payBtnText = document.getElementById('pay-btn-text');
  const paySpinner = document.getElementById('pay-btn-spinner');
  
  if (!form) return;
  
  // Format Card Number (4000 1234 5678 9010)
  ccInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = value;
  });
  
  // Format Expiry Date (MM/AA)
  expiryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
  });

  // Numbers only for CVC
  cvcInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.classList.add('hide');
    
    const cart = window.Cart.getCart();
    if (cart.length === 0) {
      alert('Tu carrito está vacío. Añade algún diseño antes de proceder al pago.');
      return;
    }
    
    // Validate custom card checks
    const ccValue = ccInput.value.replace(/\s/g, '');
    const expiryValue = expiryInput.value;
    const cvcValue = cvcInput.value;
    
    let isValid = true;
    
    // Simple mock credit card validation
    if (ccValue.length < 15 || ccValue.length > 16) {
      isValid = false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiryValue)) {
      isValid = false;
    } else {
      const parts = expiryValue.split('/');
      const month = parseInt(parts[0], 10);
      if (month < 1 || month > 12) {
        isValid = false;
      }
    }
    
    if (cvcValue.length < 3 || cvcValue.length > 4) {
      isValid = false;
    }
    
    if (!isValid) {
      errorMsg.classList.remove('hide');
      ccInput.focus();
      return;
    }
    
    // Start payment loading simulation
    payBtnText.textContent = 'Procesando...';
    paySpinner.classList.remove('hide');
    document.getElementById('btn-pay-now').disabled = true;
    
    setTimeout(() => {
      // Payment successful!
      paySpinner.classList.add('hide');
      payBtnText.innerHTML = '<i data-lucide="lock"></i> Pagar';
      document.getElementById('btn-pay-now').disabled = false;
      
      // Collect shipping information
      const orderDetails = {
        orderId: `UC-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
        shippingName: document.getElementById('shipping-name').value,
        shippingEmail: document.getElementById('shipping-email').value,
        shippingPhone: document.getElementById('shipping-phone').value,
        shippingAddress: `${document.getElementById('shipping-address').value}, ${document.getElementById('shipping-city').value}`,
        items: JSON.parse(JSON.stringify(cart)),
        total: window.Cart.getCartTotal()
      };
      
      // Reset form
      form.reset();
      
      if (window.lucide) {
        window.lucide.createIcons();
      }
      
      if (onPaymentSuccess) {
        onPaymentSuccess(orderDetails);
      }
    }, 2000);
  });
}

// Render the right checkout sidebar review
function renderCheckoutReview() {
  const container = document.getElementById('checkout-items-list');
  const subtotalEl = document.getElementById('checkout-subtotal');
  const totalEl = document.getElementById('checkout-total');
  const payBtnAmount = document.getElementById('checkout-amount-pay');
  
  if (!container) return;
  
  container.innerHTML = '';
  const cart = window.Cart.getCart();
  
  cart.forEach((item) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'review-item';
    
    const layerCount = item.frontLayers.length + item.backLayers.length;
    const layersStr = layerCount > 0 ? `+ ${layerCount} estampa(s)` : 'Base';
    const garmentName = window.Garments.GARMENT_TYPES[item.type]?.name || 'Prenda';
    
    itemEl.innerHTML = `
      <div>
        <span class="name">${garmentName}</span>
        <div class="meta">${item.size} | ${layersStr} | Cant: ${item.qty}</div>
      </div>
      <span class="price">${window.Cart.formatCurrency(item.totalPrice)}</span>
    `;
    
    container.appendChild(itemEl);
  });
  
  const grandTotal = window.Cart.getCartTotal();
  const formattedTotal = window.Cart.formatCurrency(grandTotal);
  
  subtotalEl.textContent = formattedTotal;
  totalEl.textContent = formattedTotal;
  if (payBtnAmount) {
    payBtnAmount.textContent = formattedTotal;
  }
}

// Expose variables globally
window.Checkout = {
  initCheckout,
  renderCheckoutReview
};
