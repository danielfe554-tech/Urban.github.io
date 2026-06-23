/**
 * Canvas overlay editor.
 * Manages draggable, resizable, and rotatable layers (text/images)
 * overlaying the customizable garment.
 */

let activeLayer = null;
let isDragging = false;
let isScaling = false;
let isRotating = false;

let startX, startY;
let startLeft, startTop;
let startScale, startRotation;
let layerCenter = { x: 0, y: 0 };

// Render all layers onto the overlay container
function renderCanvasLayers(container, layers, onLayerSelected, onLayersChanged) {
  container.innerHTML = '';
  
  layers.forEach((layer) => {
    const layerEl = document.createElement('div');
    layerEl.className = `canvas-layer ${activeLayer && activeLayer.id === layer.id ? 'selected' : ''}`;
    layerEl.dataset.id = layer.id;
    
    // Style coordinates and transforms
    layerEl.style.left = `${layer.x}px`;
    layerEl.style.top = `${layer.y}px`;
    layerEl.style.transform = `rotate(${layer.rotation}deg) scale(${layer.scale})`;
    
    // Content rendering
    if (layer.type === 'text') {
      layerEl.style.fontFamily = layer.font;
      layerEl.style.color = layer.color;
      layerEl.style.fontSize = '18px'; // Base size, scaled via transform
      layerEl.style.fontWeight = layer.bold ? 'bold' : 'normal';
      layerEl.style.fontStyle = layer.italic ? 'italic' : 'normal';
      layerEl.textContent = layer.content;
    } else if (layer.type === 'image') {
      const img = document.createElement('img');
      img.src = layer.content;
      img.style.width = '80px'; // Base width, scaled via transform
      img.style.height = 'auto';
      layerEl.appendChild(img);
    }
    
    // Create handles
    // Delete handle
    const deleteHandle = document.createElement('div');
    deleteHandle.className = 'handle-delete';
    deleteHandle.innerHTML = '&times;';
    deleteHandle.title = 'Eliminar';
    deleteHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      deleteActiveLayer(layers, onLayersChanged);
    });
    deleteHandle.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      e.preventDefault();
      deleteActiveLayer(layers, onLayersChanged);
    });
    layerEl.appendChild(deleteHandle);

    // Rotate handle
    const rotateHandle = document.createElement('div');
    rotateHandle.className = 'layer-handle handle-rotate';
    layerEl.appendChild(rotateHandle);

    // Scale handle
    const scaleHandle = document.createElement('div');
    scaleHandle.className = 'layer-handle handle-scale-br';
    layerEl.appendChild(scaleHandle);
    
    // Setup mouse/touch interactions for this layer element
    setupInteraction(layerEl, layer, container, layers, onLayerSelected, onLayersChanged);
    
    container.appendChild(layerEl);
  });
}

function deleteActiveLayer(layers, onLayersChanged) {
  if (activeLayer) {
    const index = layers.findIndex(l => l.id === activeLayer.id);
    if (index !== -1) {
      layers.splice(index, 1);
      activeLayer = null;
      onLayersChanged();
    }
  }
}

function getActiveLayer() {
  return activeLayer;
}

function setActiveLayer(layer) {
  activeLayer = layer;
}

// Attach event listeners for mouse/touch on the layer and its handles
function setupInteraction(element, layer, container, layers, onLayerSelected, onLayersChanged) {
  
  // Selection
  const selectHandler = (e) => {
    e.stopPropagation();
    if (activeLayer && activeLayer.id === layer.id) return;
    activeLayer = layer;
    onLayerSelected(layer);
    
    // Re-render to show active borders
    renderCanvasLayers(container, layers, onLayerSelected, onLayersChanged);
  };
  
  element.addEventListener('mousedown', selectHandler);
  element.addEventListener('touchstart', selectHandler);
  
  // Drag / Scale / Rotate controller
  const startInteraction = (e) => {
    e.stopPropagation();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    startX = clientX;
    startY = clientY;
    
    startLeft = layer.x;
    startTop = layer.y;
    startScale = layer.scale;
    startRotation = layer.rotation;
    
    // Get center of element to calculate rotation angles & scale distances
    const rect = element.getBoundingClientRect();
    layerCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    
    const target = e.target;
    
    if (target.classList.contains('handle-scale-br')) {
      isScaling = true;
      isDragging = false;
      isRotating = false;
    } else if (target.classList.contains('handle-rotate')) {
      isRotating = true;
      isDragging = false;
      isScaling = false;
    } else {
      isDragging = true;
      isScaling = false;
      isRotating = false;
    }
    
    document.addEventListener('mousemove', moveInteraction);
    document.addEventListener('mouseup', stopInteraction);
    document.addEventListener('touchmove', moveInteraction, { passive: false });
    document.addEventListener('touchend', stopInteraction);
  };
  
  element.addEventListener('mousedown', startInteraction);
  element.addEventListener('touchstart', startInteraction);

  const moveInteraction = (e) => {
    if (!isDragging && !isScaling && !isRotating) return;
    if (e.cancelable) e.preventDefault(); // Prevent page scroll during drag
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    if (isDragging) {
      const dx = clientX - startX;
      const dy = clientY - startY;
      
      // Keep within reasonable boundaries
      layer.x = Math.max(-50, Math.min(220, startLeft + dx));
      layer.y = Math.max(-50, Math.min(260, startTop + dy));
      
      element.style.left = `${layer.x}px`;
      element.style.top = `${layer.y}px`;
    } 
    
    else if (isScaling) {
      const startDist = Math.hypot(startX - layerCenter.x, startY - layerCenter.y);
      const currentDist = Math.hypot(clientX - layerCenter.x, clientY - layerCenter.y);
      const scaleMultiplier = currentDist / startDist;
      layer.scale = Math.max(0.3, Math.min(4.0, startScale * scaleMultiplier));
      element.style.transform = `rotate(${layer.rotation}deg) scale(${layer.scale})`;
    } 
    
    else if (isRotating) {
      const startAngle = Math.atan2(startY - layerCenter.y, startX - layerCenter.x);
      const currentAngle = Math.atan2(clientY - layerCenter.y, clientX - layerCenter.x);
      const angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
      layer.rotation = (startRotation + angleDiff) % 360;
      element.style.transform = `rotate(${layer.rotation}deg) scale(${layer.scale})`;
    }
  };

  const stopInteraction = () => {
    isDragging = false;
    isScaling = false;
    isRotating = false;
    
    document.removeEventListener('mousemove', moveInteraction);
    document.removeEventListener('mouseup', stopInteraction);
    document.removeEventListener('touchmove', moveInteraction);
    document.removeEventListener('touchend', stopInteraction);
    
    onLayersChanged();
  };
}

// Click outside layers to deselect
function initCanvasDeselect(container, onDeselected) {
  container.addEventListener('mousedown', (e) => {
    if (e.target === container) {
      activeLayer = null;
      onDeselected();
    }
  });
  container.addEventListener('touchstart', (e) => {
    if (e.target === container) {
      activeLayer = null;
      onDeselected();
    }
  });
}

// Expose variables globally
window.CanvasEditor = {
  renderCanvasLayers,
  getActiveLayer,
  setActiveLayer,
  initCanvasDeselect
};
