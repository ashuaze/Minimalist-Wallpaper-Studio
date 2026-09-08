import React, { useState } from 'react';
import { WallpaperConfig, ExportResolution } from '../types';
import { EXPORT_RESOLUTIONS } from '../constants/devices';
import { renderWallpaper } from '../utils/canvasRenderer';
import { Download, Copy, Check, X, Sparkles, Monitor, Smartphone, Tablet, Loader2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WallpaperConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, config }) => {
  const [selectedRes, setSelectedRes] = useState<ExportResolution>(EXPORT_RESOLUTIONS[0]);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState<number>(0.95);
  const [customW, setCustomW] = useState<number>(3840);
  const [customH, setCustomH] = useState<number>(2160);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const targetWidth = isCustom ? customW : selectedRes.width;
  const targetHeight = isCustom ? customH : selectedRes.height;

  const generateWallpaperBlob = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const offscreen = document.createElement('canvas');
      offscreen.width = targetWidth;
      offscreen.height = targetHeight;
      const ctx = offscreen.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Render at target resolution
      renderWallpaper(ctx, config, targetWidth, targetHeight);

      offscreen.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Export failed'));
        },
        format,
        quality
      );
    });
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const blob = await generateWallpaperBlob();
      const ext = format === 'image/png' ? 'png' : format === 'image/jpeg' ? 'jpg' : 'webp';
      const cleanTitle = (config.title || 'wallpaper')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
      const filename = `${cleanTitle}-${targetWidth}x${targetHeight}.${ext}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      setIsExporting(true);
      const offscreen = document.createElement('canvas');
      offscreen.width = targetWidth;
      offscreen.height = targetHeight;
      const ctx = offscreen.getContext('2d');
      if (!ctx) return;
      renderWallpaper(ctx, config, targetWidth, targetHeight);

      offscreen.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        } catch (e) {
          console.warn('Clipboard write failed, fallback to download:', e);
          handleDownload();
        } finally {
          setIsExporting(false);
        }
      }, 'image/png');
    } catch (e) {
      console.error(e);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="export-modal-container"
        className="relative w-full max-w-2xl bg-white dark:bg-[#141414] rounded-xl border border-[#EEEEEE] dark:border-[#222222] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#EEEEEE] dark:border-[#222222]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#FAFAFA] dark:bg-[#1A1A1A] text-[#1A1A1A] dark:text-white border border-[#EEEEEE] dark:border-[#262626]">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-medium tracking-tight text-[#1A1A1A] dark:text-white">
                高清壁纸实时导出 (Export Studio)
              </h2>
              <p className="text-xs text-[#888] dark:text-[#888]">
                支持手机/平板/电脑原生全分辨率 4K 无损导出
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-export"
            onClick={onClose}
            className="p-1.5 text-[#888] hover:text-[#1A1A1A] dark:hover:text-white rounded-md hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Preset Resolutions */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA] dark:text-[#777] block mb-3">
              目标设备尺寸与分辨率 (Target Resolution)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXPORT_RESOLUTIONS.map((res, i) => {
                const isSelected = !isCustom && selectedRes.name === res.name;
                return (
                  <button
                    key={i}
                    type="button"
                    id={`res-option-${i}`}
                    onClick={() => {
                      setIsCustom(false);
                      setSelectedRes(res);
                    }}
                    className={`p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#1A1A1A] dark:border-white ring-1 ring-[#1A1A1A] dark:ring-white bg-[#FAFAFA] dark:bg-[#1A1A1A]'
                        : 'border-[#EEEEEE] dark:border-[#262626] hover:border-[#DDD] dark:hover:border-[#383838]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {res.category === 'pc' && <Monitor className="w-4 h-4 text-[#888]" />}
                      {res.category === 'phone' && <Smartphone className="w-4 h-4 text-[#888]" />}
                      {res.category === 'tablet' && <Tablet className="w-4 h-4 text-[#888]" />}
                      {res.category === 'custom' && <Sparkles className="w-4 h-4 text-[#888]" />}
                      <div>
                        <div className="text-xs font-medium text-[#1A1A1A] dark:text-white">
                          {res.label}
                        </div>
                        <div className="text-[11px] font-mono text-[#888]">
                          {res.width} × {res.height} ({res.ratio})
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-[#1A1A1A] dark:bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Resolution Toggle */}
          <div className="p-3.5 rounded-lg bg-[#FAFAFA] dark:bg-[#1A1A1A] border border-[#EEEEEE] dark:border-[#262626]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#1A1A1A] dark:text-[#EAEAEA]">
                自定义宽高分辨率 (Custom Width & Height)
              </span>
              <input
                id="toggle-custom-res"
                type="checkbox"
                checked={isCustom}
                onChange={(e) => setIsCustom(e.target.checked)}
                className="rounded w-4 h-4 text-[#1A1A1A] focus:ring-[#1A1A1A] dark:bg-[#222]"
              />
            </div>
            {isCustom && (
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#EEEEEE] dark:border-[#262626]">
                <div>
                  <label className="text-[11px] text-[#888] block mb-1">宽度 (px)</label>
                  <input
                    id="input-custom-w"
                    type="number"
                    min="400"
                    max="7680"
                    step="10"
                    value={customW}
                    onChange={(e) => setCustomW(Math.max(100, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs font-mono rounded-md border border-[#EEEEEE] dark:border-[#262626] bg-white dark:bg-[#141414] focus:outline-hidden focus:ring-1 focus:ring-[#1A1A1A] dark:focus:ring-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#888] block mb-1">高度 (px)</label>
                  <input
                    id="input-custom-h"
                    type="number"
                    min="400"
                    max="7680"
                    step="10"
                    value={customH}
                    onChange={(e) => setCustomH(Math.max(100, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-xs font-mono rounded-md border border-[#EEEEEE] dark:border-[#262626] bg-white dark:bg-[#141414] focus:outline-hidden focus:ring-1 focus:ring-[#1A1A1A] dark:focus:ring-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Format & Quality */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA] dark:text-[#777] block mb-2">
                导出格式 (File Format)
              </label>
              <div className="flex rounded-md border border-[#EEEEEE] dark:border-[#262626] p-1 bg-[#FAFAFA] dark:bg-[#1A1A1A]">
                {[
                  { id: 'image/png', label: 'PNG 无损' },
                  { id: 'image/jpeg', label: 'JPEG 压缩' },
                  { id: 'image/webp', label: 'WebP' },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setFormat(fmt.id as any)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded transition ${
                      format === fmt.id
                        ? 'bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]'
                        : 'text-[#888] hover:text-[#1A1A1A] dark:hover:text-white'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#AAAAAA] dark:text-[#777]">品质 (Quality)</span>
                <span className="font-mono text-[#888]">{Math.round(quality * 100)}%</span>
              </div>
              <input
                id="slider-export-quality"
                type="range"
                min="0.8"
                max="1.0"
                step="0.02"
                disabled={format === 'image/png'}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-[2px] cursor-pointer mt-2 disabled:opacity-40"
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-[#EEEEEE] dark:border-[#222222] bg-white dark:bg-[#141414] flex items-center justify-between">
          <div className="text-xs text-[#888] font-mono">
            {targetWidth} × {targetHeight} px
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-copy-clipboard"
              disabled={isExporting}
              onClick={handleCopyToClipboard}
              className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium rounded-md border border-[#EEEEEE] dark:border-[#262626] hover:border-[#DDD] dark:hover:border-[#383838] text-[#1A1A1A] dark:text-[#EAEAEA] transition"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? '已复制到剪贴板' : '复制到剪贴板'}</span>
            </button>

            <button
              type="button"
              id="btn-confirm-download"
              disabled={isExporting}
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A] text-xs font-bold uppercase tracking-widest hover:opacity-90 rounded-md transition-opacity disabled:opacity-50"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : exportSuccess ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>{isExporting ? '正在生成 4K 画布...' : exportSuccess ? '下载已开始!' : '立即下载壁纸'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
