/**
 * Main application coordinator.
 * Manages global screen navigation, state initialization,
 * event listeners for customizer controls, and connects all modules.
 */

// --- State Variables ---
let currentScreen = 'landing';
let activeGarment = 'hoodie'; // hoodie, shirt, tshirt, polo
let activeView = 'front';     // front, back
let selectedSize = 'M';
let itemQty = 1;

// Colors of parts
let garmentColors = {
  body: '#0f0f12',
  sleeves: '#0f0f12',
  collar: '#0f0f12'
};

// Design Layers (draggable elements)
let designLayers = {
  front: [],
  back: []
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial view load
  showScreen('landing');
  window.Cart.updateCartBadge();
  renderCatalogPreviews();
  
  // 2. Setup Navigation Links
  setupNavigation();
  
  // 3. Setup Customizer Elements
  initColorPalettes();
  initCustomizerControls();
  
  // 4. Setup Checkout
  window.Checkout.initCheckout(handlePaymentSuccess);
  
  // 5. Setup Canvas interactions
  const frontOverlay = document.getElementById('canvas-overlay-front');
  const backOverlay = document.getElementById('canvas-overlay-back');
  const deselectCallback = () => {
    hideActiveLayerControls();
  };
  if (frontOverlay) {
    window.CanvasEditor.initCanvasDeselect(frontOverlay, deselectCallback);
  }
  if (backOverlay) {
    window.CanvasEditor.initCanvasDeselect(backOverlay, deselectCallback);
  }

  // 6. Setup 3D Interactive Tilting
  const workspace = document.querySelector('.canvas-workspace');
  const card = document.getElementById('garment-card-3d');
  if (workspace && card) {
    workspace.addEventListener('mousemove', (e) => {
      const rect = workspace.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const tiltX = -(y / (rect.height / 2)) * 12; // tilt max 12 degrees
      const tiltY = (x / (rect.width / 2)) * 12;
      
      const baseFlip = card.classList.contains('show-back') ? 180 : 0;
      card.style.transform = `rotateY(${baseFlip + tiltY}deg) rotateX(${tiltX}deg)`;
    });

    workspace.addEventListener('mouseleave', () => {
      const baseFlip = card.classList.contains('show-back') ? 180 : 0;
      card.style.transform = `rotateY(${baseFlip}deg) rotateX(0deg)`;
    });
  }
  
  // Lucide icons render
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

// --- Screen Routing ---
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Deactivate navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });

  // Show target screen
  const targetScreen = document.getElementById(`screen-${screenId}`);
  if (targetScreen) {
    targetScreen.classList.remove('hide');
    targetScreen.classList.add('active');
  }
  
  currentScreen = screenId;
  window.scrollTo(0, 0);

  // Set navbar active status
  if (screenId === 'landing') {
    document.querySelector('.nav-link[data-target="landing"]')?.classList.add('active');
    window.Success.stopConfettiCelebration();
  } else if (screenId === 'customizer') {
    document.querySelector('#nav-customizer')?.classList.add('active');
    window.Success.stopConfettiCelebration();
    renderCustomizerGarment();
  } else if (screenId === 'cart') {
    document.querySelector('#nav-cart')?.classList.add('active');
    window.Success.stopConfettiCelebration();
    window.Cart.renderCartItems(onCartItemsChanged);
  } else if (screenId === 'checkout') {
    window.Success.stopConfettiCelebration();
    window.Checkout.renderCheckoutReview();
  }
}

function setupNavigation() {
  // Navbar navigation clicks
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.currentTarget.dataset.target;
      if (target === 'cart-link') {
        showScreen('cart');
      } else {
        showScreen(target);
      }
    });
  });

  // Header bag click
  document.getElementById('cart-btn')?.addEventListener('click', () => {
    showScreen('cart');
  });
  
  // Header Logo click
  document.getElementById('btn-home')?.addEventListener('click', () => {
    showScreen('landing');
  });

  // Hero CTA
  document.getElementById('hero-cta')?.addEventListener('click', () => {
    startCustomizer('hoodie');
  });

  // Catalog item clicks
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const type = e.currentTarget.dataset.garment;
      startCustomizer(type);
    });
  });

  // Checkout flows inside panels
  document.getElementById('btn-goto-checkout')?.addEventListener('click', () => {
    const cart = window.Cart.getCart();
    if (cart.length > 0) {
      showScreen('checkout');
    }
  });

  document.getElementById('btn-continue-shopping')?.addEventListener('click', () => {
    showScreen('customizer');
  });

  document.getElementById('btn-back-home')?.addEventListener('click', () => {
    showScreen('landing');
  });
}

// --- Catalog Previews ---
function renderCatalogPreviews() {
  const defaults = {
    hoodie: { body: '#0f0f12', sleeves: '#ececf2', collar: '#0f0f12' }, // Varsity style
    shirt: { body: '#0055ff', sleeves: '#0055ff', collar: '#ececf2' },  // Contrast collar
    tshirt: { body: '#b3002b', sleeves: '#b3002b', collar: '#0f0f12' }, // Red/Black
    polo: { body: '#2e4231', sleeves: '#2e4231', collar: '#e5a600' }   // Green/Gold
  };

  Object.keys(defaults).forEach(key => {
    const previewContainer = document.getElementById(`preview-${key}`);
    if (previewContainer) {
      previewContainer.innerHTML = window.Garments.renderGarmentSVG(key, 'front', defaults[key]);
    }
  });
}

// --- Customizer Initialization ---
function startCustomizer(garmentType) {
  activeGarment = garmentType;
  activeView = 'front';
  selectedSize = 'M';
  itemQty = 1;

  const basePalette = window.Garments.COLOR_PALETTE.body;
  garmentColors = {
    body: basePalette[0].value,      // Negro Mate
    sleeves: basePalette[0].value,   // Negro Mate
    collar: basePalette[0].value     // Negro Mate
  };

  designLayers = {
    front: [],
    back: []
  };

  document.getElementById('garment-qty').value = 1;
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.size === 'M') btn.classList.add('active');
  });

  document.querySelectorAll('.panel-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.panel-tab[data-tab="colors"]').classList.add('active');
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.getElementById('tab-colors').classList.add('active');

  showScreen('customizer');
}

function initColorPalettes() {
  const parts = ['body', 'sleeves', 'collar'];
  
  parts.forEach(part => {
    const paletteContainer = document.querySelector(`.color-palette[data-target-part="${part}"]`);
    if (!paletteContainer) return;
    
    paletteContainer.innerHTML = '';
    
    window.Garments.COLOR_PALETTE[part].forEach((color, index) => {
      const dot = document.createElement('div');
      dot.className = `color-dot ${index === 0 ? 'active' : ''}`;
      dot.style.backgroundColor = color.value;
      dot.style.setProperty('--active-glow', color.glow + '88');
      dot.title = color.name;
      dot.dataset.colorHex = color.value;
      
      dot.addEventListener('click', (e) => {
        paletteContainer.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        
        garmentColors[part] = color.value;
        renderCustomizerGarment();
      });

      paletteContainer.appendChild(dot);
    });
  });
}

function initCustomizerControls() {
  document.querySelectorAll('.panel-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabId = e.currentTarget.dataset.tab;
      
      document.querySelectorAll('.panel-tab').forEach(btn => btn.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      document.getElementById(`tab-${tabId}`).classList.add('active');
    });
  });

  const textInput = document.getElementById('text-input');
  const textColor = document.getElementById('text-color');
  const textFont = document.getElementById('text-font');
  const textColorLabel = document.getElementById('text-color-label');

  textColor.addEventListener('input', (e) => {
    textColorLabel.textContent = e.target.value.toUpperCase();
  });

  document.getElementById('btn-add-text')?.addEventListener('click', () => {
    const textVal = textInput.value.trim();
    if (!textVal) return;

    const newLayer = {
      id: `layer-${Date.now()}`,
      type: 'text',
      content: textVal,
      x: 30,
      y: 100,
      scale: 1,
      rotation: 0,
      font: textFont.value,
      color: textColor.value,
      bold: false,
      italic: false
    };

    designLayers[activeView].push(newLayer);
    textInput.value = '';
    
    window.CanvasEditor.setActiveLayer(newLayer);
    showActiveLayerControls(newLayer);

    renderCustomizerLayers();
  });

  document.getElementById('btn-text-bold')?.addEventListener('click', () => {
    const active = window.CanvasEditor.getActiveLayer();
    if (active && active.type === 'text') {
      active.bold = !active.bold;
      document.getElementById('btn-text-bold').classList.toggle('active', active.bold);
      renderCustomizerLayers();
    }
  });

  document.getElementById('btn-text-italic')?.addEventListener('click', () => {
    const active = window.CanvasEditor.getActiveLayer();
    if (active && active.type === 'text') {
      active.italic = !active.italic;
      document.getElementById('btn-text-italic').classList.toggle('active', active.italic);
      renderCustomizerLayers();
    }
  });

  document.getElementById('btn-delete-layer')?.addEventListener('click', () => {
    const active = window.CanvasEditor.getActiveLayer();
    if (active) {
      deleteLayerById(active.id);
    }
  });

  document.getElementById('btn-delete-img-layer')?.addEventListener('click', () => {
    const active = window.CanvasEditor.getActiveLayer();
    if (active) {
      deleteLayerById(active.id);
    }
  });

  const imageUpload = document.getElementById('image-upload');
  const uploadZone = document.getElementById('upload-zone');

  uploadZone.addEventListener('click', () => {
    imageUpload.click();
  });

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processUploadedImage(files[0]);
    }
  });

  imageUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processUploadedImage(files[0]);
    }
  });

  document.getElementById('btn-view-front')?.addEventListener('click', (e) => {
    toggleGarmentView('front');
  });

  document.getElementById('btn-view-back')?.addEventListener('click', (e) => {
    toggleGarmentView('back');
  });

  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      selectedSize = e.currentTarget.dataset.size;
    });
  });

  document.getElementById('btn-qty-dec')?.addEventListener('click', () => {
    const qtyInput = document.getElementById('garment-qty');
    let val = parseInt(qtyInput.value) || 1;
    if (val > 1) {
      val--;
      qtyInput.value = val;
      itemQty = val;
      updateCustomizerPriceSummary();
    }
  });

  document.getElementById('btn-qty-inc')?.addEventListener('click', () => {
    const qtyInput = document.getElementById('garment-qty');
    let val = parseInt(qtyInput.value) || 1;
    val++;
    qtyInput.value = val;
    itemQty = val;
    updateCustomizerPriceSummary();
  });

  document.getElementById('garment-qty')?.addEventListener('change', (e) => {
    let val = parseInt(e.target.value) || 1;
    if (val < 1) val = 1;
    e.target.value = val;
    itemQty = val;
    updateCustomizerPriceSummary();
  });

  document.getElementById('btn-add-to-cart')?.addEventListener('click', () => {
    const basePrice = window.Garments.GARMENT_TYPES[activeGarment].price;
    const customCost = calculateCustomizationCost();
    const totalPrice = (basePrice + customCost) * itemQty;
    
    window.CanvasEditor.setActiveLayer(null);
    renderCustomizerLayers();
    
    const cartItem = {
      type: activeGarment,
      colors: { ...garmentColors },
      frontLayers: JSON.parse(JSON.stringify(designLayers.front)),
      backLayers: JSON.parse(JSON.stringify(designLayers.back)),
      size: selectedSize,
      qty: itemQty,
      price: basePrice + customCost,
      totalPrice: totalPrice
    };

    window.Cart.addToCart(cartItem);
    
    textInput.value = '';
    showScreen('cart');
  });
}

function processUploadedImage(file) {
  if (!file.type.match('image.*')) {
    alert('Por favor selecciona un archivo de imagen (PNG, JPG, WEBP).');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert('La imagen excede el límite de 5MB. Por favor sube una imagen más pequeña.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const newLayer = {
      id: `layer-${Date.now()}`,
      type: 'image',
      content: e.target.result,
      x: 50,
      y: 70,
      scale: 1,
      rotation: 0
    };

    designLayers[activeView].push(newLayer);
    
    window.CanvasEditor.setActiveLayer(newLayer);
    showActiveLayerControls(newLayer);

    renderCustomizerLayers();
  };
  reader.readAsDataURL(file);
}

function toggleGarmentView(view) {
  if (activeView === view) return;
  activeView = view;
  
  window.CanvasEditor.setActiveLayer(null);
  hideActiveLayerControls();
  
  document.getElementById('btn-view-front').classList.toggle('active', view === 'front');
  document.getElementById('btn-view-back').classList.toggle('active', view === 'back');
  
  const card3d = document.getElementById('garment-card-3d');
  if (card3d) {
    card3d.classList.toggle('show-back', view === 'back');
  }

  // Update title label
  const garmentName = window.Garments.GARMENT_TYPES[activeGarment]?.name || 'Prenda';
  document.getElementById('current-garment-title').textContent = `${garmentName} (${activeView === 'front' ? 'Frente' : 'Espalda'})`;
}

function renderCustomizerGarment() {
  const frontContainer = document.getElementById('garment-render-container-front');
  if (frontContainer) {
    frontContainer.innerHTML = window.Garments.renderGarmentSVG(activeGarment, 'front', garmentColors);
  }

  const backContainer = document.getElementById('garment-render-container-back');
  if (backContainer) {
    backContainer.innerHTML = window.Garments.renderGarmentSVG(activeGarment, 'back', garmentColors);
  }
  
  const garmentName = window.Garments.GARMENT_TYPES[activeGarment]?.name || 'Prenda';
  document.getElementById('current-garment-title').textContent = `${garmentName} (${activeView === 'front' ? 'Frente' : 'Espalda'})`;

  renderCustomizerLayers();
  updateCustomizerPriceSummary();
}

function renderCustomizerLayers() {
  const frontOverlay = document.getElementById('canvas-overlay-front');
  const backOverlay = document.getElementById('canvas-overlay-back');

  if (frontOverlay) {
    window.CanvasEditor.renderCanvasLayers(
      frontOverlay, 
      designLayers.front, 
      handleLayerSelected, 
      handleLayersChanged
    );
  }

  if (backOverlay) {
    window.CanvasEditor.renderCanvasLayers(
      backOverlay, 
      designLayers.back, 
      handleLayerSelected, 
      handleLayersChanged
    );
  }
}

function handleLayerSelected(layer) {
  showActiveLayerControls(layer);
}

function handleLayersChanged() {
  updateCustomizerPriceSummary();
  // If active layer has been deleted by handles, hide controls
  if (!window.CanvasEditor.getActiveLayer()) {
    hideActiveLayerControls();
  }
}

function deleteLayerById(layerId) {
  const index = designLayers[activeView].findIndex(l => l.id === layerId);
  if (index !== -1) {
    designLayers[activeView].splice(index, 1);
    window.CanvasEditor.setActiveLayer(null);
    hideActiveLayerControls();
    renderCustomizerLayers();
    updateCustomizerPriceSummary();
  }
}

function showActiveLayerControls(layer) {
  const textControls = document.getElementById('text-layer-controls');
  const imgControls = document.getElementById('image-layer-controls');
  
  if (layer.type === 'text') {
    textControls.classList.remove('hide');
    imgControls.classList.add('hide');
    
    document.getElementById('btn-text-bold').classList.toggle('active', layer.bold);
    document.getElementById('btn-text-italic').classList.toggle('active', layer.italic);
  } else if (layer.type === 'image') {
    imgControls.classList.remove('hide');
    textControls.classList.add('hide');
  }
}

function hideActiveLayerControls() {
  document.getElementById('text-layer-controls').classList.add('hide');
  document.getElementById('image-layer-controls').classList.add('hide');
}

function calculateCustomizationCost() {
  let cost = 0;
  const countCost = (layer) => {
    if (layer.type === 'text') {
      cost += 3000;
    } else if (layer.type === 'image') {
      cost += 5000;
    }
  };
  
  designLayers.front.forEach(countCost);
  designLayers.back.forEach(countCost);
  
  return cost;
}

function updateCustomizerPriceSummary() {
  const basePrice = window.Garments.GARMENT_TYPES[activeGarment]?.price || 0;
  const customPrice = calculateCustomizationCost();
  const totalPrice = (basePrice + customPrice) * itemQty;
  
  document.getElementById('summary-garment-name').textContent = window.Garments.GARMENT_TYPES[activeGarment]?.name || 'Prenda';
  document.getElementById('summary-base-price').textContent = window.Cart.formatCurrency(basePrice);
  document.getElementById('summary-custom-price').textContent = window.Cart.formatCurrency(customPrice);
  document.getElementById('summary-total-price').textContent = window.Cart.formatCurrency(totalPrice);
}

function onCartItemsChanged() {
  window.Cart.updateCartBadge();
}

function handlePaymentSuccess(orderDetails) {
  window.Cart.clearCart();
  window.Success.renderReceipt(orderDetails);
  showScreen('success');
}
