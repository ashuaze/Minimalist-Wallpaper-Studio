import { ExportResolution } from '../types';

export const EXPORT_RESOLUTIONS: ExportResolution[] = [
  // PC / Desktop
  {
    label: '4K 超高清 (Desktop)',
    name: 'PC 4K Ultra HD',
    width: 3840,
    height: 2160,
    category: 'pc',
    ratio: '16:9',
  },
  {
    label: '2K 2.5K (Desktop/QHD)',
    name: 'PC 2K QHD',
    width: 2560,
    height: 1440,
    category: 'pc',
    ratio: '16:9',
  },
  {
    label: '1080P 全高清 (Desktop/FHD)',
    name: 'PC 1080P FHD',
    width: 1920,
    height: 1080,
    category: 'pc',
    ratio: '16:9',
  },
  {
    label: 'MacBook Pro Retina',
    name: 'MacBook Retina',
    width: 3024,
    height: 1964,
    category: 'pc',
    ratio: '16:10',
  },
  {
    label: '带鱼屏超宽屏 (Ultra-Wide)',
    name: 'Ultrawide 21:9',
    width: 3440,
    height: 1440,
    category: 'pc',
    ratio: '21:9',
  },

  // Phone
  {
    label: 'iPhone 16 Pro Max / 15 Pro Max',
    name: 'iPhone Pro Max',
    width: 1320,
    height: 2868,
    category: 'phone',
    ratio: '19.5:9',
  },
  {
    label: 'iPhone 16 / 15 / 14 Pro',
    name: 'iPhone Pro',
    width: 1179,
    height: 2556,
    category: 'phone',
    ratio: '19.5:9',
  },
  {
    label: 'Android 旗舰主流 (2K/FHD+)',
    name: 'Android Flagship',
    width: 1080,
    height: 2400,
    category: 'phone',
    ratio: '20:9',
  },

  // Tablet
  {
    label: 'iPad Pro 12.9" Retina',
    name: 'iPad Pro',
    width: 2048,
    height: 2732,
    category: 'tablet',
    ratio: '3:4',
  },
  {
    label: 'iPad Air / iPad 11"',
    name: 'iPad Air',
    width: 1668,
    height: 2388,
    category: 'tablet',
    ratio: '1:1.43',
  },

  // Social / Square
  {
    label: '正方形高清壁纸 / 头像',
    name: 'Square Hi-Res',
    width: 2048,
    height: 2048,
    category: 'custom',
    ratio: '1:1',
  },
];
