import React, { useRef, useEffect, useState } from 'react';
import { DeviceType, OverlayMode, WallpaperConfig } from '../types';
import { renderWallpaper } from '../utils/canvasRenderer';
import {
  Wifi,
  Battery,
  Download,
  Maximize2,
  Lock,
  Sun,
  Camera,
  Image,
  FileText,
  CheckSquare,
  Mail,
  Clock,
  MapPin,
  Folder,
  Compass,
  Heart,
  Calculator,
  Settings,
  Search,
  Phone,
  MessageCircle,
  Music,
} from 'lucide-react';

interface DeviceMockupProps {
  config: WallpaperConfig;
  deviceType: DeviceType;
  overlayMode: OverlayMode;
  onDeviceChange: (dev: DeviceType) => void;
  onOverlayChange: (mode: OverlayMode) => void;
  onOpenExport: () => void;
}

export const DeviceMockup: React.FC<DeviceMockupProps> = ({
  config,
  deviceType,
  overlayMode,
  onDeviceChange,
  onOverlayChange,
  onOpenExport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTime, setCurrentTime] = useState({ time: '09:41', date: '9月8日 星期一' });

  // Keep simulated lock screen clock fresh
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      const weekStr = weekdays[now.getDay()];
      setCurrentTime({
        time: `${hours}:${mins}`,
        date: `${month}月${day}日 ${weekStr}`,
      });
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Determine canvas internal resolution based on device type for high-res crisp preview
  const getDeviceDimensions = () => {
    switch (deviceType) {
      case 'phone':
        return { w: 1179, h: 2556, aspect: 'aspect-[9/19.5]', maxH: 'max-h-[580px]' };
      case 'tablet':
        return { w: 1668, h: 2388, aspect: 'aspect-[3/4]', maxH: 'max-h-[600px]' };
      case 'pc':
        return { w: 2560, h: 1600, aspect: 'aspect-[16/10]', maxH: 'max-h-[540px]' };
      case 'fullscreen':
      default:
        return { w: 2560, h: 1440, aspect: 'aspect-[16/9]', maxH: 'max-h-[620px]' };
    }
  };

  const { w, h, aspect, maxH } = getDeviceDimensions();

  // Draw to canvas whenever config or device changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    // Render
    renderWallpaper(ctx, config, w, h);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [config, w, h, deviceType]);

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-full min-h-[520px] select-none">
      {/* Header bar matching Clean Minimalism template */}
      <header className="w-full flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-6 shrink-0 max-w-[1100px]">
        {/* Device Switcher Tabs */}
        <div className="flex space-x-6">
          <button
            type="button"
            id="tab-device-desktop"
            onClick={() => onDeviceChange('pc')}
            className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${
              deviceType === 'pc'
                ? 'border-b-2 border-[#1A1A1A] dark:border-white text-[#1A1A1A] dark:text-white'
                : 'text-[#AAA] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            id="tab-device-tablet"
            onClick={() => onDeviceChange('tablet')}
            className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${
              deviceType === 'tablet'
                ? 'border-b-2 border-[#1A1A1A] dark:border-white text-[#1A1A1A] dark:text-white'
                : 'text-[#AAA] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            Tablet
          </button>
          <button
            type="button"
            id="tab-device-mobile"
            onClick={() => onDeviceChange('phone')}
            className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${
              deviceType === 'phone'
                ? 'border-b-2 border-[#1A1A1A] dark:border-white text-[#1A1A1A] dark:text-white'
                : 'text-[#AAA] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            Mobile
          </button>
          <button
            type="button"
            id="tab-device-raw"
            onClick={() => onDeviceChange('fullscreen')}
            className={`text-xs font-bold uppercase tracking-widest pb-1 transition-colors ${
              deviceType === 'fullscreen'
                ? 'border-b-2 border-[#1A1A1A] dark:border-white text-[#1A1A1A] dark:text-white'
                : 'text-[#AAA] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            Canvas
          </button>
        </div>

        {/* Resolution & Overlays Indicator */}
        <div className="flex space-x-4 items-center">
          <span className="text-[11px] font-mono text-[#AAA]">
            {w} × {h} PX
          </span>
          <div className="w-[1px] h-3 bg-[#DDD] dark:bg-[#333]" />

          {/* Quick Overlay Switcher */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              id="btn-overlay-clean"
              onClick={() => onOverlayChange('clean')}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors ${
                overlayMode === 'clean'
                  ? 'bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]'
                  : 'text-[#AAA] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              Clean
            </button>
            <button
              type="button"
              id="btn-overlay-lock"
              onClick={() => onOverlayChange('lockscreen')}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors ${
                overlayMode === 'lockscreen'
                  ? 'bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]'
                  : 'text-[#AAA] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              Lock
            </button>
            <button
              type="button"
              id="btn-overlay-os"
              onClick={() => onOverlayChange('desktop-os')}
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors ${
                overlayMode === 'desktop-os'
                  ? 'bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]'
                  : 'text-[#AAA] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              OS
            </button>
          </div>

          <div className="w-[1px] h-3 bg-[#DDD] dark:bg-[#333]" />

          <button
            type="button"
            id="btn-quick-export"
            onClick={onOpenExport}
            className="text-[#1A1A1A] dark:text-white hover:opacity-60 transition-opacity p-0.5"
            title="导出当前壁纸"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Preview Center Area */}
      <div className="flex-1 relative flex items-center justify-center w-full max-w-[1100px] my-auto">
        {deviceType === 'phone' && (
          // iPhone Frame
          <div
            id="device-mockup-phone"
            className={`relative ${aspect} ${maxH} w-auto shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] rounded-[48px] p-[9px] bg-[#1A1A1A] ring-1 ring-white/20 transition-all duration-300`}
          >
            {/* Inner Screen Bezel */}
            <div className="relative w-full h-full overflow-hidden rounded-[40px] bg-black">
              {/* Wallpaper Canvas */}
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover block"
              />

              {/* Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-[24px] w-[88px] bg-black rounded-full z-30 flex items-center justify-between px-2.5 ring-1 ring-white/10 shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-[#151518] ring-1 ring-stone-800" />
                <div className="w-2 h-2 rounded-full bg-[#0d1b2a]/80" />
              </div>

              {/* Lockscreen Overlay */}
              {overlayMode === 'lockscreen' && (
                <div className="absolute inset-0 z-20 flex flex-col p-4 pt-3 pointer-events-none text-white">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-xs px-2 pt-0.5 drop-shadow">
                    {/* Signal & 5G */}
                    <div className="flex items-center gap-1 opacity-90">
                      <div className="flex items-end gap-[1.5px] h-2.5">
                        <span className="w-[2px] h-[3px] bg-white rounded-[0.5px]" />
                        <span className="w-[2px] h-[5px] bg-white rounded-[0.5px]" />
                        <span className="w-[2px] h-[7px] bg-white rounded-[0.5px]" />
                        <span className="w-[2px] h-[9px] bg-white rounded-[0.5px]" />
                      </div>
                      <span className="text-[10px] font-semibold tracking-tight">5G</span>
                    </div>

                    {/* Wifi & Battery */}
                    <div className="flex items-center gap-1.5 opacity-90">
                      <Wifi className="w-3.5 h-3.5" />
                      <div className="flex items-center">
                        <div className="w-5 h-2.5 rounded-[4px] border border-white/90 p-[1.5px] flex items-center">
                          <div className="w-full h-full bg-white rounded-[1px]" />
                        </div>
                        <div className="w-[1.5px] h-1 bg-white/90 rounded-r-[1px] -ml-[0.5px]" />
                      </div>
                    </div>
                  </div>

                  {/* Clock & Date - authentic iPhone upper-third position with breathing room */}
                  <div className="flex flex-col items-center mt-9 sm:mt-10">
                    <Lock className="w-3.5 h-3.5 text-white/90 drop-shadow-sm mb-1.5" />
                    <span className="text-[13px] font-medium tracking-wide drop-shadow-md text-white/90">
                      {currentTime.date}
                    </span>
                    <h1 className="text-[64px] font-semibold tracking-[-0.035em] leading-[0.9] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)] mt-1 font-sans">
                      {currentTime.time}
                    </h1>
                  </div>

                  {/* Clean Home Bar pushed to the bottom */}
                  <div className="mt-auto flex justify-center pb-2">
                    <div className="w-32 h-1 bg-white/75 rounded-full drop-shadow-md" />
                  </div>
                </div>
              )}

              {/* iPhone Home Screen (Springboard) Simulated Overlay */}
              {overlayMode === 'desktop-os' && (
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-3.5 pt-3 pointer-events-none text-white">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-xs px-2 pt-0.5 drop-shadow">
                    <span className="text-[11px] font-semibold tracking-tight text-white/95">
                      {currentTime.time}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-90">
                      <div className="flex items-end gap-[1.5px] h-2.5">
                        <span className="w-[2px] h-[3px] bg-white rounded-[0.5px]" />
                        <span className="w-[2px] h-[5px] bg-white rounded-[0.5px]" />
                        <span className="w-[2px] h-[7px] bg-white rounded-[0.5px]" />
                        <span className="w-[2px] h-[9px] bg-white rounded-[0.5px]" />
                      </div>
                      <span className="text-[9px] font-bold">5G</span>
                      <div className="flex items-center">
                        <div className="w-4.5 h-2.5 rounded-[4px] border border-white/90 p-[1.5px] flex items-center">
                          <div className="w-3/4 h-full bg-white rounded-[1px]" />
                        </div>
                        <div className="w-[1.5px] h-1 bg-white/90 rounded-r-[1px] -ml-[0.5px]" />
                      </div>
                    </div>
                  </div>

                  {/* iOS App Grid & Widgets */}
                  <div className="flex flex-col gap-3 px-1 my-auto">
                    {/* Row 1: 2x2 Weather Widget + 4 Apps on right */}
                    <div className="grid grid-cols-4 gap-2.5 items-start">
                      {/* Weather 2x2 Widget */}
                      <div className="col-span-2 row-span-2 aspect-square rounded-[18px] bg-gradient-to-b from-sky-500/40 to-blue-600/50 backdrop-blur-xl border border-white/20 p-2.5 flex flex-col justify-between shadow-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-[11px] font-semibold leading-tight">北京</div>
                            <div className="text-[9px] text-white/80">晴朗</div>
                          </div>
                          <Sun className="w-4 h-4 text-amber-300 fill-amber-300" />
                        </div>
                        <div>
                          <div className="text-2xl font-light leading-none">24°</div>
                          <div className="text-[8px] text-white/70 mt-1">最高 27° 最低 18°</div>
                        </div>
                      </div>

                      {/* Right Col 1: Photos */}
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-white shadow-md flex items-center justify-center border border-white/30">
                          <Image className="w-5 h-5 text-amber-500" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">照片</span>
                      </div>

                      {/* Right Col 2: Camera */}
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-[#2C2C2E] shadow-md flex items-center justify-center border border-white/10">
                          <Camera className="w-5 h-5 text-zinc-300" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">相机</span>
                      </div>

                      {/* Right Col 1 Row 2: Notes */}
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-b from-amber-200 to-amber-300 shadow-md flex items-center justify-center border border-white/30">
                          <FileText className="w-5 h-5 text-amber-900" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">备忘录</span>
                      </div>

                      {/* Right Col 2 Row 2: Reminders */}
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-white shadow-md flex items-center justify-center border border-white/30">
                          <CheckSquare className="w-5 h-5 text-sky-500" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">提醒</span>
                      </div>
                    </div>

                    {/* Row 2: 4 classic apps */}
                    <div className="grid grid-cols-4 gap-2.5">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-b from-blue-500 to-blue-600 shadow-md flex items-center justify-center border border-white/20">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">邮件</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-black shadow-md flex items-center justify-center border border-white/15">
                          <Clock className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">时钟</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-b from-emerald-400 to-teal-500 shadow-md flex items-center justify-center border border-white/20">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">地图</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-b from-blue-400 to-indigo-500 shadow-md flex items-center justify-center border border-white/20">
                          <Folder className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">文件</span>
                      </div>
                    </div>

                    {/* Row 3: 4 classic apps */}
                    <div className="grid grid-cols-4 gap-2.5">
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-b from-sky-400 to-blue-600 shadow-md flex items-center justify-center border border-white/20">
                          <Compass className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">App Store</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-white shadow-md flex items-center justify-center border border-white/30">
                          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">健康</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-[#1C1C1E] shadow-md flex items-center justify-center border border-white/10">
                          <Calculator className="w-5 h-5 text-amber-400" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">计算器</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-b from-zinc-400 to-zinc-500 shadow-md flex items-center justify-center border border-white/20">
                          <Settings className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[9px] text-white/95 font-medium drop-shadow leading-tight">设置</span>
                      </div>
                    </div>

                    {/* Search / Page Indicator */}
                    <div className="flex items-center justify-center pt-1">
                      <div className="bg-black/30 backdrop-blur-md px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-white/15 shadow-xs">
                        <Search className="w-2.5 h-2.5 text-white/80" />
                        <span className="text-[9px] font-medium text-white/90">搜索</span>
                      </div>
                    </div>
                  </div>

                  {/* iOS Floating Dock */}
                  <div>
                    <div className="w-full bg-white/20 backdrop-blur-2xl rounded-[28px] p-2 px-3 flex justify-between items-center border border-white/25 shadow-lg mb-1.5">
                      {/* Phone */}
                      <div className="w-10 h-10 rounded-[12px] bg-gradient-to-b from-[#34C759] to-[#248A3D] flex items-center justify-center shadow-md">
                        <Phone className="w-5 h-5 text-white fill-white" />
                      </div>
                      {/* Safari */}
                      <div className="w-10 h-10 rounded-[12px] bg-gradient-to-b from-[#0A84FF] to-[#0051C6] flex items-center justify-center shadow-md">
                        <Compass className="w-5 h-5 text-white" />
                      </div>
                      {/* Messages */}
                      <div className="w-10 h-10 rounded-[12px] bg-gradient-to-b from-[#30D158] to-[#1E8A38] flex items-center justify-center shadow-md">
                        <MessageCircle className="w-5 h-5 text-white fill-white" />
                      </div>
                      {/* Music */}
                      <div className="w-10 h-10 rounded-[12px] bg-gradient-to-b from-[#FC3D39] to-[#D92B27] flex items-center justify-center shadow-md">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    {/* Home Indicator */}
                    <div className="w-32 h-1 bg-white/75 rounded-full mx-auto mb-1 drop-shadow-xs" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {deviceType === 'tablet' && (
          // iPad Pro Style Frame
          <div
            id="device-mockup-tablet"
            className={`relative ${aspect} ${maxH} w-auto shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] rounded-[32px] p-[10px] bg-[#1A1A1A] ring-1 ring-white/20 transition-all duration-300`}
          >
            <div className="relative w-full h-full overflow-hidden rounded-[24px] bg-black">
              <canvas ref={canvasRef} className="w-full h-full object-cover block" />

              {overlayMode === 'lockscreen' && (
                <div className="absolute inset-0 z-20 flex flex-col p-7 pointer-events-none text-white">
                  <div className="flex justify-between items-center text-xs font-semibold px-2">
                    <span>{currentTime.date}</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-3.5 h-3.5" />
                      <span>100%</span>
                      <Battery className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center mt-10 sm:mt-12">
                    <Lock className="w-4 h-4 text-white/90 drop-shadow-sm mb-1.5" />
                    <span className="text-xs font-medium tracking-wide drop-shadow text-white/90">
                      {currentTime.date}
                    </span>
                    <h1 className="text-6xl font-semibold tracking-tight drop-shadow-md mt-1 font-sans">
                      {currentTime.time}
                    </h1>
                  </div>

                  <div className="mt-auto flex justify-center pb-2">
                    <div className="w-32 h-1 bg-white/70 rounded-full" />
                  </div>
                </div>
              )}

              {overlayMode === 'desktop-os' && (
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 pointer-events-none text-white">
                  <div className="flex justify-between items-center text-xs font-semibold px-2">
                    <span>{currentTime.time}</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-3.5 h-3.5" />
                      <Battery className="w-4 h-4" />
                    </div>
                  </div>
                  {/* Tablet App Grid */}
                  <div className="grid grid-cols-6 gap-5 px-4 my-auto">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-md flex items-center justify-center">
                          <span className="text-[10px] font-mono text-white/80">PAD</span>
                        </div>
                        <span className="text-[10px] text-white/90 drop-shadow">功能</span>
                      </div>
                    ))}
                  </div>

                  {/* Tablet Bottom Dock */}
                  <div className="mx-auto bg-white/25 backdrop-blur-xl rounded-2xl p-2 px-6 flex gap-3 border border-white/30 mb-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-xl bg-white/40 backdrop-blur-md border border-white/40" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {deviceType === 'pc' && (
          // MacBook Display Frame
          <div
            id="device-mockup-pc"
            className={`relative ${aspect} ${maxH} w-full max-w-[880px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.25)] rounded-[18px] p-[9px] pb-[15px] bg-[#1A1A1A] ring-1 ring-white/20 transition-all duration-300 flex flex-col`}
          >
            {/* Top Webcam Notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-stone-950" />
            </div>

            {/* Screen Canvas Area */}
            <div className="relative w-full h-full overflow-hidden rounded-[8px] bg-black">
              <canvas ref={canvasRef} className="w-full h-full object-cover block" />

              {/* Mac Menu Bar */}
              {(overlayMode === 'desktop-os' || overlayMode === 'lockscreen') && (
                <div className="absolute top-0 left-0 right-0 h-6 bg-black/40 backdrop-blur-md px-3 flex items-center justify-between text-[11px] text-white/90 border-b border-white/10 z-20 pointer-events-none">
                  <div className="flex items-center gap-3 font-medium">
                    <span className="font-semibold tracking-wide"></span>
                    <span className="hidden sm:inline">文件</span>
                    <span className="hidden sm:inline">编辑</span>
                    <span className="hidden sm:inline">视图</span>
                    <span className="hidden md:inline">壁纸工坊</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Battery className="w-3 h-3" />
                    <Wifi className="w-3 h-3" />
                    <span>{currentTime.date.split(' ')[0]}</span>
                    <span className="font-semibold">{currentTime.time}</span>
                  </div>
                </div>
              )}

              {/* Mac Bottom Dock */}
              {overlayMode === 'desktop-os' && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-xl rounded-2xl p-1.5 px-3 flex gap-2 border border-white/25 shadow-lg z-20 pointer-events-none">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-xl bg-white/40 backdrop-blur-md border border-white/40 shadow-sm flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-white/60" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Laptop Base Notch Accent */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-stone-700 rounded-full" />
          </div>
        )}

        {deviceType === 'fullscreen' && (
          // Clean Raw Canvas
          <div
            id="device-mockup-fullscreen"
            className="relative w-full max-w-[960px] h-full max-h-[600px] aspect-[16/9] rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-white dark:border-[#222]"
          >
            <canvas ref={canvasRef} className="w-full h-full object-cover block" />
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-mono px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
              <Maximize2 className="w-3 h-3" />
              <span>{w} × {h} RAW</span>
            </div>
          </div>
        )}

        {/* Floating Active Palette Pill Badge (from Design HTML) */}
        <div className="absolute -bottom-3 sm:bottom-0 right-2 sm:right-6 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-[#EEE] dark:border-[#2A2A2A] shadow-sm flex items-center space-x-2.5 z-30 pointer-events-none">
          <div className="flex -space-x-1">
            {config.colors.slice(0, 4).map((c, i) => (
              <div
                key={i}
                className="w-3.5 h-3.5 rounded-full border border-white dark:border-[#1A1A1A] shadow-2xs"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter text-[#666] dark:text-[#AAA]">
            Active Palette: {config.title}
          </span>
        </div>
      </div>

      {/* Footer matching Clean Minimalism template */}
      <footer className="mt-4 sm:mt-6 flex justify-between items-center text-[10px] text-[#AAA] font-medium uppercase tracking-[0.2em] w-full max-w-[1100px] px-2 shrink-0">
        <span>Real-time CSS Engine v2.4</span>
        <span>&copy; Minimalist Wallpaper Studio</span>
      </footer>
    </div>
  );
};

