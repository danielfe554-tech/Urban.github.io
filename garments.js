/**
 * Detailed SVGs for customizable garments (delantero y trasero)
 * Supports coloring Body, Sleeves, and Collar/Details separately.
 * Features linear gradients and crease overlays for a premium 3D look.
 */

const GARMENT_TYPES = {
  hoodie: {
    name: 'Buso / Hoodie',
    price: 45000,
    parts: ['body', 'sleeves', 'collar']
  },
  shirt: {
    name: 'Camisa Casual',
    price: 38000,
    parts: ['body', 'sleeves', 'collar']
  },
  tshirt: {
    name: 'Camiseta Streetwear',
    price: 25000,
    parts: ['body', 'sleeves', 'collar']
  },
  polo: {
    name: 'Camisa Polo',
    price: 32000,
    parts: ['body', 'sleeves', 'collar']
  }
};

const COLOR_PALETTE = {
  body: [
    { name: 'Negro Mate', value: '#0f0f12', glow: '#2b2b35' },
    { name: 'Blanco Crudo', value: '#ececf2', glow: '#ffffff' },
    { name: 'Azul Eléctrico', value: '#0055ff', glow: '#0055ff' },
    { name: 'Rojo Carmesí', value: '#b3002b', glow: '#b3002b' },
    { name: 'Verde Militar', value: '#2e4231', glow: '#2e4231' },
    { name: 'Gris Melange', value: '#7d7d8c', glow: '#7d7d8c' },
    { name: 'Amarillo Mostaza', value: '#e5a600', glow: '#e5a600' }
  ],
  sleeves: [
    { name: 'Negro Mate', value: '#0f0f12', glow: '#2b2b35' },
    { name: 'Blanco Crudo', value: '#ececf2', glow: '#ffffff' },
    { name: 'Azul Eléctrico', value: '#0055ff', glow: '#0055ff' },
    { name: 'Rojo Carmesí', value: '#b3002b', glow: '#b3002b' },
    { name: 'Verde Militar', value: '#2e4231', glow: '#2e4231' },
    { name: 'Gris Melange', value: '#7d7d8c', glow: '#7d7d8c' },
    { name: 'Amarillo Mostaza', value: '#e5a600', glow: '#e5a600' }
  ],
  collar: [
    { name: 'Negro Mate', value: '#0f0f12', glow: '#2b2b35' },
    { name: 'Blanco Crudo', value: '#ececf2', glow: '#ffffff' },
    { name: 'Azul Eléctrico', value: '#0055ff', glow: '#0055ff' },
    { name: 'Rojo Carmesí', value: '#b3002b', glow: '#b3002b' },
    { name: 'Verde Militar', value: '#2e4231', glow: '#2e4231' },
    { name: 'Gris Melange', value: '#7d7d8c', glow: '#7d7d8c' },
    { name: 'Amarillo Mostaza', value: '#e5a600', glow: '#e5a600' }
  ]
};

// Generates SVG string for garments
function renderGarmentSVG(type, view, colors) {
  const body = colors.body || '#0f0f12';
  const sleeves = colors.sleeves || '#0f0f12';
  const collar = colors.collar || '#0f0f12';

  // Shared gradients and filters for all SVGs
  const sharedDefs = `
    <defs>
      <!-- Shadow Filter for creases -->
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
      <!-- Crease/Fold Layer Softness -->
      <linearGradient id="fold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1"/>
        <stop offset="50%" stop-color="#000000" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.4"/>
      </linearGradient>
    </defs>
  `;

  if (type === 'hoodie') {
    if (view === 'front') {
      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          ${sharedDefs}
          <!-- LEFT SLEEVE -->
          <path class="svg-part" id="part-sleeves-left" d="M110,120 L50,220 C42,235 55,250 68,242 L122,175 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
          <!-- LEFT CUFF -->
          <path class="svg-part" id="part-collar-lcuff" d="M50,220 L44,230 L59,239 L65,229 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>
          
          <!-- RIGHT SLEEVE -->
          <path class="svg-part" id="part-sleeves-right" d="M290,120 L350,220 C358,235 345,250 332,242 L278,175 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
          <!-- RIGHT CUFF -->
          <path class="svg-part" id="part-collar-rcuff" d="M350,220 L356,230 L341,239 L335,229 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>

          <!-- BODY TORSO -->
          <path class="svg-part" id="part-body" d="M120,110 L280,110 L285,160 L295,290 C295,305 280,310 270,310 L130,310 C120,310 105,305 105,290 L115,160 Z" fill="${body}" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
          
          <!-- BOTTOM RIBBING -->
          <path class="svg-part" id="part-collar-bottom" d="M105,290 L295,290 L295,310 C295,315 285,320 275,320 L125,320 C115,320 105,315 105,310 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>

          <!-- POCKET -->
          <path class="svg-part" id="part-collar-pocket" d="M150,230 L250,230 L270,280 L130,280 Z" fill="${body}" filter="url(#shadow)" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
          <!-- POCKET OPENING LINES -->
          <path d="M150,230 L130,280 M250,230 L270,280" stroke="rgba(0,0,0,0.25)" stroke-width="1.5"/>

          <!-- HOOD -->
          <path class="svg-part" id="part-collar" d="M130,110 C130,60 170,45 200,45 C230,45 270,60 270,110 C265,130 250,135 200,135 C150,135 135,130 130,110 Z" fill="${collar}" stroke="rgba(0,0,0,0.1)" stroke-width="2"/>
          <!-- HOOD OPENING AND DRAWSTRINGS -->
          <path d="M165,110 C165,80 180,70 200,70 C220,70 235,80 235,110" fill="none" stroke="rgba(0,0,0,0.3)" stroke-width="3"/>
          <path d="M190,115 L190,165" stroke="#ccc" stroke-width="3" stroke-linecap="round"/>
          <path d="M210,115 L210,175" stroke="#ccc" stroke-width="3" stroke-linecap="round"/>
          
          <!-- FOLDS & CREASES OVERLAY -->
          <path d="M125,120 Q145,150 135,190 M275,120 Q255,150 265,190 M130,285 Q200,270 270,285" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" pointer-events="none"/>
          <path d="M118,150 Q200,165 282,150" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="3" pointer-events="none"/>
        </svg>
      `;
    } else {
      // BACK VIEW
      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          ${sharedDefs}
          <!-- LEFT SLEEVE (MIRRORED FOR BACK) -->
          <path class="svg-part" id="part-sleeves-left" d="M110,120 L50,220 C42,235 55,250 68,242 L122,175 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
          <path class="svg-part" id="part-collar-lcuff" d="M50,220 L44,230 L59,239 L65,229 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>
          
          <!-- RIGHT SLEEVE -->
          <path class="svg-part" id="part-sleeves-right" d="M290,120 L350,220 C358,235 345,250 332,242 L278,175 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
          <path class="svg-part" id="part-collar-rcuff" d="M350,220 L356,230 L341,239 L335,229 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>

          <!-- BODY TORSO -->
          <path class="svg-part" id="part-body" d="M120,110 L280,110 L285,160 L295,290 C295,305 280,310 270,310 L130,310 C120,310 105,305 105,290 L115,160 Z" fill="${body}" stroke="rgba(0,0,0,0.15)" stroke-width="2"/>
          <path class="svg-part" id="part-collar-bottom" d="M105,290 L295,290 L295,310 C295,315 285,320 275,320 L125,320 C115,320 105,315 105,310 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>

          <!-- HOOD (FROM BEHIND, SOLID SHAPE) -->
          <path class="svg-part" id="part-collar" d="M130,110 C130,50 170,40 200,40 C230,40 270,50 270,110 C265,120 240,125 200,125 C160,125 135,120 130,110 Z" fill="${collar}" stroke="rgba(0,0,0,0.12)" stroke-width="2"/>
          
          <!-- CREASES BACK -->
          <path d="M150,150 Q200,160 250,150 M170,220 Q200,230 230,220" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2" pointer-events="none"/>
        </svg>
      `;
    }
  }

  if (type === 'shirt') {
    if (view === 'front') {
      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          ${sharedDefs}
          <!-- SLEEVES -->
          <path class="svg-part" id="part-sleeves-left" d="M120,120 L80,260 C78,268 85,272 92,272 L115,268 L138,180 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>
          <path class="svg-part" id="part-collar-lcuff" d="M80,260 L92,272 L88,276 L76,264 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>
          
          <path class="svg-part" id="part-sleeves-right" d="M280,120 L320,260 C322,268 315,272 308,272 L285,268 L262,180 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>
          <path class="svg-part" id="part-collar-rcuff" d="M320,260 L308,272 L312,276 L324,264 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>

          <!-- BODY TORSO -->
          <path class="svg-part" id="part-body" d="M125,115 L275,115 L285,290 C285,305 275,315 260,315 L140,315 C125,315 115,305 115,290 Z" fill="${body}" stroke="rgba(0,0,0,0.15)"/>
          
          <!-- SHIRT PLACKET (CENTRAL FOLD FOR BUTTONS) -->
          <path d="M196,115 L196,315 M204,115 L204,315" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
          <!-- BUTTONS -->
          <circle cx="200" cy="150" r="3" fill="#fff" stroke="#999" stroke-width="0.5"/>
          <circle cx="200" cy="190" r="3" fill="#fff" stroke="#999" stroke-width="0.5"/>
          <circle cx="200" cy="230" r="3" fill="#fff" stroke="#999" stroke-width="0.5"/>
          <circle cx="200" cy="270" r="3" fill="#fff" stroke="#999" stroke-width="0.5"/>

          <!-- COLLAR -->
          <path class="svg-part" id="part-collar" d="M150,115 L175,130 L200,115 L225,130 L250,115 L200,100 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>

          <!-- POCKET -->
          <path class="svg-part" id="part-collar-pocket" d="M140,150 L175,150 L175,185 L140,185 Z" fill="${body}" stroke="rgba(0,0,0,0.1)"/>
          
          <!-- CREASES -->
          <path d="M135,140 Q150,170 145,210 M265,140 Q250,170 255,210" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" pointer-events="none"/>
        </svg>
      `;
    } else {
      // BACK VIEW
      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          ${sharedDefs}
          <path class="svg-part" id="part-sleeves-left" d="M120,120 L80,260 C78,268 85,272 92,272 L115,268 L138,180 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>
          <path class="svg-part" id="part-collar-lcuff" d="M80,260 L92,272 L88,276 L76,264 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>
          
          <path class="svg-part" id="part-sleeves-right" d="M280,120 L320,260 C322,268 315,272 308,272 L285,268 L262,180 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>
          <path class="svg-part" id="part-collar-rcuff" d="M320,260 L308,272 L312,276 L324,264 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>

          <path class="svg-part" id="part-body" d="M125,115 L275,115 L285,290 C285,305 275,315 260,315 L140,315 C125,315 115,305 115,290 Z" fill="${body}" stroke="rgba(0,0,0,0.15)"/>
          
          <!-- COLLAR BACK -->
          <path class="svg-part" id="part-collar" d="M150,115 C170,110 230,110 250,115 L200,102 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>
          
          <!-- YOKE LINE -->
          <path d="M120,140 L280,140" stroke="rgba(0,0,0,0.2)" stroke-width="1.5"/>
          <path d="M199,140 L199,280" stroke="rgba(0,0,0,0.1)" stroke-width="1" stroke-dasharray="3,3"/>
        </svg>
      `;
    }
  }

  if (type === 'tshirt') {
    if (view === 'front') {
      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          ${sharedDefs}
          <!-- SHORT SLEEVE LEFT -->
          <path class="svg-part" id="part-sleeves-left" d="M120,120 L75,160 C70,165 72,175 80,175 L115,170 L135,150 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>
          <path class="svg-part" id="part-collar-lcuff" d="M75,160 L80,175 L75,175 L71,162 Z" fill="${collar}" stroke="rgba(0,0,0,0.15)"/>
          
          <!-- SHORT SLEEVE RIGHT -->
          <path class="svg-part" id="part-sleeves-right" d="M280,120 L325,160 C330,165 328,175 320,175 L285,170 L265,150 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>
          <path class="svg-part" id="part-collar-rcuff" d="M325,160 L320,175 L325,175 L329,162 Z" fill="${collar}" stroke="rgba(0,0,0,0.15)"/>

          <!-- BODY TORSO -->
          <path class="svg-part" id="part-body" d="M125,120 L275,120 L285,290 C285,302 275,310 260,310 L140,310 C125,310 115,302 115,290 Z" fill="${body}" stroke="rgba(0,0,0,0.12)" stroke-width="1.5"/>

          <!-- COLLAR RIBBING -->
          <path class="svg-part" id="part-collar" d="M170,120 C170,132 230,132 230,120 C230,112 170,112 170,120 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>

          <!-- FOLDS & CREASES OVERLAY -->
          <path d="M130,135 Q145,180 135,230 M270,135 Q255,180 265,230" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" pointer-events="none"/>
          <path d="M125,290 Q200,282 275,290" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="2.5" pointer-events="none"/>
        </svg>
      `;
    } else {
      // BACK VIEW
      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          ${sharedDefs}
          <path class="svg-part" id="part-sleeves-left" d="M120,120 L75,160 C70,165 72,175 80,175 L115,170 L135,150 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>
          <path class="svg-part" id="part-sleeves-right" d="M280,120 L325,160 C330,165 328,175 320,175 L285,170 L265,150 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>

          <path class="svg-part" id="part-body" d="M125,120 L275,120 L285,290 C285,302 275,310 260,310 L140,310 C125,310 115,302 115,290 Z" fill="${body}" stroke="rgba(0,0,0,0.12)" stroke-width="1.5"/>

          <!-- COLLAR RIBBING BACK -->
          <path class="svg-part" id="part-collar" d="M170,120 C170,116 230,116 230,120 L200,112 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>
        </svg>
      `;
    }
  }

  if (type === 'polo') {
    if (view === 'front') {
      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          ${sharedDefs}
          <!-- SHORT SLEEVE LEFT -->
          <path class="svg-part" id="part-sleeves-left" d="M120,120 L75,160 C70,165 72,175 80,175 L115,170 L135,150 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>
          <path class="svg-part" id="part-collar-lcuff" d="M75,170 L80,175 L112,170 L110,166 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>
          
          <!-- SHORT SLEEVE RIGHT -->
          <path class="svg-part" id="part-sleeves-right" d="M280,120 L325,160 C330,165 328,175 320,175 L285,170 L265,150 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>
          <path class="svg-part" id="part-collar-rcuff" d="M325,170 L320,175 L288,170 L290,166 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>

          <!-- BODY TORSO -->
          <path class="svg-part" id="part-body" d="M125,120 L275,120 L285,290 C285,302 275,310 260,310 L140,310 C125,310 115,302 115,290 Z" fill="${body}" stroke="rgba(0,0,0,0.12)" stroke-width="1.5"/>

          <!-- POLO PLACKET -->
          <path d="M195,125 L195,180 L205,180 L205,125 Z" fill="${body}" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
          <!-- BUTTONS -->
          <circle cx="200" cy="142" r="2.5" fill="#fff" stroke="#aaa" stroke-width="0.5"/>
          <circle cx="200" cy="162" r="2.5" fill="#fff" stroke="#aaa" stroke-width="0.5"/>

          <!-- POLO COLLAR (FOLDED OVER) -->
          <path class="svg-part" id="part-collar" d="M170,120 L180,140 L200,128 L220,140 L230,120 C220,110 180,110 170,120 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>

          <!-- CREASES -->
          <path d="M130,135 Q145,180 135,230 M270,135 Q255,180 265,230" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2" pointer-events="none"/>
        </svg>
      `;
    } else {
      // BACK VIEW
      return `
        <svg viewBox="0 0 400 400" width="100%" height="100%">
          ${sharedDefs}
          <path class="svg-part" id="part-sleeves-left" d="M120,120 L75,160 C70,165 72,175 80,175 L115,170 L135,150 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>
          <path class="svg-part" id="part-collar-lcuff" d="M75,170 L80,175 L112,170 L110,166 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>
          
          <path class="svg-part" id="part-sleeves-right" d="M280,120 L325,160 C330,165 328,175 320,175 L285,170 L265,150 Z" fill="${sleeves}" stroke="rgba(0,0,0,0.15)"/>
          <path class="svg-part" id="part-collar-rcuff" d="M325,170 L320,175 L288,170 L290,166 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>

          <path class="svg-part" id="part-body" d="M125,120 L275,120 L285,290 C285,302 275,310 260,310 L140,310 C125,310 115,302 115,290 Z" fill="${body}" stroke="rgba(0,0,0,0.12)" stroke-width="1.5"/>

          <!-- POLO COLLAR BACK -->
          <path class="svg-part" id="part-collar" d="M170,120 C180,112 220,112 230,120 L200,113 Z" fill="${collar}" stroke="rgba(0,0,0,0.2)"/>
        </svg>
      `;
    }
  }
}

// Expose variables globally so standard scripts can load them
window.Garments = {
  GARMENT_TYPES,
  COLOR_PALETTE,
  renderGarmentSVG
};
