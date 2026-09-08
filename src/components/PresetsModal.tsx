import React, { useEffect, useRef } from 'react';
import { WallpaperConfig } from '../types';
import { PRESET_WALLPAPERS } from '../constants/presets';
import { renderWallpaper } from '../utils/canvasRenderer';
import { X, Sparkles, Check } from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPresetId: string;
  onSelectPreset: (config: WallpaperConfig) => void;
}

const PresetCard: React.FC<{
  preset: WallpaperConfig;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ preset, isSelected, onSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderWallpaper(ctx, preset, 300, 200);
  }, [preset]);

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col rounded-lg overflow-hidden border cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-[#1A1A1A] dark:border-white ring-1 ring-[#1A1A1A] dark:ring-white'
          : 'border-[#EEEEEE] dark:border-[#262626] hover:border-[#DDD] dark:hover:border-[#383838]'
      }`}
    >
      {/* Thumbnail Canvas */}
      <div className="relative aspect-[16/10] w-full bg-[#FAFAFA] dark:bg-[#1A1A1A] overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Info strip */}
      <div className="p-3 bg-white dark:bg-[#141414] flex flex-col justify-between flex-1">
        <div>
          <h4 className="text-xs font-medium text-[#1A1A1A] dark:text-[#EAEAEA] truncate">
            {preset.title}
          </h4>
          <span className="text-[10px] text-[#AAA] uppercase tracking-wider">
            {preset.style}
          </span>
        </div>
        {/* Colors dots */}
        <div className="flex gap-1.5 mt-2">
          {preset.colors.slice(0, 5).map((col, idx) => (
            <div
              key={idx}
              className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: col }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  currentPresetId,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="presets-modal-container"
        className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-white dark:bg-[#141414] rounded-xl border border-[#EEEEEE] dark:border-[#222222] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#EEEEEE] dark:border-[#222222]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white border border-[#EEEEEE] dark:border-[#262626]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-medium tracking-tight text-[#1A1A1A] dark:text-white">
                极简壁纸灵感画廊 (Presets Gallery)
              </h2>
              <p className="text-xs text-[#888] dark:text-[#888]">
                精心调校的极简美学配比与构图模板
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-presets"
            onClick={onClose}
            className="p-1.5 text-[#888] hover:text-[#1A1A1A] dark:hover:text-white rounded-md hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PRESET_WALLPAPERS.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isSelected={preset.id === currentPresetId}
                onSelect={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EEEEEE] dark:border-[#222222] bg-white dark:bg-[#141414] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#888] hover:text-[#1A1A1A] dark:hover:text-white border border-[#EEEEEE] dark:border-[#262626] rounded-md transition"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
