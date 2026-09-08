export type WallpaperStyle =
  | 'aura'             // 弥散渐变 / 柔光流体
  | 'bauhaus'          // 包豪斯几何 / 构成主义
  | 'japanese-zen'     // 日式日轮与极简波浪
  | 'nordic-arch'      // 北欧拱门与悬浮球体
  | 'topo-contours'    // 抽象等高线 / 地形波纹
  | 'prismatic-angle'  // 棱镜折角 / 几何切面
  | 'zen-monolith'     // 静谧石碑与几何平衡
  | 'flow-waves'       // 极简正弦波浪层叠
  | 'cyber-grid'       // 极简透视网格与地平线
  | 'color-field';     // 色彩场域 / 极简色块

export type DeviceType = 'phone' | 'tablet' | 'pc' | 'fullscreen';

export type OverlayMode = 'clean' | 'lockscreen' | 'desktop-os';

export interface ColorStop {
  color: string;
  position: number; // 0 to 100
}

export interface Palette {
  id: string;
  name: string;
  category: 'minimal' | 'warm' | 'cool' | 'vibrant' | 'dark' | 'earth';
  colors: string[];
}

export interface WallpaperConfig {
  id: string;
  title: string;
  style: WallpaperStyle;
  paletteId: string;
  colors: string[];
  gradientType: 'linear' | 'radial' | 'conic';
  angle: number;           // 0 - 360
  scale: number;           // 0.5 - 2.0
  complexity: number;      // 1 - 10
  blur: number;            // 0 - 80px
  noiseIntensity: number;  // 0 - 40 (film grain %)
  contrast: number;        // 80 - 140
  brightness: number;      // 80 - 120
  saturation: number;      // 0 - 150
  blendMode: GlobalCompositeOperation;
  elementOffset: { x: number; y: number }; // -50 to 50 %
  shapeType: 'circle' | 'arch' | 'polygon' | 'wave' | 'grid' | 'contour';
  showShadows: boolean;
  strokeWidth: number;     // 0 - 12
  strokeColor: string;
  hasTypography: boolean;
  typographyText?: string;
  typographySubtext?: string;
  typographyPosition?: 'center' | 'bottom-left' | 'bottom-right' | 'top-left';
  seed: number;
}

export interface ExportResolution {
  label: string;
  name: string;
  width: number;
  height: number;
  category: 'pc' | 'phone' | 'tablet' | 'custom';
  ratio: string;
}
