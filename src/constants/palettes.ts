import { Palette } from '../types';

export const PALETTES: Palette[] = [
  {
    id: 'swiss-minimal',
    name: '瑞士极简 (Swiss Minimal)',
    category: 'minimal',
    colors: ['#F5F5F7', '#D1D5DB', '#374151', '#111827', '#E11D48'],
  },
  {
    id: 'kyoto-mist',
    name: '京都雾境 (Kyoto Mist)',
    category: 'cool',
    colors: ['#E9ECEF', '#C8D6CF', '#8DA399', '#4E6157', '#25322C'],
  },
  {
    id: 'terracotta-dune',
    name: '陶土沙丘 (Terracotta & Dune)',
    category: 'earth',
    colors: ['#F7EFE8', '#E5BA9E', '#C87D55', '#8C4329', '#3D1D13'],
  },
  {
    id: 'deep-space',
    name: '深空星辉 (Deep Cosmos)',
    category: 'dark',
    colors: ['#0A0B10', '#16192E', '#2B2E4A', '#53567D', '#9399D3'],
  },
  {
    id: 'aura-sunset',
    name: '暮色流光 (Aura Sunset)',
    category: 'warm',
    colors: ['#FFE4D6', '#F8B195', '#F67280', '#C06C84', '#6C5B7B'],
  },
  {
    id: 'nordic-birch',
    name: '北欧白桦 (Nordic Birch & Sage)',
    category: 'cool',
    colors: ['#F4F6F4', '#DDE5B6', '#A9B388', '#6B7A63', '#394634'],
  },
  {
    id: 'tokyo-neon',
    name: '东京霓虹夜 (Tokyo Neon Dusk)',
    category: 'vibrant',
    colors: ['#0B091A', '#241734', '#681B58', '#9F2468', '#00F0FF'],
  },
  {
    id: 'matcha-oat',
    name: '燕麦抹茶 (Matcha & Oat)',
    category: 'earth',
    colors: ['#FAF8F5', '#EFE6DD', '#B7BFA7', '#738361', '#3F4934'],
  },
  {
    id: 'bauhaus-primary',
    name: '包豪斯原色 (Bauhaus Studio)',
    category: 'minimal',
    colors: ['#FDFBF7', '#1D4ED8', '#DC2626', '#EAB308', '#18181B'],
  },
  {
    id: 'mono-silver',
    name: '纯粹银灰 (Monochrome Steel)',
    category: 'minimal',
    colors: ['#FFFFFF', '#E2E8F0', '#94A3B8', '#475569', '#0F172A'],
  },
  {
    id: 'aegean-breeze',
    name: '爱琴海晨曦 (Aegean Breeze)',
    category: 'cool',
    colors: ['#F0FDF4', '#BAE6FD', '#38BDF8', '#0284C7', '#0C4A6E'],
  },
  {
    id: 'lavender-solitude',
    name: '薰衣草静思 (Lavender Twilight)',
    category: 'cool',
    colors: ['#FAF5FF', '#E9D5FF', '#C084FC', '#7E22CE', '#3B0764'],
  },
  {
    id: 'desert-eclipse',
    name: '荒漠日蚀 (Desert Eclipse)',
    category: 'warm',
    colors: ['#1C1917', '#44403C', '#B45309', '#F59E0B', '#FEF3C7'],
  },
  {
    id: 'cyber-emerald',
    name: '赛博翠影 (Cyber Jade)',
    category: 'dark',
    colors: ['#022C22', '#064E3B', '#059669', '#34D399', '#A7F3D0'],
  },
  {
    id: 'pastel-sorbet',
    name: '冰淇淋浅调 (Pastel Sorbet)',
    category: 'vibrant',
    colors: ['#FFF1F2', '#FECDD3', '#BAE6FD', '#DDD6FE', '#FEF08A'],
  },
  {
    id: 'obsidian-gold',
    name: '黑曜金痕 (Obsidian & Raw Gold)',
    category: 'dark',
    colors: ['#121214', '#1E1E24', '#2C2B30', '#D4AF37', '#F3E5AB'],
  },
];

export function getPaletteById(id: string): Palette {
  return PALETTES.find((p) => p.id === id) || PALETTES[0];
}
