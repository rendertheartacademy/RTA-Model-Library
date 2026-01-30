
import { Plan, PlanName, Duration, TelegramChannel } from './types';

export const PLANS: Plan[] = [
  {
    name: PlanName.Essential,
    features: [
      'Interior Models',
      'Exterior Models',
      '3ds Max or SketchUp',
      'Model Studio (+$5 Value Saved)',
    ],
    prices: {
      [Duration.ThreeMonths]: { monthly: 2, total: 6, save: 0, bonus: 'Get the Lowest Launch Price' },
      [Duration.SixMonths]: { monthly: 2, total: 10, save: 2, bonus: '1 Month FREE' },
      [Duration.TwelveMonths]: { monthly: 2, total: 20, save: 4, bonus: '2 Month FREE - Free Library Management Class (Worth $30)' },
    },
  },
  {
    name: PlanName.Professional,
    isPopular: true,
    features: [
      'Interior Models',
      'Exterior Models',
      '3ds Max or SketchUp',
      'Model Studio (+$5 Value Saved)',
      'Texture Library',
    ],
    prices: {
      [Duration.ThreeMonths]: { monthly: 3, total: 9, save: 0, bonus: 'Get the Lowest Launch Price' },
      [Duration.SixMonths]: { monthly: 3, total: 15, save: 3, bonus: '1 Month FREE' },
      [Duration.TwelveMonths]: { monthly: 3, total: 30, save: 6, bonus: '2 Month FREE - Free Library Management Class (Worth $30)' },
    },
  },
  {
    name: PlanName.Premium,
    features: [
      'Interior Models',
      'Exterior Models',
      'Both 3ds Max & SketchUp',
      'Model Studio (+$5 Value Saved)',
      'Texture Library',
      'Software Library FREE',
    ],
    prices: {
      [Duration.ThreeMonths]: { monthly: 5, total: 15, save: 0, bonus: 'Get the Lowest Launch Price' },
      [Duration.SixMonths]: { monthly: 5, total: 25, save: 5, bonus: '1 Month FREE' },
      [Duration.TwelveMonths]: { monthly: 5, total: 50, save: 10, bonus: '2 Month FREE - Free Library Management Class (Worth $30)' },
    },
  },
];

export const CURRENCY_RATES = {
  MMK: 4000,
  THB: 31.38,
};

export const TELEGRAM_CHANNELS: TelegramChannel[] = [
  // 3ds Max
  { category: '3ds Max', name: 'FURNITURE MODELS', link: 'https://t.me/+kKludYZah4s1ZTU1', software: 'Max' },
  { category: '3ds Max', name: 'DECORATION MODELS', link: 'https://t.me/+Iw-k_hgquKw1NjE9', software: 'Max' },
  { category: '3ds Max', name: 'LIGHTING MODELS', link: 'https://t.me/+Z9CMWw1Av5tiNThl', software: 'Max' },
  { category: '3ds Max', name: 'KITCHEN MODELS', link: 'https://t.me/+Z-NrRs_L7ZY1NDZl', software: 'Max' },
  { category: '3ds Max', name: 'BATHROOM MODELS', link: 'https://t.me/+Y1nQ_Snq0200YzA1', software: 'Max' },
  { category: '3ds Max', name: 'DOORS AND WINDOWS MODELS', link: 'https://t.me/+0bqoDWrsCWk2NzQ1', software: 'Max' },
  { category: '3ds Max', name: 'TECH AND MUSIC MODELS', link: 'https://t.me/+Egn3HFMT8WRjOTBl', software: 'Max' },
  { category: '3ds Max', name: 'CHILDROOM MODELS', link: 'https://t.me/+S8QEZcntrHdlMzc1', software: 'Max' },
  { category: '3ds Max', name: 'STUDIO MODELS', link: 'https://t.me/+HFMkK7hWu0E4OTM9', software: 'Max' },
  { category: '3ds Max', name: 'ARCHITECTURE MODELS', link: 'https://t.me/+Fl5uePhWNDxmOGY1', software: 'Max' },
  { category: '3ds Max', name: 'TREE AND PLANTS MODELS', link: 'https://t.me/+sw2ZOLRDf65lNzM1', software: 'Max' },
  { category: '3ds Max', name: 'TRANSPORT MODELS', link: 'https://t.me/+isCr9Ma7YCY5Yzc1', software: 'Max' },
  { category: '3ds Max', name: 'RETAIL AND SPORT MODELS', link: 'https://t.me/+xBgytFIL0Uw2MmM1', software: 'Max' },
  { category: '3ds Max', name: 'PEOPLE AND ANIMAL MODELS', link: 'https://t.me/+YQPMDW8Uv4c5ZTE1', software: 'Max' },
  
  // SketchUp
  { category: 'SketchUp', name: 'STUDIO SU MODELS', link: 'https://t.me/+38ss1I5muNA4N2I1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'PEOPLE AND ANIMAL SU MODELS', link: 'https://t.me/+IXPNrp4OUbw3NzQ1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'DOORS AND WINDOWS SU MODELS', link: 'https://t.me/+P30vSBo0F0ExOGM1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'BATHROOM SU MODELS', link: 'https://t.me/+9EFqajKIpRk0ZmM1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'FURNITURE SU MODELS', link: 'https://t.me/+OepGcLQ1uo45ZGRl', software: 'SketchUp' },
  { category: 'SketchUp', name: 'DECORATION SU MODELS', link: 'https://t.me/+6Z4-Ek3lb6ZiM2I1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'ARCHITECTURE SU MODELS', link: 'https://t.me/+jfudYlDbPvc0NTJl', software: 'SketchUp' },
  { category: 'SketchUp', name: 'TRANSPORT SU MODELS', link: 'https://t.me/+wHeah4bnM1c5NTA1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'TECH AND MUSIC SU MODELS', link: 'https://t.me/+GX5CAQgx0a8yZDc1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'KITCHEN SU MODELS', link: 'https://t.me/+Hw_rf6ch0a1hNmU9', software: 'SketchUp' },
  { category: 'SketchUp', name: 'LIGHTING SU MODELS', link: 'https://t.me/+_Oze5NcJQGk2ZWI1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'TREE AND PLANTS SU MODELS', link: 'https://t.me/+d9IJjPUxQOo4NzI1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'RETAIL AND SPORT SU MODELS', link: 'https://t.me/+WuUjSf5lVS1jNWU1', software: 'SketchUp' },
  { category: 'SketchUp', name: 'CHILDROOM SU MODELS', link: 'https://t.me/+TcocTnTR0Q5lOTNl', software: 'SketchUp' },

  // Textures
  { category: 'Textures', name: 'PREMIUM TEXTURE LIBRARY', link: 'https://t.me/+3D1TpiGx8lkyNDU9', software: 'Texture' },
  { category: 'Textures', name: 'MEGASCAN LIBRARY FOR ARCHVIZ', link: 'https://t.me/+tEIgvAcol8ViYTdl', software: 'Texture' },
  
  // Software
  { category: 'Software', name: 'SOFTWARE LIBRARY - ARCHVIZ', link: 'https://t.me/+EigHzPWXiisyZWNl', software: 'Software' },
];
