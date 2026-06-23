/**
 * Order Success receipt page controller
 * Renders the purchase invoice details and generates a custom
 * interactive canvas-based confetti particle animation.
 */

let confettiInterval = null;
let animationFrameId = null;

function renderReceipt(orderDetails) {
  document.getElementById('receipt-order-id').textContent = orderDetails.orderId;
  document.getElementById('receipt-date').textContent = orderDetails.date;
  document.getElementById('receipt-total').textContent = window.Cart.formatCurrency(orderDetails.total);
  document.getElementById('receipt-shipping-address').textContent = orderDetails.shippingAddress;
  
  const container = document.getElementById('receipt-items-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  orderDetails.items.forEach((item) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'receipt-item-row';
    
    const garmentName = window.Garments.GARMENT_TYPES[item.type]?.name || 'Prenda';
    
    itemEl.innerHTML = `
      <div>
        <span class="qty">${item.qty}x</span>
        <span>${garmentName} (${item.size})</span>
      </div>
      <span>${window.Cart.formatCurrency(item.totalPrice)}</span>
    `;
    
    container.appendChild(itemEl);
  });
  
  // Start the celebration confetti!
  startConfettiCelebration();
}

function startConfettiCelebration() {
  const canvas = document.getElementById('success-confetti');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  const colors = ['#00f0ff', '#ff007f', '#d000ff', '#ff0044', '#39ff14', '#ffff00'];
  const particles = [];
  const particleCount = 150;
  
  class ConfettiParticle {
    constructor() {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2 + 50; // shoot from check badge
      this.size = Math.random() * 6 + 4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 3;
      
      this.gravity = 0.15;
      this.drag = 0.97;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 10 - 5;
      this.opacity = 1.0;
    }
    
    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;
      
      this.x += this.vx;
      this.y += this.vy;
      
      this.rotation += this.rotationSpeed;
      
      if (this.y > canvas.height * 0.7) {
        this.opacity -= 0.015;
      }
    }
    
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
      ctx.restore();
    }
  }
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new ConfettiParticle());
  }
  
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let activeParticles = 0;
    
    particles.forEach((p) => {
      if (p.opacity > 0 && p.y < canvas.height) {
        p.update();
        p.draw();
        activeParticles++;
      }
    });
    
    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(tick);
    }
  }
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  
  tick();
  
  setTimeout(() => {
    if (document.getElementById('screen-success').classList.contains('active')) {
      for (let i = 0; i < 40; i++) {
        const pL = new ConfettiParticle();
        pL.x = canvas.width * 0.2;
        pL.y = canvas.height * 0.4;
        pL.vx = Math.random() * 4 + 2;
        pL.vy = Math.random() * -6 - 2;
        particles.push(pL);
        
        const pR = new ConfettiParticle();
        pR.x = canvas.width * 0.8;
        pR.y = canvas.height * 0.4;
        pR.vx = Math.random() * -4 - 2;
        pR.vy = Math.random() * -6 - 2;
        particles.push(pR);
      }
    }
  }, 800);
}

function stopConfettiCelebration() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

// Expose variables globally
window.Success = {
  renderReceipt,
  stopConfettiCelebration
};
