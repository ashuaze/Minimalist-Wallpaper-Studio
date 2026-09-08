/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DeviceType, OverlayMode, WallpaperConfig, WallpaperStyle } from './types';
import { PRESET_WALLPAPERS } from './constants/presets';
import { PALETTES } from './constants/palettes';
import { Header } from './components/Header';
import { DeviceMockup } from './components/DeviceMockup';
import { ControlsPanel } from './components/ControlsPanel';
import { PresetsModal } from './components/PresetsModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [config, setConfig] = useState<WallpaperConfig>(PRESET_WALLPAPERS[0]);
  const [deviceType, setDeviceType] = useState<DeviceType>('phone');
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('lockscreen');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Sync dark mode class with root html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Algorithmic Surprise Me / Randomize Generator
  const handleRandomize = useCallback(() => {
    const styles: WallpaperStyle[] = [
      'aura',
      'bauhaus',
      'japanese-zen',
      'nordic-arch',
      'topo-contours',
      'prismatic-angle',
      'zen-monolith',
      'flow-waves',
      'cyber-grid',
      'color-field',
    ];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const randomPalette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const randomAngle = Math.floor(Math.random() * 72) * 5; // steps of 5 deg
    const randomScale = Number((0.85 + Math.random() * 0.4).toFixed(2));
    const randomComplexity = Math.floor(3 + Math.random() * 6);
    const randomNoise = Math.floor(10 + Math.random() * 15);
    const randomBlur = randomStyle === 'aura' ? Math.floor(35 + Math.random() * 30) : 0;
    const randomSeed = Math.floor(Math.random() * 10000);

    setConfig((prev) => ({
      ...prev,
      id: `random-${Date.now()}`,
      title: `极简灵感 #${Math.floor(Math.random() * 900 + 100)}`,
      style: randomStyle,
      paletteId: randomPalette.id,
      colors: [...randomPalette.colors],
      angle: randomAngle,
      scale: randomScale,
      complexity: randomComplexity,
      blur: randomBlur,
      noiseIntensity: randomNoise,
      strokeColor: randomPalette.colors[randomPalette.colors.length - 1],
      seed: randomSeed,
      elementOffset: {
        x: Math.floor((Math.random() - 0.5) * 20),
        y: Math.floor((Math.random() - 0.5) * 20),
      },
    }));
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAFAFA] dark:bg-[#0E0E0E] font-sans text-[#1A1A1A] dark:text-[#EAEAEA]">
      {/* Top Header Navigation */}
      <Header
        config={config}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left / Center Preview Stage */}
        <div className="flex-1 relative flex flex-col overflow-y-auto bg-[#F5F5F5] dark:bg-[#121212] p-4 lg:p-8">
          <DeviceMockup
            config={config}
            deviceType={deviceType}
            overlayMode={overlayMode}
            onDeviceChange={setDeviceType}
            onOverlayChange={setOverlayMode}
            onOpenExport={() => setIsExportOpen(true)}
          />
        </div>

        {/* Right Controls Panel */}
        <ControlsPanel
          config={config}
          onChange={setConfig}
          onRandomize={handleRandomize}
        />
      </main>

      {/* Presets Gallery Modal */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        currentPresetId={config.id}
        onSelectPreset={(newConfig) => setConfig({ ...newConfig })}
      />

      {/* 4K Real-time Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
      />
    </div>
  );
}
