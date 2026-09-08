import React from 'react';
import { Download, Sparkles, Moon, Sun, Code2, Library } from 'lucide-react';
import { WallpaperConfig } from '../types';
import { generateCssGradient } from '../utils/canvasRenderer';

interface HeaderProps {
  config: WallpaperConfig;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenPresets: () => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  isDarkMode,
  onToggleDarkMode,
  onOpenPresets,
  onOpenExport,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCss = () => {
    const css = generateCssGradient(config);
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-16 border-b border-[#EEEEEE] dark:border-[#222222] bg-white dark:bg-[#141414] px-4 lg:px-8 flex items-center justify-between z-40 shrink-0 select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1A1A1A] dark:bg-white flex items-center justify-center ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#141414] ring-[#1A1A1A] dark:ring-white">
          <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-[#1A1A1A]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#888] dark:text-[#888]">
              Lumina
            </span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#F5F5F5] dark:bg-[#222222] text-[#888] dark:text-[#AAA] font-medium border border-[#EEEEEE] dark:border-[#2A2A2A]">
              4K Studio
            </span>
          </div>
          <h1 className="text-sm font-medium tracking-tight text-[#1A1A1A] dark:text-white">
            极简壁纸工坊
          </h1>
        </div>
      </div>

      {/* Center / Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Preset Gallery Trigger */}
        <button
          id="btn-open-presets"
          type="button"
          onClick={onOpenPresets}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border border-[#EEEEEE] dark:border-[#2A2A2A] hover:border-[#1A1A1A] dark:hover:border-white text-[#1A1A1A] dark:text-[#EAEAEA] bg-white dark:bg-[#1A1A1A] transition-colors"
        >
          <Library className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">画廊预设</span>
          <span className="sm:hidden">预设</span>
        </button>

        {/* Copy CSS Gradient */}
        <button
          id="btn-copy-css"
          type="button"
          onClick={handleCopyCss}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border border-[#EEEEEE] dark:border-[#2A2A2A] hover:border-[#1A1A1A] dark:hover:border-white text-[#1A1A1A] dark:text-[#EAEAEA] bg-white dark:bg-[#1A1A1A] transition-colors"
          title="复制 CSS 渐变代码"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{copied ? '已复制 CSS!' : '复制 CSS'}</span>
        </button>

        {/* Dark/Light Toggle */}
        <button
          id="btn-toggle-theme"
          type="button"
          onClick={onToggleDarkMode}
          className="p-2 text-[#1A1A1A] dark:text-[#EAEAEA] hover:bg-[#F5F5F5] dark:hover:bg-[#222222] rounded-md border border-[#EEEEEE] dark:border-[#2A2A2A] transition-colors"
          title="切换深浅主题"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Primary Download / Export CTA */}
        <button
          id="btn-header-export"
          type="button"
          onClick={onOpenExport}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:opacity-90 dark:bg-white text-white dark:text-[#1A1A1A] text-xs font-bold uppercase tracking-widest rounded-md shadow-xs transition-all active:scale-[0.98]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export 4K</span>
        </button>
      </div>
    </header>
  );
};
