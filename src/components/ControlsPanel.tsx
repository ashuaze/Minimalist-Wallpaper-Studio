import React, { useState } from 'react';
import { WallpaperConfig, WallpaperStyle, Palette } from '../types';
import { PALETTES } from '../constants/palettes';
import {
  Palette as PaletteIcon,
  Sliders,
  Sparkles,
  Layers,
  Type,
  Shuffle,
  RotateCw,
  SunMedium,
  Grid,
  Droplets,
  Maximize,
  Compass,
} from 'lucide-react';

interface ControlsPanelProps {
  config: WallpaperConfig;
  onChange: (newConfig: WallpaperConfig) => void;
  onRandomize: () => void;
}

const STYLE_OPTIONS: { id: WallpaperStyle; name: string; desc: string }[] = [
  { id: 'aura', name: '弥散流光', desc: 'Ethereal Aura Blur' },
  { id: 'bauhaus', name: '包豪斯几何', desc: 'Modernist Constructivism' },
  { id: 'japanese-zen', name: '日式日轮', desc: 'Zen Sun & Ripples' },
  { id: 'nordic-arch', name: '北欧拱门', desc: 'Nordic Portal & Sphere' },
  { id: 'topo-contours', name: '抽象等高线', desc: 'Topographic Waves' },
  { id: 'prismatic-angle', name: '棱镜折光', desc: 'Prismatic Crystal' },
  { id: 'zen-monolith', name: '原石平衡', desc: 'Monolith Silhouette' },
  { id: 'flow-waves', name: '碧波流体', desc: 'Layered Sine Waves' },
  { id: 'cyber-grid', name: '地平线网格', desc: 'Horizon Cyber Matrix' },
  { id: 'color-field', name: '纯色场域', desc: 'Rothko Color Blocks' },
];

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  config,
  onChange,
  onRandomize,
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'colors' | 'effects' | 'typography'>('style');

  const updateConfig = (partial: Partial<WallpaperConfig>) => {
    onChange({ ...config, ...partial });
  };

  const handlePaletteSelect = (palette: Palette) => {
    updateConfig({
      paletteId: palette.id,
      colors: [...palette.colors],
      strokeColor: palette.colors[palette.colors.length - 1],
    });
  };

  const handleColorChange = (index: number, newColor: string) => {
    const updated = [...config.colors];
    updated[index] = newColor;
    updateConfig({ colors: updated });
  };

  const handleInvertPalette = () => {
    updateConfig({ colors: [...config.colors].reverse() });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#141414] border-l border-[#EEEEEE] dark:border-[#222222] w-full lg:w-[380px] xl:w-[410px] shrink-0 text-[#1A1A1A] dark:text-[#EAEAEA]">
      {/* Panel Navigation Tabs */}
      <div className="flex border-b border-[#EEEEEE] dark:border-[#222222] bg-white dark:bg-[#141414] px-4 gap-3">
        <button
          type="button"
          id="tab-style"
          onClick={() => setActiveTab('style')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
            activeTab === 'style'
              ? 'border-b-2 border-[#1A1A1A] dark:border-white text-[#1A1A1A] dark:text-white'
              : 'text-[#AAA] hover:text-[#1A1A1A] dark:hover:text-white font-medium'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>风格</span>
        </button>

        <button
          type="button"
          id="tab-colors"
          onClick={() => setActiveTab('colors')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
            activeTab === 'colors'
              ? 'border-b-2 border-[#1A1A1A] dark:border-white text-[#1A1A1A] dark:text-white'
              : 'text-[#AAA] hover:text-[#1A1A1A] dark:hover:text-white font-medium'
          }`}
        >
          <PaletteIcon className="w-3 h-3" />
          <span>配色</span>
        </button>

        <button
          type="button"
          id="tab-effects"
          onClick={() => setActiveTab('effects')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
            activeTab === 'effects'
              ? 'border-b-2 border-[#1A1A1A] dark:border-white text-[#1A1A1A] dark:text-white'
              : 'text-[#AAA] hover:text-[#1A1A1A] dark:hover:text-white font-medium'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>质感</span>
        </button>

        <button
          type="button"
          id="tab-typography"
          onClick={() => setActiveTab('typography')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-bold uppercase tracking-widest transition-all ${
            activeTab === 'typography'
              ? 'border-b-2 border-[#1A1A1A] dark:border-white text-[#1A1A1A] dark:text-white'
              : 'text-[#AAA] hover:text-[#1A1A1A] dark:hover:text-white font-medium'
          }`}
        >
          <Type className="w-3 h-3" />
          <span>文字</span>
        </button>
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-7">
        {/* TAB 1: STYLE & GEOMETRY */}
        {activeTab === 'style' && (
          <div className="space-y-6">
            {/* Style Selector */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA] dark:text-[#777] block mb-3">
                构图风格 (Composition Style)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STYLE_OPTIONS.map((st) => {
                  const isActive = config.style === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      id={`style-btn-${st.id}`}
                      onClick={() => updateConfig({ style: st.id, seed: config.seed + 1 })}
                      className={`p-2.5 px-3 rounded-lg text-left border transition-all flex items-center justify-between group ${
                        isActive
                          ? 'border-[#1A1A1A] dark:border-white bg-[#FAFAFA] dark:bg-[#1A1A1A]'
                          : 'border-[#EEEEEE] dark:border-[#262626] hover:border-[#DDD] dark:hover:border-[#383838] bg-white dark:bg-[#141414]'
                      }`}
                    >
                      <div className="truncate pr-1.5">
                        <span className={`text-xs block font-medium ${isActive ? 'text-[#1A1A1A] dark:text-white' : 'text-[#888] group-hover:text-[#1A1A1A] dark:group-hover:text-white'}`}>
                          {st.name}
                        </span>
                        <span className="text-[10px] text-[#AAA] block truncate mt-0.5">
                          {st.desc}
                        </span>
                      </div>
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isActive
                            ? 'bg-[#1A1A1A] dark:bg-white'
                            : 'border border-[#DDD] dark:border-[#444]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Attributes Section */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA] dark:text-[#777] block mb-3">
                几何参数 (Attributes)
              </label>

              {/* Rotation Angle Slider */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] mb-1.5 font-medium">
                    <span className="text-[#1A1A1A] dark:text-[#DDD]">渐变角度 (Angle)</span>
                    <span className="text-[#888] font-mono">{config.angle}°</span>
                  </div>
                  <input
                    id="slider-angle"
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={config.angle}
                    onChange={(e) => updateConfig({ angle: Number(e.target.value) })}
                    className="w-full h-[2px] cursor-pointer"
                  />
                </div>

                {/* Scale Slider */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1.5 font-medium">
                    <span className="text-[#1A1A1A] dark:text-[#DDD]">几何缩放 (Scale)</span>
                    <span className="text-[#888] font-mono">{config.scale.toFixed(2)}x</span>
                  </div>
                  <input
                    id="slider-scale"
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.05"
                    value={config.scale}
                    onChange={(e) => updateConfig({ scale: Number(e.target.value) })}
                    className="w-full h-[2px] cursor-pointer"
                  />
                </div>

                {/* Complexity Slider */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1.5 font-medium">
                    <span className="text-[#1A1A1A] dark:text-[#DDD]">层次与密度 (Complexity)</span>
                    <span className="text-[#888] font-mono">{config.complexity}</span>
                  </div>
                  <input
                    id="slider-complexity"
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={config.complexity}
                    onChange={(e) => updateConfig({ complexity: Number(e.target.value) })}
                    className="w-full h-[2px] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Element Position Offset (X and Y) */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA] dark:text-[#777] block mb-3">
                重心位移 (Offset)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-[#888] mb-1">
                    <span>水平 X</span>
                    <span className="font-mono">{config.elementOffset.x}%</span>
                  </div>
                  <input
                    id="slider-offset-x"
                    type="range"
                    min="-40"
                    max="40"
                    value={config.elementOffset.x}
                    onChange={(e) =>
                      updateConfig({
                        elementOffset: { ...config.elementOffset, x: Number(e.target.value) },
                      })
                    }
                    className="w-full h-[2px] cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-[#888] mb-1">
                    <span>垂直 Y</span>
                    <span className="font-mono">{config.elementOffset.y}%</span>
                  </div>
                  <input
                    id="slider-offset-y"
                    type="range"
                    min="-40"
                    max="40"
                    value={config.elementOffset.y}
                    onChange={(e) =>
                      updateConfig({
                        elementOffset: { ...config.elementOffset, y: Number(e.target.value) },
                      })
                    }
                    className="w-full h-[2px] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Shadows & Line stroke toggle */}
            <div className="pt-3 border-t border-[#EEEEEE] dark:border-[#222222] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#DDD]">
                  空间微阴影 (Ambient Shadow)
                </span>
                <input
                  id="toggle-shadows"
                  type="checkbox"
                  checked={config.showShadows}
                  onChange={(e) => updateConfig({ showShadows: e.target.checked })}
                  className="rounded w-4 h-4 text-[#1A1A1A] focus:ring-[#1A1A1A] dark:bg-[#222]"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-[#888] mb-1">
                  <span>线条轮廓粗细 (Line Stroke)</span>
                  <span className="font-mono">{config.strokeWidth}px</span>
                </div>
                <input
                  id="slider-stroke"
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={config.strokeWidth}
                  onChange={(e) => updateConfig({ strokeWidth: Number(e.target.value) })}
                  className="w-full h-[2px] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLOR PALETTES */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex items-center justify-between pb-2 border-b border-[#EEEEEE] dark:border-[#222222]">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA] dark:text-[#777]">
                极简调色盘 (Palette)
              </label>
              <button
                type="button"
                id="btn-invert-palette"
                onClick={handleInvertPalette}
                className="text-xs text-[#888] hover:text-[#1A1A1A] dark:hover:text-white flex items-center gap-1 px-2 py-1 border border-[#EEEEEE] dark:border-[#262626] rounded transition-colors"
              >
                <RotateCw className="w-3 h-3" />
                <span>反转色序</span>
              </button>
            </div>

            {/* Palettes Grid */}
            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {PALETTES.map((pal) => {
                const isSelected = config.paletteId === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    id={`palette-btn-${pal.id}`}
                    onClick={() => handlePaletteSelect(pal)}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'border-[#1A1A1A] dark:border-white ring-1 ring-[#1A1A1A] dark:ring-white bg-[#FAFAFA] dark:bg-[#1A1A1A]'
                        : 'border-[#EEEEEE] dark:border-[#262626] hover:border-[#DDD] dark:hover:border-[#383838]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#EAEAEA]">
                        {pal.name}
                      </span>
                      <span className="text-[10px] text-[#AAA] uppercase">{pal.category}</span>
                    </div>
                    {/* Palette Swatches Strip */}
                    <div className="flex h-3.5 w-full rounded overflow-hidden ring-1 ring-black/5">
                      {pal.colors.map((c, idx) => (
                        <div key={idx} className="flex-1 h-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fine-tune Individual Colors */}
            <div className="pt-3 border-t border-[#EEEEEE] dark:border-[#222222] space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA] dark:text-[#777] block">
                调色微调 (Stops)
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {config.colors.map((color, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <label
                      htmlFor={`color-input-${idx}`}
                      className="w-8 h-8 rounded-full border border-white dark:border-[#222] shadow-sm cursor-pointer overflow-hidden relative flex items-center justify-center ring-2 ring-offset-2 ring-[#EEEEEE] hover:ring-[#1A1A1A] dark:ring-[#333] transition-all"
                      style={{ backgroundColor: color }}
                    >
                      <input
                        id={`color-input-${idx}`}
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(idx, e.target.value)}
                        className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                      />
                    </label>
                    <span className="text-[10px] font-mono text-[#AAA]">#{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Type */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA] dark:text-[#777] block mb-2">
                渐变基底类型 (Gradient Type)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['linear', 'radial', 'conic'] as const).map((gType) => (
                  <button
                    key={gType}
                    type="button"
                    id={`gradient-type-${gType}`}
                    onClick={() => updateConfig({ gradientType: gType })}
                    className={`py-2 text-xs font-medium rounded-md border transition-all ${
                      config.gradientType === gType
                        ? 'bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] border-transparent'
                        : 'border-[#EEEEEE] dark:border-[#262626] text-[#888] hover:text-[#1A1A1A] dark:hover:text-white'
                    }`}
                  >
                    {gType === 'linear' && '线性 Linear'}
                    {gType === 'radial' && '径向 Radial'}
                    {gType === 'conic' && '角向 Conic'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: GRAIN & EFFECTS */}
        {activeTab === 'effects' && (
          <div className="space-y-6">
            {/* Film Grain Intensity */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#DDD] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#AAA]" />
                  胶片微噪点 (Film Grain)
                </span>
                <span className="text-xs font-mono text-[#888]">{config.noiseIntensity}%</span>
              </div>
              <p className="text-[11px] text-[#AAA] mb-2">
                赋予壁纸画廊印刷级细腻颗粒感，消除数字色阶条纹。
              </p>
              <input
                id="slider-noise"
                type="range"
                min="0"
                max="40"
                step="1"
                value={config.noiseIntensity}
                onChange={(e) => updateConfig({ noiseIntensity: Number(e.target.value) })}
                className="w-full h-[2px] cursor-pointer"
              />
            </div>

            {/* Blur Factor */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#DDD] flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-[#AAA]" />
                  柔光弥散 (Atmospheric Blur)
                </span>
                <span className="text-xs font-mono text-[#888]">{config.blur}px</span>
              </div>
              <input
                id="slider-blur"
                type="range"
                min="0"
                max="80"
                step="2"
                value={config.blur}
                onChange={(e) => updateConfig({ blur: Number(e.target.value) })}
                className="w-full h-[2px] cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#DDD] flex items-center gap-1.5">
                  <SunMedium className="w-3.5 h-3.5 text-[#AAA]" />
                  对比度 (Contrast)
                </span>
                <span className="text-xs font-mono text-[#888]">{config.contrast}%</span>
              </div>
              <input
                id="slider-contrast"
                type="range"
                min="80"
                max="140"
                step="1"
                value={config.contrast}
                onChange={(e) => updateConfig({ contrast: Number(e.target.value) })}
                className="w-full h-[2px] cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#DDD]">
                  饱和度 (Saturation)
                </span>
                <span className="text-xs font-mono text-[#888]">{config.saturation}%</span>
              </div>
              <input
                id="slider-saturation"
                type="range"
                min="0"
                max="150"
                step="2"
                value={config.saturation}
                onChange={(e) => updateConfig({ saturation: Number(e.target.value) })}
                className="w-full h-[2px] cursor-pointer"
              />
            </div>

            {/* Brightness */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#DDD]">
                  明亮度 (Brightness)
                </span>
                <span className="text-xs font-mono text-[#888]">{config.brightness}%</span>
              </div>
              <input
                id="slider-brightness"
                type="range"
                min="80"
                max="120"
                step="1"
                value={config.brightness}
                onChange={(e) => updateConfig({ brightness: Number(e.target.value) })}
                className="w-full h-[2px] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 4: TYPOGRAPHY WATERMARK */}
        {activeTab === 'typography' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEE] dark:border-[#222222]">
              <div>
                <span className="text-xs font-medium text-[#1A1A1A] dark:text-white block">
                  启用极简文字水印
                </span>
                <span className="text-[11px] text-[#AAA]">
                  在壁纸角落呈现极简字样
                </span>
              </div>
              <input
                id="toggle-typography"
                type="checkbox"
                checked={config.hasTypography}
                onChange={(e) => updateConfig({ hasTypography: e.target.checked })}
                className="rounded w-4 h-4 text-[#1A1A1A] focus:ring-[#1A1A1A] dark:bg-[#222]"
              />
            </div>

            {config.hasTypography && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#DDD] block mb-1">
                    主标题文字 (Title)
                  </label>
                  <input
                    id="input-typography-title"
                    type="text"
                    value={config.typographyText || ''}
                    onChange={(e) => updateConfig({ typographyText: e.target.value })}
                    placeholder="例如: LUMINA / CALM"
                    className="w-full px-3 py-2 text-xs rounded-md border border-[#EEEEEE] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#1A1A1A] focus:outline-hidden focus:ring-1 focus:ring-[#1A1A1A] dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#DDD] block mb-1">
                    副标题 / 格言说明 (Subtitle)
                  </label>
                  <input
                    id="input-typography-subtitle"
                    type="text"
                    value={config.typographySubtext || ''}
                    onChange={(e) => updateConfig({ typographySubtext: e.target.value })}
                    placeholder="例如: LESS IS MORE / 2026"
                    className="w-full px-3 py-2 text-xs rounded-md border border-[#EEEEEE] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#1A1A1A] focus:outline-hidden focus:ring-1 focus:ring-[#1A1A1A] dark:focus:ring-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-[#1A1A1A] dark:text-[#DDD] block mb-1">
                    对齐方位 (Placement)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'bottom-left', label: '左下角 (Bottom Left)' },
                      { id: 'bottom-right', label: '右下角 (Bottom Right)' },
                      { id: 'center', label: '中央 (Center)' },
                      { id: 'top-left', label: '左上角 (Top Left)' },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        id={`pos-btn-${pos.id}`}
                        onClick={() =>
                          updateConfig({ typographyPosition: pos.id as any })
                        }
                        className={`py-2 text-xs font-medium rounded-md border transition-all ${
                          config.typographyPosition === pos.id
                            ? 'bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] border-transparent'
                            : 'border-[#EEEEEE] dark:border-[#262626] text-[#888] hover:text-[#1A1A1A] dark:hover:text-white'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action: Randomize Inspiration Button */}
      <div className="p-4 border-t border-[#EEEEEE] dark:border-[#222222] bg-white dark:bg-[#141414]">
        <button
          type="button"
          id="btn-random-generate"
          onClick={onRandomize}
          className="w-full bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-md flex items-center justify-center gap-2"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>随机生成灵感壁纸 (Randomize)</span>
        </button>
      </div>
    </div>
  );
};
