import { WallpaperConfig } from '../types';

/**
 * Seeded pseudo-random number generator to ensure consistent visual output
 * for the same configuration parameters.
 */
function createSeededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Helper to convert hex to rgba
 */
export function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((char) => char + char).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Main function to render wallpaper onto a canvas context at arbitrary resolution
 */
export function renderWallpaper(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number
) {
  const rng = createSeededRandom(config.seed || 42);
  const colors = config.colors.length >= 2 ? config.colors : ['#0F172A', '#38BDF8', '#F43F5E'];
  const minDim = Math.min(width, height);
  const maxDim = Math.max(width, height);

  // Clear canvas
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Apply basic image adjustments (contrast, brightness, saturation)
  ctx.filter = `contrast(${config.contrast}%) brightness(${config.brightness}%) saturate(${config.saturation}%)`;

  // Draw base background gradient
  drawBaseBackground(ctx, config, width, height, colors);

  // Calculate center with element offset
  const offsetX = (config.elementOffset.x / 100) * width;
  const offsetY = (config.elementOffset.y / 100) * height;
  const centerX = width / 2 + offsetX;
  const centerY = height / 2 + offsetY;

  // Render specific geometric / aesthetic style
  switch (config.style) {
    case 'aura':
      renderAuraStyle(ctx, config, width, height, centerX, centerY, minDim, colors, rng);
      break;
    case 'bauhaus':
      renderBauhausStyle(ctx, config, width, height, centerX, centerY, minDim, colors, rng);
      break;
    case 'japanese-zen':
      renderJapaneseZenStyle(ctx, config, width, height, centerX, centerY, minDim, colors, rng);
      break;
    case 'nordic-arch':
      renderNordicArchStyle(ctx, config, width, height, centerX, centerY, minDim, colors, rng);
      break;
    case 'topo-contours':
      renderTopoContoursStyle(ctx, config, width, height, centerX, centerY, minDim, colors, rng);
      break;
    case 'prismatic-angle':
      renderPrismaticStyle(ctx, config, width, height, centerX, centerY, maxDim, colors, rng);
      break;
    case 'zen-monolith':
      renderZenMonolithStyle(ctx, config, width, height, centerX, centerY, minDim, colors, rng);
      break;
    case 'flow-waves':
      renderFlowWavesStyle(ctx, config, width, height, centerX, centerY, minDim, colors, rng);
      break;
    case 'cyber-grid':
      renderCyberGridStyle(ctx, config, width, height, centerX, centerY, minDim, colors, rng);
      break;
    case 'color-field':
      renderColorFieldStyle(ctx, config, width, height, centerX, centerY, minDim, colors, rng);
      break;
    default:
      renderAuraStyle(ctx, config, width, height, centerX, centerY, minDim, colors, rng);
  }

  // Draw optional minimalist typography
  if (config.hasTypography && config.typographyText) {
    drawMinimalistTypography(ctx, config, width, height);
  }

  ctx.restore();

  // Draw realistic film grain / noise texture if enabled
  if (config.noiseIntensity > 0) {
    applyFilmGrain(ctx, width, height, config.noiseIntensity);
  }
}

/**
 * 1. Base background gradient
 */
function drawBaseBackground(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number,
  colors: string[]
) {
  const rad = (config.angle * Math.PI) / 180;
  const cx = width / 2;
  const cy = height / 2;
  const length = Math.sqrt(width * width + height * height) / 2;

  const x0 = cx - Math.cos(rad) * length;
  const y0 = cy - Math.sin(rad) * length;
  const x1 = cx + Math.cos(rad) * length;
  const y1 = cy + Math.sin(rad) * length;

  let bgGradient: CanvasGradient;

  if (config.gradientType === 'radial') {
    const r = Math.max(width, height) * 0.75 * config.scale;
    bgGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  } else if (config.gradientType === 'conic' && 'createConicGradient' in ctx) {
    bgGradient = ctx.createConicGradient(rad, cx, cy);
  } else {
    bgGradient = ctx.createLinearGradient(x0, y0, x1, y1);
  }

  colors.forEach((col, idx) => {
    const stop = idx / (colors.length - 1);
    bgGradient.addColorStop(Math.min(1, Math.max(0, stop)), col);
  });

  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * 2. Aura Style - Soft ethereal glowing gradient orbs with Gaussian blur
 */
function renderAuraStyle(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number,
  cx: number,
  cy: number,
  dim: number,
  colors: string[],
  rng: () => number
) {
  ctx.save();
  if (config.blur > 0) {
    ctx.filter = `blur(${Math.max(12, (config.blur * dim) / 700)}px)`;
  }

  const orbCount = Math.max(3, config.complexity);
  const baseRadius = (dim * 0.35 * config.scale);

  for (let i = 0; i < orbCount; i++) {
    const angle = (i / orbCount) * Math.PI * 2 + (config.angle * Math.PI) / 180;
    const distance = (dim * 0.18 * (i % 2 === 0 ? 1 : 0.6)) * config.scale;
    const orbX = cx + Math.cos(angle) * distance + (rng() - 0.5) * (dim * 0.15);
    const orbY = cy + Math.sin(angle) * distance + (rng() - 0.5) * (dim * 0.15);
    const radius = baseRadius * (0.7 + rng() * 0.8);

    const orbColor = colors[(i + 1) % colors.length];
    const grad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, radius);
    grad.addColorStop(0, hexToRgba(orbColor, 0.95));
    grad.addColorStop(0.5, hexToRgba(orbColor, 0.5));
    grad.addColorStop(1, hexToRgba(orbColor, 0));

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(orbX, orbY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Central aura focus
  const centerRadius = baseRadius * 1.2;
  const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, centerRadius);
  const highlightColor = colors[colors.length - 1];
  centerGrad.addColorStop(0, hexToRgba(highlightColor, 0.8));
  centerGrad.addColorStop(0.6, hexToRgba(highlightColor, 0.25));
  centerGrad.addColorStop(1, hexToRgba(highlightColor, 0));

  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, centerRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 3. Bauhaus Style - Modernist geometric constructivism
 */
function renderBauhausStyle(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number,
  cx: number,
  cy: number,
  dim: number,
  colors: string[],
  rng: () => number
) {
  ctx.save();
  const rad = (config.angle * Math.PI) / 180;
  const s = config.scale;

  // Main bold circle
  const circleRadius = dim * 0.28 * s;
  ctx.fillStyle = colors[1 % colors.length];
  if (config.showShadows) {
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = dim * 0.04;
    ctx.shadowOffsetY = dim * 0.02;
  }
  ctx.beginPath();
  ctx.arc(cx, cy, circleRadius, 0, Math.PI * 2);
  ctx.fill();

  // Bauhaus semi-circle
  ctx.fillStyle = colors[2 % colors.length];
  ctx.beginPath();
  ctx.arc(cx - dim * 0.1 * s, cy + dim * 0.1 * s, circleRadius * 0.75, rad, rad + Math.PI);
  ctx.closePath();
  ctx.fill();

  // Modernist diagonal bar or rectangle
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rad);
  ctx.fillStyle = colors[3 % colors.length];
  const barW = dim * 0.7 * s;
  const barH = dim * 0.06 * s;
  ctx.fillRect(-barW / 2, -barH / 2 + dim * 0.15 * s, barW, barH);
  ctx.restore();

  // Concentric arc or ring lines
  if (config.strokeWidth > 0 || config.complexity > 3) {
    ctx.strokeStyle = config.strokeColor || colors[colors.length - 1];
    ctx.lineWidth = Math.max(2, (config.strokeWidth || 3) * (dim / 800));
    ctx.beginPath();
    ctx.arc(cx, cy, circleRadius * 1.35, 0, Math.PI * 2);
    ctx.stroke();

    // Additional thin geometric accents
    ctx.beginPath();
    ctx.arc(cx + dim * 0.15 * s, cy - dim * 0.12 * s, circleRadius * 0.4, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Small focal square or dot
  ctx.fillStyle = colors[colors.length - 1];
  const dotR = dim * 0.04 * s;
  ctx.beginPath();
  ctx.arc(cx + dim * 0.22 * s, cy - dim * 0.25 * s, dotR, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 4. Japanese Zen Style - Sun & Concentric Ripples
 */
function renderJapaneseZenStyle(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number,
  cx: number,
  cy: number,
  dim: number,
  colors: string[],
  _rng: () => number
) {
  ctx.save();
  const s = config.scale;

  // Horizon line
  const horizonY = height * 0.62;
  const sunY = Math.min(cy, horizonY - dim * 0.15 * s);
  const sunRadius = dim * 0.24 * s;

  // Zen Celestial Sun
  const sunColor = colors[1 % colors.length];
  ctx.fillStyle = sunColor;
  if (config.showShadows) {
    ctx.shadowColor = hexToRgba(sunColor, 0.4);
    ctx.shadowBlur = dim * 0.05;
  }
  ctx.beginPath();
  ctx.arc(cx, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Ground / Water plane gradient below horizon
  const waterGrad = ctx.createLinearGradient(0, horizonY, 0, height);
  const waterCol1 = colors[2 % colors.length];
  const waterCol2 = colors[3 % colors.length];
  waterGrad.addColorStop(0, waterCol1);
  waterGrad.addColorStop(1, waterCol2);

  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, horizonY, width, height - horizonY);

  // Concentric zen ripples
  const rippleCount = Math.max(4, config.complexity);
  ctx.lineWidth = Math.max(1.5, (config.strokeWidth || 2) * (dim / 800));
  ctx.strokeStyle = config.strokeColor || hexToRgba('#FFFFFF', 0.5);

  for (let i = 1; i <= rippleCount; i++) {
    const rx = sunRadius + i * (dim * 0.06 * s);
    const ry = (rx * 0.32); // ellipse in perspective
    const rippleY = horizonY + i * (dim * 0.045 * s);

    ctx.beginPath();
    ctx.ellipse(cx, rippleY, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Refined crisp horizon accent
  ctx.strokeStyle = hexToRgba(colors[0], 0.7);
  ctx.lineWidth = Math.max(1, dim * 0.002);
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(width, horizonY);
  ctx.stroke();

  ctx.restore();
}

/**
 * 5. Nordic Arch Style - Architectural portal & floating sphere
 */
function renderNordicArchStyle(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number,
  cx: number,
  cy: number,
  dim: number,
  colors: string[],
  _rng: () => number
) {
  ctx.save();
  const s = config.scale;
  const archW = dim * 0.42 * s;
  const archH = dim * 0.65 * s;
  const archX = cx - archW / 2;
  const archY = cy - archH / 2 + dim * 0.05;

  // Ambient back glow behind arch
  const glowGrad = ctx.createRadialGradient(cx, archY + archW / 2, 0, cx, archY + archW / 2, archW * 1.4);
  glowGrad.addColorStop(0, hexToRgba(colors[1], 0.6));
  glowGrad.addColorStop(1, hexToRgba(colors[1], 0));
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, width, height);

  // Arch shape
  ctx.save();
  if (config.showShadows) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = dim * 0.05;
    ctx.shadowOffsetY = dim * 0.03;
  }

  ctx.fillStyle = colors[2 % colors.length];
  ctx.beginPath();
  // Top semi-circle
  ctx.arc(cx, archY + archW / 2, archW / 2, Math.PI, 0, false);
  // Right side
  ctx.lineTo(archX + archW, archY + archH);
  // Bottom
  ctx.lineTo(archX, archY + archH);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Floating Nordic sphere
  const sphereR = dim * 0.12 * s;
  const sphereX = cx + archW * 0.22;
  const sphereY = cy + dim * 0.08;

  // Soft sphere shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(sphereX, sphereY + sphereR * 1.15, sphereR * 0.9, sphereR * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sphere 3D radial shading
  const sphereGrad = ctx.createRadialGradient(
    sphereX - sphereR * 0.35,
    sphereY - sphereR * 0.35,
    sphereR * 0.1,
    sphereX,
    sphereY,
    sphereR
  );
  sphereGrad.addColorStop(0, '#FFFFFF');
  sphereGrad.addColorStop(0.4, colors[colors.length - 1]);
  sphereGrad.addColorStop(1, colors[0]);

  ctx.fillStyle = sphereGrad;
  ctx.beginPath();
  ctx.arc(sphereX, sphereY, sphereR, 0, Math.PI * 2);
  ctx.fill();

  // Minimalist floor line
  ctx.strokeStyle = hexToRgba(colors[colors.length - 1], 0.3);
  ctx.lineWidth = Math.max(1, dim * 0.003);
  ctx.beginPath();
  ctx.moveTo(0, archY + archH);
  ctx.lineTo(width, archY + archH);
  ctx.stroke();

  ctx.restore();
}

/**
 * 6. Topographic Contours Style - Elegant organic contour lines
 */
function renderTopoContoursStyle(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number,
  cx: number,
  cy: number,
  dim: number,
  colors: string[],
  rng: () => number
) {
  ctx.save();
  const count = Math.max(5, config.complexity * 2);
  const s = config.scale;

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const currentRadius = dim * (0.15 + t * 0.8) * s;
    const col = colors[(i % (colors.length - 1)) + 1];

    ctx.strokeStyle = col;
    ctx.lineWidth = Math.max(1.5, (config.strokeWidth || 2) * (dim / 800));

    ctx.beginPath();
    const steps = 60;
    for (let j = 0; j <= steps; j++) {
      const angle = (j / steps) * Math.PI * 2;
      // Procedural harmonic wobble
      const wobble =
        Math.sin(angle * 3 + i * 0.7 + config.angle * 0.05) * (dim * 0.035 * s) +
        Math.cos(angle * 5 - i * 0.4) * (dim * 0.02 * s);
      const r = currentRadius + wobble;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * (r * 0.85);

      if (j === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Inner focal ring fill
  const innerCol = colors[colors.length - 1];
  ctx.fillStyle = hexToRgba(innerCol, 0.2);
  ctx.beginPath();
  ctx.arc(cx, cy, dim * 0.12 * s, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 7. Prismatic Angles Style - Faceted angles and crystalline planes
 */
function renderPrismaticStyle(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number,
  cx: number,
  cy: number,
  dim: number,
  colors: string[],
  _rng: () => number
) {
  ctx.save();
  const facets = Math.max(4, config.complexity);
  const rad = (config.angle * Math.PI) / 180;
  const radius = dim * 0.8 * config.scale;

  for (let i = 0; i < facets; i++) {
    const a1 = rad + (i / facets) * Math.PI * 2;
    const a2 = rad + ((i + 1) / facets) * Math.PI * 2;

    const x1 = cx + Math.cos(a1) * radius;
    const y1 = cy + Math.sin(a1) * radius;
    const x2 = cx + Math.cos(a2) * radius;
    const y2 = cy + Math.sin(a2) * radius;

    const facetGrad = ctx.createLinearGradient(cx, cy, (x1 + x2) / 2, (y1 + y2) / 2);
    const colA = colors[i % colors.length];
    const colB = colors[(i + 1) % colors.length];

    facetGrad.addColorStop(0, hexToRgba(colA, 0.85));
    facetGrad.addColorStop(1, hexToRgba(colB, 0.4));

    ctx.fillStyle = facetGrad;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fill();

    // Delicate facet boundary
    ctx.strokeStyle = hexToRgba('#FFFFFF', 0.25);
    ctx.lineWidth = Math.max(1, dim * 0.0015);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 8. Zen Monolith Style - Architectural standing monolith & balance
 */
function renderZenMonolithStyle(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number,
  cx: number,
  cy: number,
  dim: number,
  colors: string[],
  _rng: () => number
) {
  ctx.save();
  const s = config.scale;

  // Background subtle halo
  const haloR = dim * 0.45 * s;
  const haloGrad = ctx.createRadialGradient(cx, cy - dim * 0.05, 0, cx, cy - dim * 0.05, haloR);
  haloGrad.addColorStop(0, hexToRgba(colors[1 % colors.length], 0.7));
  haloGrad.addColorStop(1, hexToRgba(colors[1 % colors.length], 0));
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(cx, cy - dim * 0.05, haloR, 0, Math.PI * 2);
  ctx.fill();

  // The Monolith stone block
  const mW = dim * 0.2 * s;
  const mH = dim * 0.62 * s;
  const mX = cx - mW / 2;
  const mY = cy - mH / 2 + dim * 0.08;

  if (config.showShadows) {
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = dim * 0.06;
    ctx.shadowOffsetY = dim * 0.03;
  }

  const monolithGrad = ctx.createLinearGradient(mX, mY, mX + mW, mY + mH);
  monolithGrad.addColorStop(0, colors[2 % colors.length]);
  monolithGrad.addColorStop(1, colors[3 % colors.length]);

  ctx.fillStyle = monolithGrad;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(mX, mY, mW, mH, dim * 0.015) : ctx.rect(mX, mY, mW, mH);
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // Floating balanced brass/gold sphere above monolith
  const pebbleR = dim * 0.055 * s;
  const pebbleY = mY - pebbleR * 1.5;

  ctx.fillStyle = colors[colors.length - 1];
  ctx.beginPath();
  ctx.arc(cx, pebbleY, pebbleR, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * 9. Flow Waves Style - Smooth trigonometric sinusoidal waves
 */
function renderFlowWavesStyle(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number,
  _cx: number,
  cy: number,
  dim: number,
  colors: string[],
  _rng: () => number
) {
  ctx.save();
  const wavesCount = Math.max(3, config.complexity);
  const s = config.scale;

  for (let i = 0; i < wavesCount; i++) {
    const t = i / wavesCount;
    const waveY = height * 0.35 + t * (height * 0.5) * s;
    const waveColor = colors[(i + 1) % colors.length];

    const grad = ctx.createLinearGradient(0, waveY - dim * 0.2, 0, height);
    grad.addColorStop(0, hexToRgba(waveColor, 0.9));
    grad.addColorStop(1, hexToRgba(colors[0], 0.95));

    ctx.fillStyle = grad;
    if (config.showShadows) {
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = dim * 0.03;
      ctx.shadowOffsetY = -dim * 0.01;
    }

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, waveY);

    const segments = 40;
    for (let j = 0; j <= segments; j++) {
      const px = (j / segments) * width;
      const freq = 0.003 + (i * 0.001);
      const amp = (dim * 0.08 * s) * (1 - t * 0.3);
      const py = waveY + Math.sin(px * freq + (i * 1.2) + config.angle * 0.03) * amp;
      ctx.lineTo(px, py);
    }

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Wave crest highlight
    if (config.strokeWidth > 0) {
      ctx.strokeStyle = config.strokeColor || hexToRgba('#FFFFFF', 0.4);
      ctx.lineWidth = Math.max(1, (config.strokeWidth || 1) * (dim / 800));
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * 10. Cyber Grid Style - Perspective grid & horizon sun
 */
function renderCyberGridStyle(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number,
  cx: number,
  cy: number,
  dim: number,
  colors: string[],
  _rng: () => number
) {
  ctx.save();
  const horizonY = height * 0.55;
  const s = config.scale;

  // Luminous horizon sun / orb
  const sunRadius = dim * 0.22 * s;
  const sunGrad = ctx.createRadialGradient(cx, horizonY, 0, cx, horizonY, sunRadius);
  const neonCol = colors[colors.length - 1];
  sunGrad.addColorStop(0, hexToRgba(neonCol, 1));
  sunGrad.addColorStop(0.7, hexToRgba(colors[2 % colors.length], 0.7));
  sunGrad.addColorStop(1, hexToRgba(colors[0], 0));

  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(cx, horizonY, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  // Perspective Grid Lines below horizon
  ctx.strokeStyle = hexToRgba(neonCol, 0.45);
  ctx.lineWidth = Math.max(1, (config.strokeWidth || 1.5) * (dim / 800));

  // Vanishing perspective rays
  const rays = 18;
  for (let i = 0; i <= rays; i++) {
    const bottomX = (i / rays) * width * 1.4 - width * 0.2;
    ctx.beginPath();
    ctx.moveTo(cx, horizonY);
    ctx.lineTo(bottomX, height);
    ctx.stroke();
  }

  // Horizontal receding lines (exponential perspective)
  const horizLines = 14;
  for (let i = 1; i <= horizLines; i++) {
    const norm = Math.pow(i / horizLines, 2.2);
    const hy = horizonY + norm * (height - horizonY);

    ctx.strokeStyle = hexToRgba(neonCol, 0.2 + norm * 0.6);
    ctx.beginPath();
    ctx.moveTo(0, hy);
    ctx.lineTo(width, hy);
    ctx.stroke();
  }

  // Horizon glow line
  ctx.strokeStyle = hexToRgba('#FFFFFF', 0.8);
  ctx.lineWidth = Math.max(1, dim * 0.003);
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(width, horizonY);
  ctx.stroke();

  ctx.restore();
}

/**
 * 11. Color Field Style - Soft Rothko-esque blocks
 */
function renderColorFieldStyle(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number,
  cx: number,
  cy: number,
  dim: number,
  colors: string[],
  _rng: () => number
) {
  ctx.save();
  const s = config.scale;
  const blockW = width * 0.75 * s;
  const blockH = height * 0.32 * s;

  if (config.blur > 0) {
    ctx.filter = `blur(${Math.max(8, (config.blur * dim) / 600)}px)`;
  }

  // Top block
  ctx.fillStyle = hexToRgba(colors[1 % colors.length], 0.85);
  ctx.beginPath();
  ctx.roundRect
    ? ctx.roundRect(cx - blockW / 2, cy - blockH * 1.15, blockW, blockH, dim * 0.02)
    : ctx.rect(cx - blockW / 2, cy - blockH * 1.15, blockW, blockH);
  ctx.fill();

  // Bottom block
  ctx.fillStyle = hexToRgba(colors[2 % colors.length], 0.85);
  ctx.beginPath();
  ctx.roundRect
    ? ctx.roundRect(cx - blockW / 2, cy + blockH * 0.15, blockW, blockH, dim * 0.02)
    : ctx.rect(cx - blockW / 2, cy + blockH * 0.15, blockW, blockH);
  ctx.fill();

  ctx.restore();
}

/**
 * 12. Minimalist Typography watermark / title
 */
function drawMinimalistTypography(
  ctx: CanvasRenderingContext2D,
  config: WallpaperConfig,
  width: number,
  height: number
) {
  ctx.save();
  const minDim = Math.min(width, height);
  const fontSize = Math.max(12, Math.round(minDim * 0.035));
  const subFontSize = Math.round(fontSize * 0.45);
  const padding = minDim * 0.06;

  ctx.fillStyle = hexToRgba('#FFFFFF', 0.85);
  ctx.textBaseline = 'alphabetic';

  let x = padding;
  let y = height - padding;
  let align: CanvasTextAlign = 'left';

  switch (config.typographyPosition) {
    case 'center':
      x = width / 2;
      y = height / 2;
      align = 'center';
      break;
    case 'bottom-right':
      x = width - padding;
      y = height - padding;
      align = 'right';
      break;
    case 'top-left':
      x = padding;
      y = padding + fontSize;
      align = 'left';
      break;
    case 'bottom-left':
    default:
      x = padding;
      y = height - padding;
      align = 'left';
  }

  ctx.textAlign = align;

  // Main text (spaced uppercase)
  ctx.font = `600 ${fontSize}px "Space Grotesk", "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(config.typographyText || '', x, y);

  // Subtext
  if (config.typographySubtext) {
    ctx.font = `400 ${subFontSize}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = hexToRgba('#FFFFFF', 0.55);
    ctx.fillText(config.typographySubtext, x, y + subFontSize * 1.6);
  }

  ctx.restore();
}

/**
 * High-performance film grain / noise texture synthesis
 */
function applyFilmGrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number
) {
  // We generate a smaller tile and pattern it or draw noise buffer
  // To keep 4K exports super fast, we use a 256x256 pattern canvas!
  const tileSize = 256;
  const offscreen = document.createElement('canvas');
  offscreen.width = tileSize;
  offscreen.height = tileSize;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return;

  const imgData = offCtx.createImageData(tileSize, tileSize);
  const data = imgData.data;
  const factor = (intensity / 100) * 80;

  for (let i = 0; i < data.length; i += 4) {
    const val = (Math.random() - 0.5) * factor;
    data[i] = 128 + val;     // R
    data[i + 1] = 128 + val; // G
    data[i + 2] = 128 + val; // B
    data[i + 3] = Math.min(255, (intensity / 100) * 120); // Alpha
  }

  offCtx.putImageData(imgData, 0, 0);

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  const pattern = ctx.createPattern(offscreen, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}

/**
 * Generates pure CSS gradient code for the current wallpaper
 */
export function generateCssGradient(config: WallpaperConfig): string {
  const colors = config.colors;
  if (config.gradientType === 'radial') {
    return `background: radial-gradient(circle at center, ${colors.join(', ')});`;
  }
  if (config.gradientType === 'conic') {
    return `background: conic-gradient(from ${config.angle}deg at 50% 50%, ${colors.join(', ')});`;
  }
  return `background: linear-gradient(${config.angle}deg, ${colors.join(', ')});`;
}
